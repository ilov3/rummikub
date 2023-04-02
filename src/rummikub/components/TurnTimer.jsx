import {useState, useEffect} from "react";
import {updateTurnTimeout, getTurnTimeout, clearTurnTimeout} from "../boardUtil";


const TurnTimer = function ({timer, checkTimerExpired}) {
    useEffect(() => {
        const timerId = setInterval(function () {
            checkTimerExpired(timerId)
        }, 1000)

        return () => {
            timerId && clearInterval(timerId)
        }
    }, [checkTimerExpired])

    return <div className="mt-4 ml-4">
        <span style={{fontSize: 66}} className={timer < 10 ? 'text-danger' : ''}>{timer}</span>
    </div>
}

export default TurnTimer