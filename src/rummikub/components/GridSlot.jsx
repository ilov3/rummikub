import {useDrop} from 'react-dnd'
import {Tile} from "./Tile";


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
         onLongPressMouseUp,
         hoverPosition,
         setHoverPosition,
         newlyAdded
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
                setHoverPosition({})
            },
            hover: () => {
                // This fires when a tile is dragged *over* this slot
                setHoverPosition({col, row, gridId}); // set from parent scope via prop
            },
            canDrop: () => {
                return canDnD
            },
            collect: collector,
        }), [tile, canDnD, selectedTiles])

        let isHighlighted = false;
        if (hoverPosition && hoverPosition.row === row && hoverPosition.gridId === gridId) {
            const rangeCols = Array.from({length: selectedTiles.length}, (_, i) => hoverPosition.col + i);
            isHighlighted = rangeCols.includes(col);
        }


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
                        selectedTiles={selectedTiles}
                        newlyAdded={newlyAdded}
                    />
                </div>
            )
        } else {
            return <div
                ref={drop}
                style={{backgroundColor: (canDnD && isHighlighted) || (canDnD && isOver) ? 'rgba(71,179,86,0.43)' : ''}}
                className='grid-item'/>
        }

    }


export default GridSlot