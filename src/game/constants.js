const IS_DEV = process.env.NODE_ENV === 'development'
console.log('DEV ENV:', IS_DEV)
const HAND_ROWS = 3
const BOARD_ROWS = 9
const HAND_COLS = 14
const TILES_TO_DRAW = IS_DEV ? 36 : 14
const FIRST_MOVE_SCORE_LIMIT = IS_DEV ? 10 : 30;
const BOARD_COLS = 30
const BOARD_GRID_ID = 'board'
const HAND_GRID_ID = 'hand'
const GAME_NAME = 'Rummikub'
const LOBBY_SERVER_HOST = IS_DEV ? 'localhost' : 'rummi.uk'
const LOBBY_SERVER_PORT = IS_DEV ? '9119' : '443'
const FRONTEND_PORT = IS_DEV ? '3000' : '443'
const LOBBY_SERVER_PROTO = IS_DEV ? 'http' : 'https'

export {
    HAND_COLS,
    HAND_ROWS,
    FIRST_MOVE_SCORE_LIMIT,
    BOARD_COLS,
    BOARD_ROWS,
    BOARD_GRID_ID,
    HAND_GRID_ID,
    TILES_TO_DRAW,
    GAME_NAME,
    LOBBY_SERVER_HOST,
    LOBBY_SERVER_PORT,
    LOBBY_SERVER_PROTO,
    FRONTEND_PORT,
}