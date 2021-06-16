import React from 'react';
import {useDrop} from 'react-dnd'
import {Tile} from "./Tile";
import {HAND_GRID_ID} from "./constants";

export function GridTile({
                             ctx,
                             playerID,
                             tile,
                             col,
                             row,
                             moves,
                             gridId,
                             selectedTiles,
                             handleTileSelection,
                             handleLongPress,
                             onTileDragEnd,
                             onLongPressMouseUp
                         }) {
    function canDrop() {
        console.log(gridId, ctx.currentPlayer, playerID)
        return gridId === HAND_GRID_ID || ctx.currentPlayer === playerID
    }
    const [{isOver}, drop] = useDrop(() => ({
        accept: 'tile',
        drop: function (e) {
            console.log(`DROP ACTION: ${gridId}::${col}::${row}`, Date.now())
            moves.moveTile(col, row, gridId, e, selectedTiles)
        },
        canDrop: canDrop,
        collect: monitor => ({
            isOver: !!monitor.isOver(),
        }),
    }), [tile])
    let res = <div
        ref={drop}
        style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            backgroundColor: isOver && canDrop() ? '#29a339' : '',
        }}
        className={'grid-item'}></div>
    if (tile) {
        res = (
            <div
                ref={drop}
                style={{
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                }}
                className={'grid-item'}>
                <Tile
                    ctx={ctx}
                    playerID={playerID}
                    gridId={gridId}
                    onTileDragEnd={onTileDragEnd}
                    key={tile.id}
                    tile={tile}
                    selectedTiles={selectedTiles}
                    handleTileSelection={handleTileSelection}
                    handleLongPress={handleLongPress}
                    onLongPressMouseUp={onLongPressMouseUp}
                ></Tile>
            </div>
        )
    }

    return res
}


export default GridTile