import {Stage} from 'boardgame.io/core';
import {countPoints, getTiles} from './util'
import {
    onTurnBegin,
    onPlayPhaseBegin,
    drawTile,
    moveTiles,
    endTurn,
    undo,
    redo,
    onTurnEnd
} from "./moves";
import {
    HAND_GRID_ID,
    HAND_COLS,
    HAND_ROWS,
    BOARD_COLS,
    BOARD_ROWS,
    TILES_TO_DRAW, GAME_NAME
} from "./constants";
import _ from "lodash";
import {isBoardValid} from "./moveValidation";
import {orderByColorVal, orderByValColor} from "./orderTiles";

function startDragging(G, ctx, tileID, initialPosition, playerID, selectedTiles, containerWidth, containerHeight) {
    G.draggingTile = {
        tileID: tileID,
        selectedTiles: selectedTiles,
        initialPosition: {
            x: initialPosition.x / containerWidth,
            y: initialPosition.y / containerHeight,
        },
        currentPosition: {
            x: initialPosition.x / containerWidth,
            y: initialPosition.y / containerHeight,
        },
        playerID: playerID,
    };
};


function updateDragging(G, ctx, currentPosition, windowWidth, windowHeight) {
    if (G.draggingTile) {
        G.draggingTile.currentPosition = {
            x: currentPosition.x / windowWidth,
            y: currentPosition.y / windowHeight,
        }
    };
};

function endDragging(G, ctx) {
    G.draggingTile = null;
};

const Rummikub = {
    name: GAME_NAME,
    setup: function (ctx, setupData) {
        console.debug('GAME SETUP CALLED. CTX:', ctx)
        let pool = ctx.random.Shuffle(getTiles())
        let board = Array.from(Array(BOARD_ROWS), _ => Array(BOARD_COLS).fill(null));
        let hands = []
        let firstMoveDone = []
        let tilePositions = {}
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
        return {
            timePerTurn: setupData ? setupData.timePerTurn : 10,
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
                startDragging,
                updateDragging,
                endDragging
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
        startDragging,
        updateDragging,
        endDragging,
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

