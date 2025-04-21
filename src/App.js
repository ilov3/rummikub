import {GameLobby} from "./rummikub/components/Lobby"
import {
    Routes,
    Route
} from "react-router-dom";
import React from "react";
import GameMatch from "./rummikub/components/Match";
import {Client} from "boardgame.io/react";
import {Rummikub} from "./rummikub/Game";
import RummikubBoard from "./rummikub/components/Board";
import JoinGamePage from "./rummikub/components/JoinGamePage";

function getTestPlayerClient() {
    let PlayerClient = Client({
        numPlayers: 1,
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
            <div className={"navbar justify-content-center"}>
                <a href="/"><span>Rummikub</span></a>
            </div>
            <Routes>
                <Route path="/match/:matchID" element={<GameMatch/>}/>
                <Route path="/join-match/:matchID" element={<JoinGamePage/>}/>
                <Route path="/test" element={getTestPlayerClient()}/>
                <Route path="/" element={<GameLobby/>}/>
            </Routes>
        </>
    )
};

export default App