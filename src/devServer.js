import {Server} from 'boardgame.io/server';
import {Rummikub} from "./rummikub/Game";

const server = Server({games: [Rummikub]});
server.run(9119);
