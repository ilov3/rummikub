import {useCallback, useRef, useState} from "react";

const useLongPress = (
    onLongPress,
    onLongPressUp,
    longPressTriggered,
    setLongPressTriggered,
    {shouldPreventDefault = true, delay = 300} = {}
) => {
    const timeout = useRef();
    const target = useRef();

    const start = useCallback(
        event => {
            if (shouldPreventDefault && event.target) {
                event.target.addEventListener("touchend", preventDefault, {
                    passive: false
                });
                target.current = event.target;
            }
            timeout.current = setTimeout(() => {
                onLongPress(event);
                setLongPressTriggered(true);
            }, delay);
        },
        [onLongPress, delay, shouldPreventDefault]
    );

    const clear = useCallback(
        (event, shouldTriggerClick = true) => {
            timeout.current && clearTimeout(timeout.current);
            // setLongPressTriggered(false);
            if (shouldPreventDefault && target.current) {
                target.current.removeEventListener("touchend", preventDefault);
            }
        },
        [shouldPreventDefault, longPressTriggered]
    );

    function onMouseUp(e) {
        clear(e)
        onLongPressUp(e)
    }

    return {
        onMouseDown: e => start(e),
        onTouchStart: e => start(e),
        onMouseUp: onMouseUp,
        onMouseLeave: e => clear(e, false),
        onTouchEnd: onMouseUp
    };
};

const isTouchEvent = event => {
    return "touches" in event;
};

const preventDefault = event => {
    if (!isTouchEvent(event)) return;

    if (event.touches.length < 2 && event.preventDefault) {
        event.preventDefault();
    }
};

export default useLongPress;