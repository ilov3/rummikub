import {useState, useEffect, useRef} from "react";
import {getSecTs} from "../util";

export function useTurnTimer({timerExpireAt, timePerTurn, onTimeout, isActivePlayer}) {
    const [timeLeft, setTimeLeft] = useState(() =>
        timerExpireAt ? timerExpireAt - getSecTs() : timePerTurn
    );
    const intervalRef = useRef(null);
    const timeoutCalled = useRef(false);

    useEffect(() => {
            if (!timerExpireAt) return;
            const tick = () => {
                const remaining = timerExpireAt - getSecTs();
                const clamped = Math.max(0, Math.round(remaining));
                console.log(clamped)
                setTimeLeft(clamped);

                if (isActivePlayer && clamped <= 0 && !timeoutCalled.current) {
                    timeoutCalled.current = true;
                    onTimeout();
                    clearInterval(intervalRef.current);
                }
            };

            tick(); // run immediately
            intervalRef.current = setInterval(tick, 400);

            return () => {
                clearInterval(intervalRef.current);
                timeoutCalled.current = false;
            };
        }, [timerExpireAt, timePerTurn, onTimeout, isActivePlayer]
    );

    return timeLeft;
}
