import {GameLobby} from "./game/Lobby"
import {
    Switch,
    Route
} from "react-router-dom";
import React from "react";
import GameMatch from "./game/Match";
import {Client} from "boardgame.io/react";
import {Rummikub} from "./game/Game";
import {RummikubBoard} from "./game/Board";
import {Local} from "boardgame.io/multiplayer";
import JoinGamePage from "./game/JoinGamePage";

function getTestPlayerClient() {
    let PlayerClient = Client({
        numPlayers: 2,
        game: Rummikub,
        board: RummikubBoard,
    })
    return <PlayerClient playerID='0'/>
}

const App = function () {
    return (
        <Switch>
            <Route path="/match/:matchID">
                <GameMatch/>
            </Route>
            <Route path="/join-match/:matchID">
                <JoinGamePage/>
            </Route>
            <Route path="/test">
                {getTestPlayerClient()}
            </Route>
            <Route path="/">
                <GameLobby/>
            </Route>
        </Switch>
    )
};

export default App