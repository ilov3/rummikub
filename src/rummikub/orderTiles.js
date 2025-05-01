import _ from "lodash";
import {
    getTileColor,
    getTileValue,
    groupValidSequences,
    getGameState,
    deactivateTileVariant,
    getPlayerHandTiles
} from "./util";
import {HAND_COLS, HAND_GRID_ID, HAND_ROWS} from "./constants";

function isTileSlotEmpty(G, gridId, row, col, playerID = null) {
    return !Object.values(G.tilePositions).some(pos =>
        pos &&
        pos.gridId === gridId &&
        pos.row === row &&
        pos.col === col &&
        (playerID === null || pos.playerID === playerID)
    );
}

function pushTilesToGrid(tiles, grid_rows, grid_cols, G, flags, ctx, override) {
    let tilesCopy = tiles.slice()
    for (let row = 0; row < grid_rows; row++) {
        for (let col = 0; col < grid_cols; col++) {
            if (isTileSlotEmpty(G, flags.gridId, row, col, flags.playerID) || override) {
                let tile = tilesCopy.shift()
                if (tile) {
                    G.tilePositions[tile] = {
                        id: tile,
                        col: col,
                        row: row,
                        ...flags,
                    }
                }
            }
        }
    }
}

function compareTilesByColorVal(a, b) {
    const aColor = getTileColor(a);
    const aValue = getTileValue(a);
    const bColor = getTileColor(b);
    const bValue = getTileValue(b);

    if (aColor === bColor) {
        return aValue - bValue;
    }
    return aColor - bColor;
};

function compareTilesByValColor(a, b) {
    const aColor = getTileColor(a);
    const aValue = getTileValue(a);
    const bColor = getTileColor(b);
    const bValue = getTileValue(b);

    if (aValue === bValue) {
        return aColor - bColor;
    }
    return aValue - bValue;
};


function orderByFunc(tiles, sortingFunc) {
    let flattened = _.compact(_.flatten(tiles))
    const findDuplicateIndex = (arr, index) => {
        const tile = arr[index];
        for (let i = 0; i < arr.length; i++) {
            if (i !== index && deactivateTileVariant(arr[i]) === deactivateTileVariant(tile)) {
                return i;
            }
        }
        return -1;
    };

    flattened.sort(sortingFunc);

    for (let i = 0; i < flattened.length - 1; i++) {
        if (deactivateTileVariant(flattened[i]) === deactivateTileVariant(flattened[i + 1])) {
            const duplicateIndex = findDuplicateIndex(flattened, i);
            if (duplicateIndex !== -1) {
                const duplicateTile = flattened.splice(duplicateIndex, 1)[0];
                flattened.push(duplicateTile);
            }
        }
    }
    return flattened
}

function orderBy(G, ctx, sortingFunc, playerID) {
    if (playerID == ctx.currentPlayer) {
        G.gameStateStack.push(getGameState(G))
    }
    let tiles = getPlayerHandTiles(G, playerID)
    let sorted = orderByFunc(tiles, sortingFunc)

    pushTilesToGrid(groupValidSequences(sorted), HAND_ROWS, HAND_COLS, G,
        {gridId: HAND_GRID_ID, playerID: playerID}, ctx, true)
}

function orderByColorVal({G, ctx, playerID}) {
    orderBy(G, ctx, compareTilesByColorVal, playerID);
}

function orderByValColor({G, ctx, playerID}) {
    orderBy(G, ctx, compareTilesByValColor, playerID);
}

export {
    orderByValColor,
    orderByColorVal,
    pushTilesToGrid,
    orderByFunc,
    compareTilesByColorVal,
    compareTilesByValColor,
}