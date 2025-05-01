import React from "react";
import _ from "lodash";
import {count2dArrItems} from "../util";
import {useTurnTimer} from "../hooks/useTurnTimer";
import PlayerAvatarWithTimer from "./PlayerAvatar";

const Sidebar = function ({
                              tilesOnPool,
                              currentPlayer,
                              playerID,
                              matchData,
                              gameover,
                              timePerTurn,
                              timerExpireAt,
                              onTimeout,
                              hands
                          }) {
    let showTurnTimer = matchData.length && !gameover && _.every(matchData, (item) => item.name)
    const timeLeft = useTurnTimer({
        timerExpireAt: timerExpireAt,
        timePerTurn: timePerTurn,
        onTimeout: onTimeout,
        isActivePlayer: playerID === currentPlayer,
    });
    return (
        <div className='sidenav'>
            <div className="ml-3 player-list">
                {matchData.map(function (data, index) {
                    let elem = null
                    let tiles = count2dArrItems(hands[data.id])
                    let usernameElem = (
                        <PlayerAvatarWithTimer key={data.id}
                                               isActive={index == currentPlayer}
                                               name={data.name}
                                               tiles={tiles}
                                               timeLeft={timeLeft}
                                               totalTime={timePerTurn}
                                               showTurnTimer={showTurnTimer}
                        ></PlayerAvatarWithTimer>
                    )
                    if (data.name) {
                        elem = usernameElem
                    } else {
                        elem =
                            <div key={data.id} className="ml-2 text-warning">Player {data.id + 1} not joined yet </div>
                    }
                    return elem
                })}</div>
            <div className="tile-pool-counter ml-3" style={{marginTop: '1rem', fontWeight: 'bold'}}>
                Tiles left: {tilesOnPool}
            </div>
        </div>)


}

export default Sidebar