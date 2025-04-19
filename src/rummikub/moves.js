import {BOARD_GRID_ID, HAND_GRID_ID} from "./constants";
import _ from "lodash";
import {
    isCalledByActivePlayer,
    isBoardHasNewTiles,
    isFirstMoveValid,
    isFirstMove,
    isMoveValid,
    freezeTmpTiles, isBoardValid,
} from "./moveValidation";
import {
    countPoints,
    findWinner,
    getSecTs,
    getGameState,
    getTileReadableName
} from "./util";
import {original} from "immer"
import {current} from 'immer';
import {INVALID_MOVE} from 'boardgame.io/core';
import {pushTilesToGrid} from "./orderTiles";

function getGridByIdPlayer(G, gridId, playerId) {
    let grid = null
    if (gridId === BOARD_GRID_ID) {
        grid = G.board
    }
    if (gridId === HAND_GRID_ID) {
        grid = G.hands[parseInt(playerId)]
    }
    console.assert(grid !== null, `Could not resolve grid for ${gridId}:${playerId}`)
    return grid
}


function drawTile(G, ctx, doRollback = true) {
    if (!isCalledByActivePlayer(ctx)) return INVALID_MOVE
    if (doRollback) {
        rollbackChanges(G, ctx.currentPlayer, ctx)
    }
    let hand = G.hands[ctx.currentPlayer]
    let tiles = []
    let firstMoveDone = G.firstMoveDone[ctx.currentPlayer]
    for (let i = 0; i < (firstMoveDone ? 2 : 1); i++) {
        let tile = G.tilesPool.pop()
        if (!tile) {
            break
        } else {
            tiles.push(tile)
        }
    }
    console.log(`tiles pool: ${current(G.tilesPool)}`)
    console.log(`last circle ${current(G.lastCircle)}`)
    if (!G.tilesPool.length) {
        G.lastCircle.push(ctx.currentPlayer)
    }

    pushTilesToGrid(tiles, hand, G, {
        gridId: HAND_GRID_ID,
        playerID: ctx.currentPlayer
    }, ctx)
    ctx.events.endTurn()
}


function isOverlap(G, ctx, col, row, destGridId, tileId) {
    let currPlayer = ctx.playerID
    if (destGridId === BOARD_GRID_ID && G.board[row][col]
        || destGridId === HAND_GRID_ID && G.hands[currPlayer][row][col]) {
        console.debug('TILE OVERLAP')
        return true
    }
    return false
}

function moveTiles(G, ctx, col, row, destGridId, tileIdObj, selectedTiles) {
    if (isCalledByActivePlayer(ctx)) {
        G.gameStateStack.push(getGameState(G))
    }
    console.debug('MOVE TILE:', col, row, destGridId, tileIdObj, selectedTiles)
    let tileId = tileIdObj.id

    function insertTile(tileId, destGridId, destRow, destCol) {
        if (isOverlap(G, ctx, destCol, destRow, destGridId, tileId)) {
            console.debug('overlap detected!')
            return INVALID_MOVE;
        }
        let currPos = G.tilePositions[tileId]
        let currPlayer = ctx.playerID
        let fromHandToBoard = currPos.gridId === HAND_GRID_ID && destGridId === BOARD_GRID_ID
        let fromHandToHand = currPos.gridId === HAND_GRID_ID && destGridId === HAND_GRID_ID
        let fromBoardToBoard = currPos.gridId === BOARD_GRID_ID && destGridId === BOARD_GRID_ID
        let fromBoardToHand = currPos.gridId === BOARD_GRID_ID && destGridId === HAND_GRID_ID && currPos.tmp
        let sourceRow = currPos.row
        let sourceCol = currPos.col
        let flags = null
        let source = null
        let dest = null

        if (fromHandToBoard) {
            if (!isCalledByActivePlayer(ctx) || ctx.phase === 'playersJoin') return INVALID_MOVE
            source = G.hands[currPlayer]
            dest = G.board
            flags = {tmp: true, playerID: null}

        } else if (fromHandToHand) {
            source = G.hands[currPlayer]
            dest = G.hands[currPlayer]
            flags = {tmp: false, playerID: currPos.playerID}
        } else if (fromBoardToBoard) {
            if (!isCalledByActivePlayer(ctx)) return INVALID_MOVE
            source = G.board
            dest = G.board
            flags = {tmp: currPos.tmp, playerID: currPos.playerID}
        } else if (fromBoardToHand) {
            if (!isCalledByActivePlayer(ctx)) return INVALID_MOVE
            source = G.board
            dest = G.hands[currPlayer]
            flags = {tmp: false, playerID: currPlayer}
        } else {
            return INVALID_MOVE
        }
        if (destRow >= dest.length || destCol >= dest[0].length) return INVALID_MOVE
        console.debug("INSERT TILE:", getTileReadableName(tileId), sourceRow, sourceCol, destRow, destCol, flags, selectedTiles)
        dest[destRow][destCol] = source[sourceRow][sourceCol]
        source[sourceRow][sourceCol] = null
        G.tilePositions[tileId] = {id: tileId, col: destCol, row: destRow, gridId: destGridId, ...flags}
    }

    if (selectedTiles.length > 0 && selectedTiles.indexOf(tileId) !== -1) {
        selectedTiles.map(function (id, index) {
            insertTile(id, destGridId, row, col + index)
        })
    } else {
        insertTile(tileId, destGridId, row, col)
    }
}

function endTurn(G, ctx) {
    if (!isCalledByActivePlayer(ctx)) {
        console.log('>>>>> invalid move endTurn')
        return INVALID_MOVE
    }
    console.debug('END TURN CALLED', ctx.currentPlayer)
    if (isBoardHasNewTiles(G)) {
        console.debug('BOARD IS DIRTY')
        validatePlayerMove(G, ctx)
    } else {
        console.debug('BOARD IS CLEAN')
        drawTile(G, ctx, !isBoardValid(G.board))
    }
}

function rollbackChanges(G, player, ctx) {
    let tilesToReturnBack = []
    let boardTiles = _.flatten(G.board)
    for (let tile of boardTiles) {
        if (tile) {
            let tilePos = G.tilePositions[tile]
            if (tilePos.tmp) {
                tilesToReturnBack.push(G.board[tilePos.row][tilePos.col])
                G.tilePositions[tile] = null
            } else {
                G.tilePositions[tile] = G.prevTilePositions[tile]
            }
        }
    }
    pushTilesToGrid(tilesToReturnBack, G.hands[player], G, {gridId: HAND_GRID_ID, playerID: player}, ctx)
    G.board = original(G.prevBoard)
    freezeTmpTiles(G)
}

function undo(G, ctx) {
    if (!isCalledByActivePlayer(ctx)) return INVALID_MOVE
    let currPlayer = ctx.playerID
    let lastGameState = G.gameStateStack.pop()
    if (!lastGameState) {
        console.log('No moves to undo')
        return INVALID_MOVE
    }
    let currentState = getGameState(G)
    G.redoMoveStack.push(currentState)
    G.hands[currPlayer] = lastGameState.hands[currPlayer]
    G.board = lastGameState.board
    G.prevBoard = lastGameState.prevBoard
    for (const [key, value] of Object.entries(lastGameState.tilePositions)) {
        if (value.gridId === BOARD_GRID_ID || (value.gridId === HAND_GRID_ID && value.playerID === currPlayer)) {
            G.tilePositions[value.id] = original(value)
        }
    }
    for (const [key, value] of Object.entries(lastGameState.prevTilePositions)) {
        if (value.gridId === BOARD_GRID_ID || (value.gridId === HAND_GRID_ID && value.playerID === currPlayer)) {
            G.prevTilePositions[value.id] = original(value)
        }
    }
    console.log('undo done')
}

function redo(G, ctx) {
    if (!isCalledByActivePlayer(ctx)) return INVALID_MOVE
    let currPlayer = ctx.playerID
    let nextGameState = G.redoMoveStack.pop()
    if (!nextGameState) {
        console.log('No moves to redo')
        return INVALID_MOVE
    }
    G.hands[currPlayer] = nextGameState.hands[currPlayer]
    G.board = nextGameState.board
    G.prevBoard = nextGameState.prevBoard
    for (const [key, value] of Object.entries(nextGameState.tilePositions)) {
        if (value.gridId === BOARD_GRID_ID || (value.gridId === HAND_GRID_ID && value.playerID === currPlayer)) {
            G.tilePositions[value.id] = value
        }
    }
    for (const [key, value] of Object.entries(nextGameState.prevTilePositions)) {
        if (value.gridId === BOARD_GRID_ID || (value.gridId === HAND_GRID_ID && value.playerID === currPlayer)) {
            G.prevTilePositions[value.id] = value
        }
    }
    console.log('redo done')
}

function validatePlayerMove(G, ctx) {
    let player = ctx.currentPlayer
    console.debug('VALIDATE PLAYER MOVE', player)
    let moveValid = false
    if (isFirstMove(G, ctx)) {
        console.debug("FIRST MOVE")
        moveValid = isFirstMoveValid(G, ctx)
    } else {
        console.debug("NOT FIRST MOVE")
        moveValid = isMoveValid(G, ctx)
    }
    if (moveValid) {
        console.debug('MOVE VALID')
        G.firstMoveDone[player] = true
        freezeTmpTiles(G)
        ctx.events.endTurn()
    } else {
        console.debug('MOVE INVALID')
        drawTile(G, ctx)
    }
}

function onPlayPhaseBegin(G, ctx) {
    console.log('PLAY PHASE BEGIN', new Date())
    G.timerExpireAt = getSecTs() + G.timePerTurn
    return G
}

function onTurnBegin(G, ctx) {
    console.log('ON TURN BEGIN', new Date())
    G.timerExpireAt = getSecTs() + G.timePerTurn
    G.gameStateStack = []
    G.redoMoveStack = []
    if (G.lastCircle.length) {
        G.lastCircle.push(ctx.currentPlayer)
    }
    G.prevBoard = original(G.board);
    G.prevTilePositions = original(G.tilePositions)
    return G
}

function onTurnEnd(G, ctx) {
    console.log('ON TURN END', new Date())
    G.timerExpireAt = null
    checkGameOver(G, ctx)
}

function checkGameOver(G, ctx) {
    if (G.lastCircle.length >= ctx.numPlayers) {
        let winner = findWinner(G.hands)
        let points = countPoints(G.hands, winner)
        ctx.events.endGame({winner: winner.toString(), points: points})
    }

    let flattened = _.flatten(G.hands[ctx.currentPlayer])
    let tilesLeft = _.some(flattened, Boolean)
    if (!tilesLeft && isBoardValid(G.board)) {
        let points = countPoints(G.hands, ctx.currentPlayer)
        ctx.events.endGame({winner: ctx.currentPlayer, points: points})
    }
    return G
}

export {
    endTurn,
    moveTiles,
    validatePlayerMove,
    onTurnBegin,
    onTurnEnd,
    onPlayPhaseBegin,
    drawTile,
    getGridByIdPlayer,
    undo,
    redo,
    checkGameOver
}