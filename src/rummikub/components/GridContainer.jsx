import GridSlot from "./GridSlot";
import {useState} from "react";

const Centered = function ({cols, colWidth, children}) {
    return <div
        style={{
            "width": `${cols * colWidth}vw`,
            "margin": `0 auto`,
        }}
    >{children}</div>
}

const Grid = function ({cols, colWidth, rows, children}) {
    return <div
        className='grid-container'
        style={{
            "gridTemplateColumns": `repeat(${cols}, ${colWidth}vw)`,
            "gridTemplateRows": `repeat(${rows}, 7vh)`,
        }}>{children}</div>
}

const GridContainer = function ({
                                    tiles2dArray,
                                    rows,
                                    cols,
                                    canDnD,
                                    gridId,
                                    validTiles,
                                    highlightTiles,
                                    selectedTiles,
                                    moveTiles,
                                    onTileDragEnd,
                                    onLongPressMouseUp,
                                    handleLongPress,
                                    handleTileSelection,
                                    moves,
                                    playerID,
                                    hoverPosition,
                                    setHoverPosition
                                }) {

    let colWidth = 2.2
    let gridItems = []
    let key = 0
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            let tile = tiles2dArray[y] && tiles2dArray[y][x]
            let gridTile = <GridSlot
                canDnD={canDnD}
                moveTiles={moveTiles}
                onTileDragEnd={onTileDragEnd}
                selectedTiles={selectedTiles}
                handleTileSelection={handleTileSelection}
                handleLongPress={handleLongPress}
                onLongPressMouseUp={onLongPressMouseUp}
                gridId={gridId}
                validTiles={validTiles}
                highlightTiles={highlightTiles}
                row={y}
                col={x}
                key={key}
                tile={tile}
                hoverPosition={hoverPosition}
                setHoverPosition={setHoverPosition}
            />
            gridItems.push(gridTile)
            key++
        }
    }
    return (
        <Centered cols={cols} colWidth={colWidth}>
            <Grid colWidth={colWidth} cols={cols} rows={rows}>{gridItems}</Grid>
        </Centered>
    )
}


export default GridContainer