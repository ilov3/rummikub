import {Rummikub} from "../rummikub/Game";
import {Client} from 'boardgame.io/client';
import {buildTileObj, getTiles} from "../rummikub/util";
import {BOARD_COLS, BOARD_GRID_ID, BOARD_ROWS, COLOR, HAND_GRID_ID} from "../rummikub/constants";
import {Local} from "boardgame.io/multiplayer";

const blue11 = buildTileObj(11, COLOR.blue, 0)
const blue12 = buildTileObj(12, COLOR.blue, 0)
const blue13 = buildTileObj(13, COLOR.blue, 0)
const red11 = buildTileObj(11, COLOR.red, 0)
const red12 = buildTileObj(12, COLOR.red, 0)
const red13 = buildTileObj(13, COLOR.red, 0)
test('test game finish on no tiles on hand', () => {
    const RummikubFinishGame = {
        ...Rummikub,
        setup: function () {
            let pool = getTiles()
            let hands = [
                [
                    [
                        buildTileObj(11, COLOR.blue, 0),
                        buildTileObj(12, COLOR.blue, 0),
                        buildTileObj(13, COLOR.blue, 0),
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
                        buildTileObj(11, COLOR.red, 0),
                        buildTileObj(12, COLOR.red, 0),
                        buildTileObj(13, COLOR.red, 0),
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

            let tilePositions = {}
            tilePositions[43] = {id: 43, col: 0, row: 0, gridId: HAND_GRID_ID, playerID: "0"}
            tilePositions[44] = {id: 44, col: 1, row: 0, gridId: HAND_GRID_ID, playerID: "0"}
            tilePositions[45] = {id: 45, col: 2, row: 0, gridId: HAND_GRID_ID, playerID: "0"}
            tilePositions[11] = {id: 11, col: 0, row: 0, gridId: HAND_GRID_ID, playerID: "1"}
            tilePositions[12] = {id: 12, col: 1, row: 0, gridId: HAND_GRID_ID, playerID: "1"}
            tilePositions[13] = {id: 13, col: 2, row: 0, gridId: HAND_GRID_ID, playerID: "1"}

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
    const spec = {
        game: RummikubFinishGame,
        multiplayer: Local(),
    }
    const client1 = Client({
        ...spec, playerID: "0",
    });
    const client2 = Client({
        ...spec, playerID: "1",
    });
    client1.start()
    client2.start()
    client1.events.endPhase()
    client2.events.endPhase()

    client1.moves.moveTiles(0, 0, BOARD_GRID_ID, {id: 43}, [
        43,
        44,
        45,
    ])
    client1.events.endTurn()
    const {G, ctx} = client1.getState();

    expect(ctx.gameover).toEqual({winner: '0', points: 36})
});

test('test game finish on no tiles on pool', () => {
    const RummikubFinishGame = {
        ...Rummikub,
        setup: function () {
            let pool = [buildTileObj(9, COLOR.blue, 0),]
            let hands = [
                [
                    [
                        buildTileObj(11, COLOR.blue, 0),
                        buildTileObj(12, COLOR.blue, 0),
                        buildTileObj(13, COLOR.blue, 0),
                        buildTileObj(1, COLOR.blue, 0),
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
                        buildTileObj(11, COLOR.red, 0),
                        buildTileObj(12, COLOR.red, 0),
                        buildTileObj(13, COLOR.red, 0),
                        buildTileObj(1, COLOR.red, 0),
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
            let tilePositions = {}
            tilePositions[43] = {id: 43, col: 0, row: 0, gridId: HAND_GRID_ID, playerID: "0"}
            tilePositions[44] = {id: 44, col: 1, row: 0, gridId: HAND_GRID_ID, playerID: "0"}
            tilePositions[45] = {id: 45, col: 2, row: 0, gridId: HAND_GRID_ID, playerID: "0"}
            tilePositions[42] = {id: 42, col: 3, row: 0, gridId: HAND_GRID_ID, playerID: "0"}

            tilePositions[11] = {id: 11, col: 0, row: 0, gridId: HAND_GRID_ID, playerID: "1"}
            tilePositions[12] = {id: 12, col: 1, row: 0, gridId: HAND_GRID_ID, playerID: "1"}
            tilePositions[13] = {id: 13, col: 2, row: 0, gridId: HAND_GRID_ID, playerID: "1"}
            tilePositions[10] = {id: 10, col: 3, row: 0, gridId: HAND_GRID_ID, playerID: "1"}

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

    const spec = {
        game: RummikubFinishGame,
        multiplayer: Local(),
    }
    const client0 = Client({
        ...spec, playerID: "0",
    });
    const client1 = Client({
        ...spec, playerID: "1",
    });
    client0.start()
    client1.start()
    client0.events.endPhase()
    client1.events.endPhase()

    // p0 move
    client0.moves.moveTiles(0, 0, BOARD_GRID_ID, {id: 43}, [
        43,
        44,
        45,
    ])
    client0.moves.endTurn()
    // p1 move
    client1.moves.moveTiles(0, 1, BOARD_GRID_ID, {id: 11}, [
        11,
        12,
        13,
    ])
    client1.moves.endTurn()
    // p0 move
    client0.moves.drawTile()
    let {G, ctx} = client0.getState();
    expect(G.lastCircle).toEqual(['0', '1']);
    // p1 move
    client1.moves.endTurn();
    // client.moves.endTurn()
    ({G, ctx} = client0.getState());
    expect(ctx.gameover).toEqual({winner: '1', points: 10})
});