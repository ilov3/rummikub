import {GameLobby} from "./rummikub/components/Lobby"
import {
    Switch,
    Route
} from "react-router-dom";
import React from "react";
import GameMatch from "./rummikub/components/Match";
import {Client} from "boardgame.io/react";
import {Rummikub} from "./rummikub/Game";
import RummikubBoard from "./rummikub/components/Board";
import {Local} from "boardgame.io/multiplayer";
import JoinGamePage from "./rummikub/components/JoinGamePage";
import GameNavbar from "./rummikub/components/Navbar";

function getTestPlayerClient() {
    let PlayerClient = Client({
        numPlayers: 2,
        game: Rummikub,
        board: RummikubBoard,
    })
    return <PlayerClient playerID='0'/>
}

const App = function () {

    function KeyCheck(e) {
        if (e.key === 'F8') {
            debugger;
        }
    }

    window.addEventListener('keydown', KeyCheck, false);
    return (
        <>
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
        </>
    )
};

export default App