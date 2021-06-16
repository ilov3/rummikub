import {Stage} from 'boardgame.io/core';
import {countPoints, getTiles} from './util'
import {
    onTurnBegin,
    orderByValColor,
    orderByColorVal,
    drawTile,
    moveTile,
    endTurn,
    cancelMoves,
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


function isGameOver(G, ctx) {
    let flattened = _.flatten(G.hands[ctx.currentPlayer])
    let tilesLeft = _.some(flattened, Boolean)
    if (!tilesLeft && isBoardValid(G.board)) {
        let points = countPoints(G.hands, ctx.currentPlayer)
        return {winner: ctx.currentPlayer, points: points}
    }
}


const Rummikub = {
    name: GAME_NAME,
    setup: function (ctx, setupData) {
        console.log('GAME SETUP CALLED. CTX:', ctx)
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
                        let tilePos = {id: tile.id, col: col, row: row, gridId: HAND_GRID_ID, playerID: p.toString()}
                        hand[row][col] = tile
                        tilePositions[tile.id] = tilePos
                        tilesToDraw--
                    }
                }
            }
            hands.push(hand)
            firstMoveDone.push(false)
        }
        return {
            timePerTurn: setupData ? setupData.timePerTurn : 60,
            tiles_pool: pool,
            hands: hands,
            board: board,
            prevBoard: board,
            tilePositions: tilePositions,
            prevTilePositions: tilePositions,
            firstMoveDone: firstMoveDone,
        }
    },
    moves: {
        drawTile,
        orderByColorVal,
        orderByValColor,
        moveTile,
        endTurn,
        cancelMoves,
    },
    turn: {
        activePlayers: {all: Stage.NULL},
        onBegin: onTurnBegin,
    },
    minPlayers: 2,
    maxPlayers: 4,
    endIf: isGameOver
};
export {Rummikub}

