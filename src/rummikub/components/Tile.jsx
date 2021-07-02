import React, {useState} from 'react';
import {useEffect} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSmileBeam} from "@fortawesome/free-solid-svg-icons";
import {isJoker} from "../util";
import {useDrag} from 'react-dnd';
import {getEmptyImage} from "react-dnd-html5-backend";
import _ from "lodash";
import useLongPress from "../useLongPress";
import {HAND_GRID_ID} from "../constants";

function TilePreview({tile, isSelected, isDragging}) {
    if (!tile) return null
    let val = isJoker(tile) ? <FontAwesomeIcon icon={faSmileBeam}/> : tile.value
    return (
        <div
            style={getTileStyle(isSelected, isDragging)}
            className="tile tile-clickable border-dark">
            <div className={"tile-text tile-" + tile.color}>{val}</div>
            <div className={"tile-subscript"}></div>
        </div>
    )
}

function getTileStyle(selected, isDragging) {
    return {
        backgroundColor: selected ? '#c0c0c0' : '',
        opacity: isDragging ? 0.5 : 1,
        fontSize: 25,
        fontWeight: 'bold',
        cursor: 'move',
    }
}

export function Tile({
                         tile,
                         canDnD,
                         isSelected,
                         handleTileSelection,
                         onTileDragEnd,
                         handleLongPress,
                         onLongPressMouseUp
                     }) {
    const longPressTimeout = 200
    const [{isDragging}, drag, preview] = useDrag(function () {
        return {
            type: 'tile',
            item: {id: tile.id},
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
        if (e.altKey) {
            handleLongPress(tile.id, longPressTimeout)
        }
    };

    const onClick = (e) => {
        if (!e.altKey) {
            handleTileSelection(tile.id, e.shiftKey, e.ctrlKey)
        }
    }

    function onMouseUp() {
        onLongPressMouseUp()
    }

    const defaultOptions = {
        shouldPreventDefault: false,
        delay: longPressTimeout,
    };
    const longPressEvent = useLongPress(onLongPress, onMouseUp, isDragging, defaultOptions);

    return <div
        onClick={onClick}
        {...longPressEvent}
        ref={drag}
        id={tile.id}>
        <TilePreview
            tile={tile}
            isSelected={isSelected}
            isDragging={isDragging}/>
    </div>
}


export default Tile
export {TilePreview}