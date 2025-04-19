import {Client} from 'boardgame.io/react';
import {Rummikub} from "../Game";
import RummikubBoard from "./Board";
import {useParams, useLocation, useNavigate} from "react-router-dom"
import {SocketIO} from "boardgame.io/multiplayer";
import {IO_SOCKET_ADDR} from "../constants";
import React, {useEffect, useState} from "react";

const GameMatch = function (props) {
    let {matchID} = useParams();
    let [locationState, setLocationState] = useState({});

    console.debug(matchID)
    let location = useLocation();
    console.debug('STATE:', location.state)
    const navigate = useNavigate()
    useEffect(() => {
        if (!location.state) {
            navigate(`/join-match/${matchID}`)
        } else {
            setLocationState(location.state)
            sessionStorage.setItem("authToken", location.state.creds);
        }
    }, [location.state, navigate]);
    let PlayerClient = Client({
        numPlayers: locationState.numPlayers,
        game: Rummikub,
        board: RummikubBoard,
        multiplayer: SocketIO(
            {server: IO_SOCKET_ADDR}),
        playerCreds: locationState.creds,
    })
    return <PlayerClient credentials={locationState.creds}
                         matchID={matchID}
                         playerID={locationState.playerID?.toString()}/>
}

export default GameMatch