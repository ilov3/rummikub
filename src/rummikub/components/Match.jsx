import {Client} from 'boardgame.io/react';
import {Rummikub} from "../Game";
import RummikubBoard from "./Board";
import {useParams, useLocation} from "react-router-dom"
import {SocketIO} from "boardgame.io/multiplayer";
import {LOBBY_SERVER_HOST, LOBBY_SERVER_PORT, LOBBY_SERVER_PROTO} from "../constants";
import React from "react";

const GameMatch = function (props) {
    let {matchID} = useParams();
    console.debug(matchID)
    let location = useLocation();
    console.debug('STATE:', location.state)
    let PlayerClient = Client({
        numPlayers: location.state.numPlayers,
        game: Rummikub,
        board: RummikubBoard,
        multiplayer: SocketIO(
            {server: `${LOBBY_SERVER_PROTO}://${LOBBY_SERVER_HOST}:${LOBBY_SERVER_PORT}`}),
    })
    return <PlayerClient credentials={location.state.creds}
                         matchID={matchID}
                         playerID={location.state.playerID.toString()}/>
}

export default GameMatch