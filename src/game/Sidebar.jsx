import React from "react";
import _ from "lodash";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronRight} from "@fortawesome/free-solid-svg-icons";
import TurnTimer from "./TurnTimer";
import {count2dArrItems} from "./util";
import {Link} from "react-router-dom";
import {Button} from "react-bootstrap";
import {FRONTEND_PORT, LOBBY_SERVER_HOST, LOBBY_SERVER_PROTO} from "./constants";

const Sidebar = function ({
                              tilesOnPool,
                              currentPlayer,
                              playerID,
                              matchID,
                              matchData,
                              gameover,
                              onTimeout,
                              timePerTurn,
                              hands
                          }) {
    let showTurnTimer = matchData.length && !gameover && _.every(matchData, (item) => item.name) && currentPlayer === playerID
    let matchLink = `${LOBBY_SERVER_PROTO}://${LOBBY_SERVER_HOST}:${FRONTEND_PORT}/join-match/${matchID}`
    return (
        <div className='sidenav'>
            <div className="ml-2">
                <Button size='sm' variant='outline-success' onClick={() => {
                    navigator.clipboard.writeText(matchLink)
                }}>Copy match link</Button>
            </div>
            <div className='mt-3 ml-2'>Match id: {matchID}</div>
            <div className='mt-3 ml-2'>Tiles in bag: {tilesOnPool}</div>
            <div className="ml-2">Players list:</div>
            {matchData.map(function (data, index) {
                let elem = null
                let isYou = index == playerID
                let isYourTurn = index == currentPlayer
                let usernameStatus = data.isConnected ? 'success' : 'danger'
                let usernameElem = (
                    <div key={data.id} className={`ml-2 text-${usernameStatus}`}>
                        {isYourTurn ?
                            <FontAwesomeIcon icon={faChevronRight}/> : ''} {data.name} {isYou ? '(You)' : ''}
                        <span className="ml-2">{count2dArrItems(hands[data.id])} tiles on hand</span>
                    </div>
                )
                if (data.name) {
                    elem = usernameElem

                } else {
                    elem = <div key={data.id} className="ml-2 text-warning">Not joined yet</div>
                }
                return elem
            })}
            <div
                className="ml-2 text-danger">
                {gameover ? `Winner: ${matchData[parseInt(gameover.winner)].name}, ${gameover.points} points` : ''}
            </div>
            {showTurnTimer ? <TurnTimer
                matchID={matchID}
                secondsLeft={timePerTurn}
                onTimeout={onTimeout}/> : ''}
        </div>
    )

}

export default Sidebar