import {HAND_COLS, HAND_ROWS, BOARD_GRID_ID, HAND_GRID_ID} from "./constants";
import _ from "lodash";
import {
    isCalledByActivePlayer,
    isBoardDirty,
    isFirstMoveValid,
    isFirstMove,
    isMoveValid,
    freezeTmpTiles,
} from "./moveValidation";

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

function removeFromPos(tilePos, G, ctx) {
    let grid = getGridByIdPlayer(G, tilePos.gridId, tilePos.playerID)
    grid[tilePos.row][tilePos.col] = null
}

function pushTilesToGrid(tiles, grid, G, flags, ctx, override) {
    let rowsCnt = grid.length
    let colsCnt = grid[0].length

    for (let row = 0; row < rowsCnt; row++) {
        for (let col = 0; col < colsCnt; col++) {
            if (!grid[row][col] || override) {
                let tile = tiles.shift()
                if (tile) {
                    grid[row][col] = tile
                    G.tilePositions[tile.id] = {
                        id: tile.id,
                        col: col,
                        row: row,
                        ...flags,
                    }
                } else {
                    grid[row][col] = null
                }
            }
        }
    }
}

function drawTile(G, ctx) {
    if (!isCalledByActivePlayer(ctx)) return
    rollbackChanges(G, ctx.currentPlayer, ctx)
    let hand = G.hands[ctx.currentPlayer]
    let tiles = []
    let firstMoveDone = G.firstMoveDone[ctx.currentPlayer]
    for (let i = 0; i < (firstMoveDone ? 2 : 1); i++) {
        let tile = G.tiles_pool.pop()
        if (!tile) {
            break
        } else {
            tiles.push(tile)
        }
    }

    pushTilesToGrid(tiles, hand, G, {
        gridId: HAND_GRID_ID,
        playerID: ctx.currentPlayer
    }, ctx)
    ctx.events.endTurn()
}

function extractDups(arr) {
    let dupsMap = {}
    let dups = []
    let res = _.filter(arr, function (tile) {
        let tileVal = tile && `${tile.color}:${tile.value}`
        if (tile && !dupsMap.hasOwnProperty(tileVal)) {
            dupsMap[tileVal] = tileVal
            return true
        } else {
            tile && dups.push(tile)
        }
    })
    return [res, dups]
}

function orderByColorVal(G, ctx) {
    let tiles = G.hands[ctx.playerID]
    let flattened = _.flatten(tiles)
    let [arr, dups] = extractDups(flattened)

    let sorted = _.orderBy(arr, ['color', 'value'], ['asc'])
    sorted.push(..._.orderBy(dups, ['color', 'value'], ['asc']))
    console.log(sorted.length)
    pushTilesToGrid(sorted, G.hands[ctx.playerID], G,
        {gridId: HAND_GRID_ID, playerID: ctx.playerID}, ctx, true)
}

function orderByValColor(G, ctx) {
    let tiles = G.hands[ctx.playerID]
    let flattened = _.flatten(tiles)
    let [arr, dups] = extractDups(flattened)

    let sorted = _.orderBy(arr, ['value', 'color'], ['asc'])
    sorted.push(..._.orderBy(dups, ['value', 'color'], ['asc']))
    console.log(sorted.length)
    pushTilesToGrid(sorted, G.hands[ctx.playerID], G,
        {gridId: HAND_GRID_ID, playerID: ctx.playerID}, ctx, true)
}

function isOverlap(G, ctx, col, row, destGridId, tileId) {
    let currPlayer = ctx.playerID
    if (destGridId === BOARD_GRID_ID && G.board[row][col]
        || destGridId === HAND_GRID_ID && G.hands[currPlayer][row][col]) {
        console.log('TILE OVERLAP')
        return true
    }
    return false
}

function moveTile(G, ctx, col, row, destGridId, tileIdObj, selectedTiles) {
    let tileId = tileIdObj.id

    function insertTile(tileId, destGridId, destRow, destCol) {
        if (isOverlap(G, ctx, destCol, destRow, destGridId, tileId)) return
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
        console.log("INSERT TILE:", tileId, sourceRow, sourceCol, destRow, destCol, flags)

        if (fromHandToBoard) {
            if (!isCalledByActivePlayer(ctx)) return
            source = G.hands[currPlayer]
            dest = G.board
            flags = {tmp: true, playerID: null}

        } else if (fromHandToHand) {
            source = G.hands[currPlayer]
            dest = G.hands[currPlayer]
            flags = {tmp: false, playerID: currPos.playerID}
        } else if (fromBoardToBoard) {
            if (!isCalledByActivePlayer(ctx)) return
            source = G.board
            dest = G.board
            flags = {tmp: currPos.tmp, playerID: currPos.playerID}
        } else if (fromBoardToHand) {
            if (!isCalledByActivePlayer(ctx)) return
            source = G.board
            dest = G.hands[currPlayer]
            flags = {tmp: false, playerID: currPlayer}
        } else {
            return
        }

        dest[destRow][destCol] = source[sourceRow][sourceCol]
        source[sourceRow][sourceCol] = null
        let tilePos = {id: tileId, col: destCol, row: destRow, gridId: destGridId, ...flags}
        G.tilePositions[tileId] = tilePos
        console.log('DROP END', Date.now())
    }

    if (selectedTiles.length > 0) {
        selectedTiles.map(function (id, index) {
            insertTile(id, destGridId, row, col + index)
        })
    } else {
        insertTile(tileId, destGridId, row, col)
    }
}

function endTurn(G, ctx) {
    if (!isCalledByActivePlayer(ctx)) return
    console.log('END TURN CALLED', ctx.currentPlayer)
    if (isBoardDirty(G)) {
        console.log('BOARD IS DIRTY')
        onTurnEnd(G, ctx)
    } else {
        console.log('BOARD IS CLEAN')
        drawTile(G, ctx)
    }
}

function rollbackChanges(G, player, ctx) {
    let tilesToReturnBack = []
    let boardTiles = _.flatten(G.board)
    for (let tile of boardTiles) {
        if (tile) {
            let tilePos = G.tilePositions[tile.id]
            if (tilePos.tmp) {
                tilesToReturnBack.push(G.board[tilePos.row][tilePos.col])
                G.tilePositions[tile.id] = null
            } else {
                G.tilePositions[tile.id] = G.prevTilePositions[tile.id]
            }
        }
    }
    pushTilesToGrid(tilesToReturnBack, G.hands[player], G, {gridId: HAND_GRID_ID, playerID: player}, ctx)
    G.board = G.prevBoard
    freezeTmpTiles(G)
}

function cancelMoves(G, ctx) {
    rollbackChanges(G, ctx.currentPlayer, ctx)
}

function onTurnEnd(G, ctx) {
    let player = ctx.currentPlayer
    console.log('ON TURN END', player)
    let moveValid = false
    if (isFirstMove(G, ctx)) {
        console.log("FIRST MOVE")
        moveValid = isFirstMoveValid(G, ctx)
    } else {
        console.log("NOT FIRST MOVE")
        moveValid = isMoveValid(G, ctx)
    }
    if (moveValid) {
        console.log('MOVE VALID')
        G.firstMoveDone[player] = true
        freezeTmpTiles(G)
        ctx.events.endTurn()
    } else {
        console.log('MOVE INVALID')
        drawTile(G, ctx)
    }
}

function onTurnBegin(G, ctx) {
    console.log('NEW TURN', new Date())
    G.prevBoard = G.board;
    G.prevTilePositions = G.tilePositions
}

export {
    endTurn,
    moveTile,
    orderByColorVal,
    orderByValColor,
    onTurnEnd,
    onTurnBegin,
    drawTile,
    cancelMoves,
    getGridByIdPlayer
}