const IS_DEV = process.env.NODE_ENV === 'development'
console.debug('DEV ENV:', IS_DEV)
const HAND_ROWS = IS_DEV ? 2 : 2
const BOARD_ROWS = 9
const HAND_COLS = 22
const TILES_TO_DRAW = parseInt(process.env.REACT_APP_TILES_TO_DRAW)
const FIRST_MOVE_SCORE_LIMIT = parseInt(process.env.REACT_APP_FIRST_MOVE_SCORE_LIMIT)
const BOARD_COLS = 32
const BOARD_GRID_ID = 'b'
const HAND_GRID_ID = 'h'
const GAME_NAME = 'Rummikub'
const LOBBY_SERVER_HOST = process.env.REACT_APP_SERVER_HOST
const LOBBY_SERVER_PORT = process.env.REACT_APP_SERVER_PORT
const FRONTEND_PORT = process.env.REACT_APP_FRONTEND_PORT
const LOBBY_SERVER_PROTO = process.env.REACT_APP_SERVER_PROTO
const FRONTEND_ADDR = `${LOBBY_SERVER_HOST}:${FRONTEND_PORT}`
const IO_SOCKET_ADDR = `${LOBBY_SERVER_PROTO}://${LOBBY_SERVER_HOST}:${LOBBY_SERVER_PORT}`
const SENTRY_DSN = process.env.SENTRY_DSN
const TILE_WIDTH = 2.156
const COLOR = {
    red: 0,
    black: 1,
    blue: 2,
    orange: 3,
}
const COLORS = ['red', 'black', 'blue', 'orange']

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
    IO_SOCKET_ADDR,
    FRONTEND_ADDR,
    FRONTEND_PORT,
    IS_DEV,
    SENTRY_DSN,
    COLORS,
    COLOR,
    TILE_WIDTH,
}
