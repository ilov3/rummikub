import {Stage} from 'boardgame.io/dist/cjs/core.js';
import {getTiles} from './util.js'
import {drawTile, endTurn, moveTiles, onPlayPhaseBegin, onTurnBegin, onTurnEnd, redo, undo} from "./moves.js";
import {GAME_NAME, HAND_COLS, HAND_GRID_ID, HAND_ROWS, TILES_TO_DRAW} from "./constants.js";
import {orderByColorVal, orderByValColor} from "./orderTiles.js";


const Rummikub = {
    name: GAME_NAME,
    setup: function ({ctx, random}, setupData) {
        console.debug('GAME SETUP CALLED. CTX:', ctx)
        let pool = random.Shuffle(getTiles())
        let firstMoveDone = []
        let tilePositions = {}

        for (let p = 0; p < ctx.numPlayers; p++) {
            let tilesToDraw = TILES_TO_DRAW
            for (let row = 0; row < HAND_ROWS; row++) {
                for (let col = 0; col < HAND_COLS; col++) {
                    if (tilesToDraw > 0) {
                        let tile = pool.pop()
                        tilePositions[tile] = {
                            id: tile,
                            col: col,
                            row: row,
                            gridId: HAND_GRID_ID,
                            playerID: p.toString()
                        }
                        tilesToDraw--
                    }
                }
            }
            firstMoveDone.push(false)
        }
        return {
            timePerTurn: (setupData ? setupData.timePerTurn : 10) * 1000,
            timerExpireAt: null,
            tilesPool: pool,
            tilePositions: tilePositions,
            prevTilePositions: tilePositions,
            firstMoveDone: firstMoveDone,
            gameStateStack: [],
            redoMoveStack: [],
            lastCircle: [],
            recentlyDrawnTiles: [],
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
        clearRecentlyDrawnTiles: ({G, ctx}) => {
            G.recentlyDrawnTiles = []
        }
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

