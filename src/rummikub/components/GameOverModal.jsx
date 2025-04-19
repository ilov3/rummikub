import React from "react";
import "./GameOverModal.css";
import {FRONTEND_PORT, LOBBY_SERVER_HOST, LOBBY_SERVER_PROTO} from "../constants";
import {copyToClipboard} from "../util";
import GameLobbyClient from "../lobbyClient";
import {useLocation, useNavigate} from "react-router-dom";

const GameOverModal = ({winner, points, matchId, playerID, matchData}) => {
    const client = new GameLobbyClient()
    const navigate = useNavigate()
    const location = useLocation()


    function onPlayAgain(event) {
        event.preventDefault();
        const token = sessionStorage.getItem("authToken");
        client.playAgain(matchId, {playerID: playerID, credentials: token}).then(
            (result) => {
                let hostAddr = `${LOBBY_SERVER_HOST}:${FRONTEND_PORT}`
                let matchLink = `${LOBBY_SERVER_PROTO}://${hostAddr}/join-match/${result.nextMatchID}`
                let username = matchData[parseInt(playerID)].name;
                copyToClipboard(matchLink)
                console.debug(result.nextMatchID)

                client.joinGame(result.nextMatchID, username, playerID).then((playerCreds) => {
                    navigate(`/match/${result.nextMatchID}`, {
                        state: {
                            username: username,
                            // numPlayers: numPlayers,
                            creds: playerCreds,
                            playerID: playerID,
                        }
                    })
                })
            }
        )
    }

    return (
        <div className="gameover-backdrop">
            <div className="gameover-modal">
                <h2 className="gameover-title">🎉 Congratulations {winner}! 🎉</h2>
                <p className="gameover-points">Total Points: <strong>{points}</strong></p>
                <button className="gameover-button" onClick={onPlayAgain}>
                    🔁 Play Again
                </button>
            </div>
        </div>
    );
};

export default GameOverModal;
