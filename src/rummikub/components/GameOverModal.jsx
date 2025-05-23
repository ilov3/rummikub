import React from "react";
import "./GameOverModal.css";
import {FRONTEND_PORT, LOBBY_SERVER_HOST, LOBBY_SERVER_PROTO} from "../constants";
import {copyToClipboard} from "../util";
import GameLobbyClient from "../lobbyClient";
import {useNavigate} from "react-router-dom";
import _ from "lodash";

const GameOverModal = ({gameover, matchId, playerID, matchData}) => {
    const client = new GameLobbyClient()
    const navigate = useNavigate()


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
                client.listSeats(result.nextMatchID).then(matchData => {
                    let seat = 0
                    console.debug(matchData)
                    for (let playerSeat of _.shuffle(matchData.players)) {
                        if (!playerSeat.name) {
                            seat = playerSeat.id
                            break
                        }
                    }
                    client.joinGame(result.nextMatchID, username, seat).then((playerCreds) => {
                        navigate(`/match/${result.nextMatchID}`, {
                            state: {
                                username: username,
                                creds: playerCreds,
                                playerID: seat,
                            },
                        })
                    })
                }, error => {
                    console.debug(error)
                })
            }
        )
    }

    return (
        <div className="gameover-backdrop">
            <div className="gameover-modal">
                <h2 className="gameover-title">🎉 Congratulations {matchData[parseInt(gameover.winner)].name}! 🎉</h2>
                <p className="gameover-points">Total
                    Points: <strong>{gameover.points[parseInt(gameover.winner)]}</strong></p>
                <ul className="gameover-score-list">
                    {Object.entries(gameover.points)
                        .sort((a, b) => b[0] - a[0])
                        .map((data) => (
                            <li key={data[0]} className="gameover-score-item">
                                {matchData[parseInt(data[0])].name} <strong>{data[1]} pts</strong>
                            </li>
                        ))}
                </ul>

                <button className="gameover-button" onClick={onPlayAgain}>
                    🔁 Play Again
                </button>
            </div>
        </div>

    );
};

export default GameOverModal;
