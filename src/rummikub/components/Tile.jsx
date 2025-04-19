import React, {useCallback, useState} from 'react';
import {useRef, useEffect} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSmileBeam} from "@fortawesome/free-solid-svg-icons";
import {getTileValue, isJoker, getTileColor} from "../util";
import {useDrag} from 'react-dnd';
import {getEmptyImage} from "react-dnd-html5-backend";
import _ from "lodash";
import useLongPress from "../hooks/useLongPress";
import {COLORS, HAND_GRID_ID, TILE_WIDTH} from "../constants";


function useDebouncedCallback(callback, delay) {
    const callbackRef = useRef(callback);
    const timeoutRef = useRef();

    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    return useCallback((...args) => {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            callbackRef.current(...args);
        }, delay);
    }, [delay]);
}

function getAbsolutePosition(relativePosition) {
    return {
        x: relativePosition.x * window.innerWidth,
        y: relativePosition.y * window.innerHeight,
    };
}

function TilePreview({tile, isSelected, isDragging, isValid, position, boardGriBoundingBox, index}) {
    if (!tile) return null
    if (position && boardGriBoundingBox) {
        let absPos = getAbsolutePosition(position);
        const left = boardGriBoundingBox.left;
        const top = boardGriBoundingBox.top;
        const right = boardGriBoundingBox.right;
        const bottom = boardGriBoundingBox.bottom;

        const isXWithinBounds = absPos.x >= left && absPos.x <= right;
        const isYWithinBounds = absPos.y >= top && absPos.y <= bottom;

        if (!(isXWithinBounds && isYWithinBounds)) return null
    }
    let val = isJoker(tile) ? <FontAwesomeIcon icon={faSmileBeam}/> : getTileValue(tile)
    return (
        <div
            style={getTileStyle(isSelected, isDragging, isValid, position, index)}
            className="tile tile-clickable border-dark">
            <div className={"tile-text tile-" + COLORS[getTileColor(tile)]}>{val}</div>
            <div className={"tile-subscript"}></div>
        </div>
    )
}

function getTileWidth() {
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    return (TILE_WIDTH * viewportWidth) / 100;
}

function getTileStyle(selected, isDragging, isValid, position, index) {
    let backgroundColor = ''
    let border = ''
    let borderColor = ''
    if (isValid === true) {
        backgroundColor = 'rgba(159,255,113,0.68)'
    } else if (isValid === false) {
        backgroundColor = 'rgba(255,174,174,0.88)'
    }

    if (selected) {
        backgroundColor = '#c0c0c0'
        border = '2px solid'
        borderColor = '#6416ff'
    }

    let result = {
        backgroundColor: backgroundColor,
        opacity: isDragging ? 0.5 : 1,
        fontSize: 25,
        fontWeight: 'bold',
        cursor: 'move',
        border: border,
        borderColor: borderColor,
    }
    if (position) {
        let absPos = getAbsolutePosition(position)
        result.position = 'absolute'
        result.left = absPos.x + index * getTileWidth()
        result.top = absPos.y
    }

    return result
}

export function Tile({
                         tile,
                         canDnD,
                         isSelected,
                         isValid,
                         handleTileSelection,
                         onTileDragEnd,
                         handleLongPress,
                         onLongPressMouseUp,
                         moves,
                         playerID,
                         selectedTiles
                     }) {
    const longPressTimeout = 250
    const [longPressTriggered, setLongPress] = useState(false)
    const [{isDragging}, drag, preview] = useDrag(function () {
        return {
            type: 'tile',
            item: function (monitor) {
                return {id: tile}
            },
            end: function (draggedItem, monitor) {
                let didDrop = monitor.didDrop()
                if (didDrop) {
                    onTileDragEnd()
                }
            },
            canDrag: () => {
                return canDnD
            },
            collect: monitor => ({
                isDragging: monitor.isDragging(),
            }),
        }
    }, [canDnD, selectedTiles])
    useEffect(() => {
        preview(getEmptyImage(), {captureDraggingState: true});
    }, [preview]);

    const onLongPress = (e) => {
        if (e.altKey || e.optionKey) {
            handleLongPress(tile, longPressTimeout)
        }
    };

    const onClick = useCallback((e) => {
        if (longPressTriggered) {
            console.log('CLEARING AFTER LONGPRESS')
            setLongPress(false)
            return
        }
        if (!(e.altKey || e.optionKey)) {
            handleTileSelection(tile, e.shiftKey, e.ctrlKey || e.metaKey)
        }
    }, [longPressTriggered, handleTileSelection])

    function onMouseUp() {
        onLongPressMouseUp()
    }

    const defaultOptions = {
        shouldPreventDefault: false,
        delay: longPressTimeout,
    };
    const longPressEvent = useLongPress(onLongPress, onMouseUp, longPressTriggered, setLongPress, defaultOptions);

    return <div
        onClick={onClick}
        {...longPressEvent}
        ref={drag}
        id={tile}>
        <TilePreview
            tile={tile}
            isSelected={isSelected}
            isDragging={isDragging}
            isValid={isValid}
        />
    </div>
}


export default Tile
export {TilePreview}