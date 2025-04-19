import {Server, Origins} from 'boardgame.io/server';
import path from 'path';
import serve from 'koa-static';
import {Rummikub} from "./rummikub/Game";
import {FRONTEND_ADDR} from "./rummikub/constants";

const server = Server({
    games: [Rummikub],
    apiOrigins: [Origins.LOCALHOST, `http://${FRONTEND_ADDR}`],
    origins: [Origins.LOCALHOST, `http://${FRONTEND_ADDR}`]
});
const PORT = process.env.PORT || 9119;

// Build path relative to the server.js file
const frontEndAppBuildPath = path.resolve(__dirname, '../build');
server.app.use(serve(frontEndAppBuildPath))

server.run(PORT, () => {
    server.app.use(
        async (ctx, next) => await serve(frontEndAppBuildPath)(
            Object.assign(ctx, {path: 'index.html'}),
            next
        )
    )
});

