import {Stage} from 'boardgame.io/core';
import {getTiles} from './util'
import {drawTile, endTurn, moveTiles, onPlayPhaseBegin, onTurnBegin, onTurnEnd, redo, undo} from "./moves";
import {
    BOARD_COLS,
    BOARD_ROWS,
    GAME_NAME,
    HAND_COLS,
    HAND_GRID_ID,
    HAND_ROWS,
    IS_DEV,
    TILES_TO_DRAW
} from "./constants";
import {orderByColorVal, orderByValColor} from "./orderTiles";


const Rummikub = {
    name: GAME_NAME,
    setup: function ({ctx, random}, setupData) {
        console.debug('GAME SETUP CALLED. CTX:', ctx)
        let pool = random.Shuffle(getTiles())
        let board = Array.from(Array(BOARD_ROWS), _ => Array(BOARD_COLS).fill(null));
        let hands = []
        let firstMoveDone = []
        let tilePositions = {}
        if (IS_DEV) {
            let pool = getTiles()
            for (let p = 0; p < ctx.numPlayers; p++) {
                let tilesToDraw = 3
                let hand = Array.from(Array(HAND_ROWS), _ => Array(HAND_COLS).fill(null));
                for (let row = 0; row < HAND_ROWS; row++) {
                    for (let col = 0; col < HAND_COLS; col++) {
                        if (tilesToDraw > 0) {
                            let tile = pool.shift()
                            let tilePos = {id: tile, col: col, row: row, gridId: HAND_GRID_ID, playerID: p.toString()}
                            hand[row][col] = tile
                            tilePositions[tile] = tilePos
                            tilesToDraw--
                        }
                    }
                }
                hands.push(hand)
                firstMoveDone.push(true)
            }

        } else {
            for (let p = 0; p < ctx.numPlayers; p++) {
                let tilesToDraw = TILES_TO_DRAW
                let hand = Array.from(Array(HAND_ROWS), _ => Array(HAND_COLS).fill(null));
                for (let row = 0; row < HAND_ROWS; row++) {
                    for (let col = 0; col < HAND_COLS; col++) {
                        if (tilesToDraw > 0) {
                            let tile = pool.pop()
                            let tilePos = {id: tile, col: col, row: row, gridId: HAND_GRID_ID, playerID: p.toString()}
                            hand[row][col] = tile
                            tilePositions[tile] = tilePos
                            tilesToDraw--
                        }
                    }
                }
                hands.push(hand)
                firstMoveDone.push(false)
            }
        }
        return {
            timePerTurn: (setupData ? setupData.timePerTurn : 10) * 1000,
            timerExpireAt: null,
            tilesPool: pool,
            hands: hands,
            board: board,
            prevBoard: board,
            tilePositions: tilePositions,
            prevTilePositions: tilePositions,
            firstMoveDone: firstMoveDone,
            gameStateStack: [],
            redoMoveStack: [],
            lastCircle: [],
        }
    },
    phases: {
        playersJoin: {
            start: true,
            moves: {
                orderByColorVal,
                orderByValColor,
                moveTiles,
                undo,
                redo,
            },
            next: 'play'
        },
        play: {
            onBegin: onPlayPhaseBegin,
        }
    },
    moves: {
        drawTile,
        orderByColorVal,
        orderByValColor,
        moveTiles,
        endTurn,
        undo,
        redo,
    },
    turn: {
        activePlayers: {all: Stage.NULL},
        onBegin: onTurnBegin,
        onEnd: onTurnEnd,
    },
    minPlayers: 2,
    maxPlayers: 4,
};
export {Rummikub}

