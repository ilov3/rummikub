import React, {useEffect, useState} from "react";

const RADIUS = 45;
const STROKE = 6;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue}, 70%, 50%)`;
}

const PlayerAvatarWithTimer = ({name, tiles, isActive, timeLeft, totalTime, showTurnTimer}) => {
    const [dashOffset, setDashOffset] = useState(CIRCUMFERENCE);
    const [strokeColor, setStrokeColor] = useState("#00f");


    useEffect(() => {
        const percent = Math.max(0, timeLeft / totalTime);
        const offset = CIRCUMFERENCE * (1 - percent);
        setDashOffset(offset);

        // Change color based on remaining time
        const redIntensity = Math.max(0, 255 * (1 - percent)); // from 0 to 255
        const blueIntensity = Math.max(0, 255 * percent); // from 255 to 0
        setStrokeColor(`rgb(${redIntensity}, ${0}, ${blueIntensity})`); // smooth transition from blue to red
    }, [timeLeft, totalTime]);

    return (
        <div className="player">
            <div className={`avatar ${isActive ? "active" : ""}`} style={{background: stringToColor(name)}}>
                {isActive && showTurnTimer ? <svg className="timer-ring" width="100" height="100">
                    <circle
                        className="timer-bg"
                        r={RADIUS}
                        cx="50"
                        cy="50"
                        fill="none"
                        stroke="#eee"
                        strokeWidth={STROKE}
                    />
                    <circle
                        className="timer-circle"
                        r={RADIUS}
                        cx="50"
                        cy="50"
                        fill="none"
                        stroke={strokeColor} // Dynamically change the stroke color
                        strokeWidth={STROKE}
                        strokeDasharray={CIRCUMFERENCE}
                        strokeDashoffset={dashOffset}
                        strokeLinecap="round"
                    />
                </svg> : ''}
                <span className="username">{name}</span>
                <span className="tile-count">{tiles}</span>
            </div>
        </div>
    );
};

export default PlayerAvatarWithTimer;
