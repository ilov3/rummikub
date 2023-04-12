import React from "react";
import {useDragLayer, useDragDropManager} from "react-dnd";
import {HAND_GRID_ID} from "../constants";
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

    function renderItem() {
        if (selectedTiles.includes(item.id)) {
            return selectedTiles.map(function (tileId) {
                return <TilePreview key={tileId} tile={tileId} isDragging={isDragging}/>
            })
        }
        return <TilePreview tile={item.id} isDragging={isDragging}/>;
    }

    if (!isDragging) {
        return null
    }
    return (
        <div
            className="tile-drag-layer">
            <div style={getDragLayerStyles(initialOffset, currentOffset)}>
                {renderItem()}
            </div>
        </div>
    )
};

export default TileDragLayer