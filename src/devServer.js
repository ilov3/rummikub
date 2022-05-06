import {Server, Origins} from 'boardgame.io/server';
import {Rummikub} from "./rummikub/Game";

const server = Server(
    {
        games: [Rummikub],
        origins: [Origins.LOCALHOST, '*']
    }
);
server.run(9119);
