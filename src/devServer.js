import {Server} from 'boardgame.io/server';
import {Rummikub} from "./game/Game";

const server = Server({games: [Rummikub]});
server.run(9119);
