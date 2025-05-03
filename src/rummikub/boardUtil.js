import {isSequenceValid, tryOrderTiles} from "./util";
import {HAND_GRID_ID} from "./constants.js";

function getNextTile(G, playerID, tileId) {
    const currentPos = G.tilePositions[tileId];
    if (!currentPos) return null;

    const gridId = currentPos.gridId;
    const sameGridTiles = Object.entries(G.tilePositions)
        .filter(([_, pos]) => {
            if (pos.gridId !== gridId) return false;
            if (gridId === HAND_GRID_ID && pos.playerID !== playerID) return false;
            return true;
        });

    const nextTileEntry = sameGridTiles.find(([_, pos]) =>
        pos.row === currentPos.row && pos.col === currentPos.col + 1
    );

    if (nextTileEntry) {
        const [nextTileId] = nextTileEntry;
        return nextTileId;
    }

    return null;
}



function getTilesInSameRow(G, tilePos) {
    return Object.entries(G.tilePositions)
        .filter(([id, pos]) =>
            pos.gridId === tilePos.gridId &&
            pos.row === tilePos.row &&
            (tilePos.playerID === undefined || pos.playerID === tilePos.playerID)
        )
        .sort((a, b) => a[1].col - b[1].col); // Sort by column
}

function getTilesInSameCol(G, tilePos) {
    return Object.entries(G.tilePositions)
        .filter(([id, pos]) =>
            pos.gridId === tilePos.gridId &&
            pos.col === tilePos.col &&
            (tilePos.playerID === undefined || pos.playerID === tilePos.playerID)
        )
        .sort((a, b) => a[1].row - b[1].row); // Sort by row
}


function handleTileSelection(G, state, setState, playerID, tileId, shiftKey, ctrlKey) {
    const tilePos = G.tilePositions[tileId];
    console.debug('HANDLING CLICK ON TILE:', tileId, tilePos);

    if (ctrlKey) {
        setState((prevState) => {
            const isSelected = prevState.selectedTiles.includes(tileId);
            const newSelected = isSelected
                ? prevState.selectedTiles.filter(id => id !== tileId)
                : tryOrderTiles([...prevState.selectedTiles, tileId]);
            return {
                selectedTiles: newSelected,
                lastSelectedTileId: prevState.lastSelectedTileId,
            };
        });
        return;
    }

    if (!shiftKey || !state.lastSelectedTileId) {
        setState({selectedTiles: [tileId], lastSelectedTileId: tileId});
        return;
    }

    const lastSelectedId = state.lastSelectedTileId;
    const lastPos = G.tilePositions[lastSelectedId];

    if (!lastPos || lastPos.gridId !== tilePos.gridId || (tilePos.playerID !== undefined && lastPos.playerID !== tilePos.playerID)) {
        console.debug('SELECTION CANCELED: GRID ID MISMATCH');
        return;
    }

    let selectedTiles = [];

    if (lastPos.row === tilePos.row) {
        const tilesInRow = getTilesInSameRow(G, tilePos);
        const minCol = Math.min(lastPos.col, tilePos.col);
        const maxCol = Math.max(lastPos.col, tilePos.col);

        selectedTiles = tilesInRow
            .filter(([_, pos]) => pos.col >= minCol && pos.col <= maxCol)
            .map(([id, _]) => id);

    } else if (lastPos.col === tilePos.col) {
        const tilesInCol = getTilesInSameCol(G, tilePos);
        const minRow = Math.min(lastPos.row, tilePos.row);
        const maxRow = Math.max(lastPos.row, tilePos.row);

        selectedTiles = tilesInCol
            .filter(([_, pos]) => pos.row >= minRow && pos.row <= maxRow)
            .map(([id, _]) => id);
    } else {
        console.debug('SELECTION CANCELED: NOT SAME ROW OR COLUMN');
        return;
    }

    setState({selectedTiles: tryOrderTiles(selectedTiles), lastSelectedTileId: null});
}


function handleLongPress(G, playerID, setState, longPressTimeoutId, tileId, timeout = 200) {
    console.debug('LONG PRESS STARTED');
    let selectedTiles = [tileId];

    function continueSelection(currentTileId) {
        const nextTileId = getNextTile(G, playerID, currentTileId);

        if (!nextTileId) {
            console.debug('No next tile found, ending long press.');
            setState({ selectedTiles });
            return;
        }

        selectedTiles.push(nextTileId);

        // Validate after adding the new tile
        if (selectedTiles.length >= 3) {
            if (!isSequenceValid(selectedTiles)) {
                console.debug('Invalid sequence, stopping selection.');
                selectedTiles.pop(); // Remove invalid tile
                setState({ selectedTiles });
                return;
            }
        }

        setState({ selectedTiles });

        longPressTimeoutId.current = setTimeout(() => continueSelection(nextTileId), timeout);
    }

    // First select the tile immediately
    setState({ selectedTiles });

    // Start selecting the NEXT tile after timeout
    longPressTimeoutId.current = setTimeout(() => continueSelection(tileId), timeout);
}



export {
    handleTileSelection,
    handleLongPress,
}