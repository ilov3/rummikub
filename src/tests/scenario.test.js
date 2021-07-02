import {Rummikub} from "../rummikub/Game";
import {Client} from 'boardgame.io/client';
import {getTiles} from "../rummikub/util";
import {BOARD_COLS, BOARD_GRID_ID, BOARD_ROWS, HAND_GRID_ID} from "../rummikub/constants";

test('test game finish on no tiles', () => {
    const RummikubFinishGame = {
        ...Rummikub,
        setup: function () {
            let pool = getTiles()
            let hands = [
                [
                    [
                        {color: "blue", value: 11, id: "0-11-blue", i: 0},
                        {color: "blue", value: 12, id: "0-12-blue", i: 0},
                        {color: "blue", value: 13, id: "0-13-blue", i: 0},
                        null, null, null, null, null, null, null, null, null, null, null,
                    ],
                    [
                        null, null, null, null, null, null, null, null, null, null, null, null, null, null
                    ],
                    [
                        null, null, null, null, null, null, null, null, null, null, null, null, null, null
                    ],
                ],
                [
                    [
                        {color: "red", value: 11, id: "0-11-red", i: 0},
                        {color: "red", value: 12, id: "0-12-red", i: 0},
                        {color: "red", value: 13, id: "0-13-red", i: 0},
                        null, null, null, null, null, null, null, null, null, null, null,
                    ],
                    [
                        null, null, null, null, null, null, null, null, null, null, null, null, null, null
                    ],
                    [
                        null, null, null, null, null, null, null, null, null, null, null, null, null, null
                    ],
                ],
            ]
            let board = Array.from(Array(BOARD_ROWS), _ => Array(BOARD_COLS).fill(null));
            let firstMoveDone = [true, true]
            let tilePositions = {
                "0-11-blue": {id: "0-11-blue", col: 0, row: 0, gridId: HAND_GRID_ID, playerID: "0"},
                "0-12-blue": {id: "0-12-blue", col: 1, row: 0, gridId: HAND_GRID_ID, playerID: "0"},
                "0-13-blue": {id: "0-13-blue", col: 2, row: 0, gridId: HAND_GRID_ID, playerID: "0"},
                "0-11-red": {id: "0-11-red", col: 0, row: 0, gridId: HAND_GRID_ID, playerID: "1"},
                "0-12-red": {id: "0-12-red", col: 1, row: 0, gridId: HAND_GRID_ID, playerID: "1"},
                "0-13-red": {id: "0-13-red", col: 2, row: 0, gridId: HAND_GRID_ID, playerID: "1"},
            }
            return {
                timePerTurn: 60,
                tiles_pool: pool,
                hands: hands,
                board: board,
                prevBoard: board,
                tilePositions: tilePositions,
                prevTilePositions: tilePositions,
                firstMoveDone: firstMoveDone,
            }
        }
    }

    const client = Client({
        game: RummikubFinishGame,
    });

    client.moves.moveTiles(0, 0, BOARD_GRID_ID, {id: "0-11-blue"}, [
        "0-11-blue",
        "0-12-blue",
        "0-13-blue",
    ])

    const { G, ctx } = client.store.getState();

    expect(ctx.gameover).toEqual({winner: '0', points: 36})
});