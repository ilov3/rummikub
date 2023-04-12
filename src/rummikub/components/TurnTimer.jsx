import {useState, useEffect, useRef} from "react";
import {getSecTs} from "../util";
import _ from "lodash";

const TurnTimer = function ({timePerTurn, timerExpireAt, onTimeout}) {
    const [timer, setTimer] = useState(
        timerExpireAt ? timerExpireAt - getSecTs() : timePerTurn
    );
    const requestRef = useRef();

    useEffect(() => {
        const updateTimer = () => {
            const remainingTime = timerExpireAt ? timerExpireAt - getSecTs() : timePerTurn;
            setTimer(Math.min(remainingTime, timePerTurn));

            if (remainingTime <= 0) {
                onTimeout();
            } else {
                requestRef.current = requestAnimationFrame(updateTimer);
            }
        };

        requestRef.current = requestAnimationFrame(updateTimer);

        return () => {
            cancelAnimationFrame(requestRef.current);
        };
    }, [timePerTurn, timerExpireAt, onTimeout]);

    return (
        <div className="mt-4 ml-4">
      <span style={{fontSize: 66}} className={timer < 10 ? "text-danger" : ""}>
        {timer}
      </span>
        </div>
    );
};

export default TurnTimer;
