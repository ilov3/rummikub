import {Server, Origins} from 'boardgame.io/dist/cjs/server.js';
import {Rummikub} from "./rummikub/Game.js";

const server = Server(
    {
        games: [Rummikub],
        origins: [Origins.LOCALHOST, '*']
    }
);
server.run(9119);
