import React, {useCallback, useState} from 'react';
import {useEffect} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSmileBeam} from "@fortawesome/free-solid-svg-icons";
import {getTileValue, isJoker, getTileColor} from "../util";
import {useDrag} from 'react-dnd';
import {getEmptyImage} from "react-dnd-html5-backend";
import _ from "lodash";
import useLongPress from "../useLongPress";
import {COLORS, HAND_GRID_ID} from "../constants";

function TilePreview({tile, isSelected, isDragging, isValid}) {
    if (!tile) return null
    let val = isJoker(tile) ? <FontAwesomeIcon icon={faSmileBeam}/> : getTileValue(tile)
    return (
        <div
            style={getTileStyle(isSelected, isDragging, isValid)}
            className="tile tile-clickable border-dark">
            <div className={"tile-text tile-" + COLORS[getTileColor(tile)]}>{val}</div>
            <div className={"tile-subscript"}></div>
        </div>
    )
}

function getTileStyle(selected, isDragging, isValid) {
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

    return {
        backgroundColor: backgroundColor,
        opacity: isDragging ? 0.5 : 1,
        fontSize: 25,
        fontWeight: 'bold',
        cursor: 'move',
        border: border,
        borderColor: borderColor,
    }
}

export function Tile({
                         tile,
                         canDnD,
                         isSelected,
                         isValid,
                         handleTileSelection,
                         onTileDragEnd,
                         handleLongPress,
                         onLongPressMouseUp
                     }) {
    const longPressTimeout = 250
    const [longPressTriggered, setLongPress] = useState(false)
    const [{isDragging}, drag, preview] = useDrag(function () {
        return {
            type: 'tile',
            item: {id: tile},
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
    }, [canDnD])
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