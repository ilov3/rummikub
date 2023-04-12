import _ from "lodash";
import {isCalledByActivePlayer} from "./moveValidation";
import {getTileColor, getTileValue, groupValidSequences, getGameState, deactivateTileVariant} from "./util";
import {HAND_GRID_ID} from "./constants";

function pushTilesToGrid(tiles, grid, G, flags, ctx, override) {
    let rowsCnt = grid.length
    let colsCnt = grid[0].length

    for (let row = 0; row < rowsCnt; row++) {
        for (let col = 0; col < colsCnt; col++) {
            if (!grid[row][col] || override) {
                let tile = tiles.shift()
                if (tile) {
                    grid[row][col] = tile
                    G.tilePositions[tile] = {
                        id: tile,
                        col: col,
                        row: row,
                        ...flags,
                    }
                } else {
                    grid[row][col] = null
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

function orderBy(G, ctx, sortingFunc) {
    if (isCalledByActivePlayer(ctx)) {
        G.gameStateStack.push(getGameState(G))
    }
    let tiles = G.hands[ctx.playerID]
    let sorted = orderByFunc(tiles, sortingFunc)

    pushTilesToGrid(groupValidSequences(sorted), G.hands[ctx.playerID], G,
        {gridId: HAND_GRID_ID, playerID: ctx.playerID}, ctx, true)
}

function orderByColorVal(G, ctx) {
    orderBy(G, ctx, compareTilesByColorVal);
}

function orderByValColor(G, ctx) {
    orderBy(G, ctx, compareTilesByValColor);
}

export {
    orderByValColor,
    orderByColorVal,
    pushTilesToGrid,
    orderByFunc,
    compareTilesByColorVal,
    compareTilesByValColor,
}