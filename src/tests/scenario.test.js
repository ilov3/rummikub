import {Rummikub} from "../rummikub/Game";
import {Client} from 'boardgame.io/client';
import {getTiles} from "../rummikub/util";
import {BOARD_COLS, BOARD_GRID_ID, BOARD_ROWS, COLOR, HAND_GRID_ID} from "../rummikub/constants";

test('test game finish on no tiles on hand', () => {
    const RummikubFinishGame = {
        ...Rummikub,
        setup: function () {
            let pool = getTiles()
            let hands = [
                [
                    [
                        {color: COLOR.blue, value: 11, id: "0-11-2", i: 0},
                        {color: COLOR.blue, value: 12, id: "0-12-2", i: 0},
                        {color: COLOR.blue, value: 13, id: "0-13-2", i: 0},
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
                        {color: COLOR.red, value: 11, id: "0-11-0", i: 0},
                        {color: COLOR.red, value: 12, id: "0-12-0", i: 0},
                        {color: COLOR.red, value: 13, id: "0-13-0", i: 0},
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
                "0-11-2": {id: "0-11-2", col: 0, row: 0, gridId: HAND_GRID_ID, playerID: "0"},
                "0-12-2": {id: "0-12-2", col: 1, row: 0, gridId: HAND_GRID_ID, playerID: "0"},
                "0-13-2": {id: "0-13-2", col: 2, row: 0, gridId: HAND_GRID_ID, playerID: "0"},
                "0-11-0": {id: "0-11-0", col: 0, row: 0, gridId: HAND_GRID_ID, playerID: "1"},
                "0-12-0": {id: "0-12-0", col: 1, row: 0, gridId: HAND_GRID_ID, playerID: "1"},
                "0-13-0": {id: "0-13-0", col: 2, row: 0, gridId: HAND_GRID_ID, playerID: "1"},
            }
            return {
                timePerTurn: 60,
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
        }
    }

    const client = Client({
        game: RummikubFinishGame,
    });

    client.moves.moveTiles(0, 0, BOARD_GRID_ID, {id: "0-11-2"}, [
        "0-11-2",
        "0-12-2",
        "0-13-2",
    ])
    client.events.endTurn()
    const {G, ctx} = client.store.getState();

    expect(ctx.gameover).toEqual({winner: '0', points: 36})
});

test('test game finish on no tiles on pool', () => {
    const RummikubFinishGame = {
        ...Rummikub,
        setup: function () {
            let pool = [{color: COLOR.blue, value: 9, id: "0-9-2", i: 0}]
            let hands = [
                [
                    [
                        {color: COLOR.blue, value: 11, id: "0-11-2", i: 0},
                        {color: COLOR.blue, value: 12, id: "0-12-2", i: 0},
                        {color: COLOR.blue, value: 13, id: "0-13-2", i: 0},
                        {color: COLOR.blue, value: 1, id: "0-1-2", i: 0},
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
                        {color: COLOR.red, value: 11, id: "0-11-0", i: 0},
                        {color: COLOR.red, value: 12, id: "0-12-0", i: 0},
                        {color: COLOR.red, value: 13, id: "0-13-0", i: 0},
                        {color: COLOR.red, value: 1, id: "0-1-0", i: 0},
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
                "0-11-2": {id: "0-11-2", col: 0, row: 0, gridId: HAND_GRID_ID, playerID: "0"},
                "0-12-2": {id: "0-12-2", col: 1, row: 0, gridId: HAND_GRID_ID, playerID: "0"},
                "0-13-2": {id: "0-13-2", col: 2, row: 0, gridId: HAND_GRID_ID, playerID: "0"},
                "0-10-2": {id: "0-10-2", col: 3, row: 0, gridId: HAND_GRID_ID, playerID: "0"},
                "0-11-0": {id: "0-11-0", col: 0, row: 0, gridId: HAND_GRID_ID, playerID: "1"},
                "0-12-0": {id: "0-12-0", col: 1, row: 0, gridId: HAND_GRID_ID, playerID: "1"},
                "0-13-0": {id: "0-13-0", col: 2, row: 0, gridId: HAND_GRID_ID, playerID: "1"},
                "0-1-0": {id: "0-1-0", col: 3, row: 0, gridId: HAND_GRID_ID, playerID: "1"},
            }
            return {
                timePerTurn: 60,
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
        }
    }

    const client = Client({
        game: RummikubFinishGame,
    });

    // p0 move
    client.moves.moveTiles(0, 0, BOARD_GRID_ID, {id: "0-11-2"}, [
        "0-11-2",
        "0-12-2",
        "0-13-2",
    ])
    client.moves.endTurn()
    // p1 move
    client.moves.moveTiles(0, 1, BOARD_GRID_ID, {id: "0-11-0"}, [
        "0-11-0",
        "0-12-0",
        "0-13-0",
    ])
    client.moves.endTurn()
    // p0 move
    client.moves.drawTile()
    let {G, ctx} = client.store.getState();
    expect(G.lastCircle).toEqual(['0', '1']);
    // p1 move
    client.moves.endTurn();
    // client.moves.endTurn()
    ({G, ctx} = client.store.getState());
    expect(ctx.gameover).toEqual({winner: '1', points: 10})
});