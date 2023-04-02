import React, {useEffect, useRef} from 'react';
import {useDrop} from 'react-dnd'
import {Tile} from "./Tile";
import {HAND_GRID_ID} from "../constants";
import {arraysEqual} from "../util";
import {debounce, throttle} from "lodash";


function useTraceUpdate(props) {
    const prev = useRef(props);
    useEffect(() => {
        const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
            if (prev.current[k] !== v) {
                ps[k] = [prev.current[k], v];
            }
            return ps;
        }, {});
        if (Object.keys(changedProps).length > 0) {
            console.debug('Changed props:', changedProps);
        }
        prev.current = props;
    });
}

const GridSlot =
    ({
         tile,
         col,
         row,
         moveTiles,
         gridId,
         validTiles,
         highlightTiles,
         canDnD,
         selectedTiles,
         handleTileSelection,
         handleLongPress,
         onTileDragEnd,
         onLongPressMouseUp
     }) => {
        const isSelected = tile && selectedTiles.indexOf(tile) !== -1 ? true : false

        function collector(monitor) {
            return {isOver: monitor.isOver()}
        }

        const [{isOver}, drop] = useDrop(() => ({
            accept: 'tile',
            drop: function (tileIdObj) {
                console.debug(`DROP ACTION: ${gridId}::${col}::${row}`, selectedTiles, Date.now())
                moveTiles(col, row, gridId, tileIdObj, selectedTiles)
            },
            canDrop: () => {
                return canDnD
            },
            collect: collector,
        }), [tile, canDnD, selectedTiles])

        if (tile) {
            let isValid
            if (highlightTiles) {
                isValid = validTiles.indexOf(tile) !== -1
            }
            return (
                <div
                    ref={drop}
                    className='grid-item'
                    key={tile}>
                    <Tile
                        tile={tile}
                        canDnD={canDnD}
                        isValid={isValid}
                        isSelected={isSelected}
                        onTileDragEnd={onTileDragEnd}
                        handleTileSelection={handleTileSelection}
                        handleLongPress={handleLongPress}
                        onLongPressMouseUp={onLongPressMouseUp}
                    />
                </div>
            )
        } else {
            return <div
                ref={drop}
                style={{backgroundColor: canDnD && isOver ? 'rgba(71,179,86,0.43)' : ''}}
                className='grid-item'/>
        }

    }


export default GridSlot