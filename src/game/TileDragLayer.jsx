import React from "react";
import {useDragLayer} from "react-dnd";
import {HAND_GRID_ID} from "./constants";
import {TilePreview} from "./Tile";


function getDragLayerStyles(
    initialOffset,
    currentOffset,
) {
    if (!initialOffset || !currentOffset) {
        return {
            display: "none"
        };
    }
    let {x, y} = currentOffset;

    const transform = `translate(${x}px, ${y}px)`;
    return {
        transform,
        WebkitTransform: transform
    };
}


const TileDragLayer = function ({G, playerID, selectedTiles}) {
    const {itemType, isDragging, item, initialOffset, currentOffset} = useDragLayer((monitor) => ({
        item: monitor.getItem(),
        itemType: monitor.getItemType(),
        initialOffset: monitor.getInitialSourceClientOffset(),
        currentOffset: monitor.getSourceClientOffset(),
        isDragging: monitor.isDragging(),
    }));

    let counter = 0

    function renderItem() {
        if (counter++ % 3 == 0) {
            if (selectedTiles.includes(item.id)) {
                return selectedTiles.map(function (tileId) {
                    let tilePos = G.tilePositions[tileId]
                    let tile = null
                    if (tilePos.gridId === HAND_GRID_ID) {
                        tile = G.hands[playerID][tilePos.row][tilePos.col]
                    } else {
                        tile = G.board[tilePos.row][tilePos.col]
                    }
                    return <TilePreview key={tileId} tile={tile}/>
                })
            }
            let tilePos = G.tilePositions[item.id]
            let tile = null
            if (tilePos.gridId === HAND_GRID_ID) {
                tile = G.hands[playerID][tilePos.row][tilePos.col]
            } else {
                tile = G.board[tilePos.row][tilePos.col]
            }
            return <TilePreview tile={tile}/>;
        }
    }

    if (!isDragging) {
        return null
    }
    return (
        <div className="tile-drag-layer">
            <div style={getDragLayerStyles(initialOffset, currentOffset)}>
                {renderItem()}
            </div>
        </div>
    )
};

export default TileDragLayer