import {BlackJoker, getTileById, isSequenceValid, transpose, tryOrderTiles} from "./util";
import {getGridByIdPlayer} from "./moves";
import _ from "lodash";

function getNextTile(G, playerID, tileId) {
    let tilePos = G.tilePositions[tileId]
    let grid = getGridByIdPlayer(G, tilePos.gridId, playerID)
    if (tilePos.col + 1 < grid[0].length) {
        return grid[tilePos.row][tilePos.col + 1]
    } else {
        return grid[tilePos.row + 1] && grid[tilePos.row + 1][0]
    }
}

function handleTileSelection(G, state, setState, playerID, tileId, shiftKey, ctrlKey) {
    let tilePos = G.tilePositions[tileId]
    console.debug('HANDLING CLICK ON TILE:', tileId, tilePos)
    if (ctrlKey) {
        setState((prevState) => {
            if (prevState.selectedTiles.includes(tileId)) {
                return {
                    selectedTiles: prevState.selectedTiles.filter(id => tileId !== id),
                    lastSelectedTileId: prevState.lastSelectedTileId
                }
            }
            let tiles = prevState.selectedTiles.map(tileId => getTileById(tileId))
            tiles.push(getTileById(tileId))
            let sorted = tryOrderTiles(tiles)
            return {
                selectedTiles: sorted,
                lastSelectedTileId: prevState.lastSelectedTileId
            }
        })
        return
    }
    if (!shiftKey) {
        setState({selectedTiles: [tileId], lastSelectedTileId: tileId})
    } else if (state.lastSelectedTileId) {
        let lastSelectedTileId = state.lastSelectedTileId
        let lastSelectedPos = G.tilePositions[lastSelectedTileId]
        if (lastSelectedPos.gridId !== tilePos.gridId) {
            console.debug('SELECTION CANCELED: GRID ID MISMATCH')
            return
        } else if (lastSelectedPos.row === tilePos.row || lastSelectedPos.col === tilePos.col) {
            let grid = getGridByIdPlayer(G, tilePos.gridId, playerID)
            let gridRow = grid[tilePos.row]
            if (lastSelectedPos.col === tilePos.col) {
                grid = transpose(grid)
                gridRow = grid[tilePos.col]
            }
            let findex = _.findIndex(gridRow, tile => tile && tile === tileId)
            let sindex = _.findIndex(gridRow, tile => tile && tile === lastSelectedTileId)
            console.debug(findex, sindex)
            let left = _.min([findex, sindex])
            let right = _.max([findex, sindex])
            console.debug(left, right)
            let selectedTiles = []
            for (let i = left; i <= right; i++) {
                if (gridRow[i]) {
                    selectedTiles.push(gridRow[i])
                } else {
                    break
                }
            }
            let sorted = tryOrderTiles(selectedTiles)
            setState({selectedTiles: sorted.map(tile => tile), lastSelectedTileId: null})
        }
    }
}

function handleLongPress(G, playerID, setState, longPressTimeoutId, tileId, timeout) {
    // if (!(this.state.selectedTiles.length === 0 || this.state.selectedTiles.includes(tileId))) return
    let defaultTimeout = timeout ? timeout : 200
    const selectedTileIds = (a) => a.map(tile => tile)
    let selectedTiles = []
    console.debug('LONG PRESS STARTED')
    let firstCallDone = false;
    longPressTimeoutId.current = setTimeout((function cb(tileId) {
        console.debug('Tile selected', tileId)
        // console.debug(this.props)
        let tilePos = G.tilePositions[tileId]
        let grid = getGridByIdPlayer(G, tilePos.gridId, playerID)
        let tile = grid[tilePos.row][tilePos.col]
        if (!firstCallDone) {
            firstCallDone = true
            selectedTiles.push(tile)
            setState({selectedTiles: selectedTileIds(selectedTiles)})
        } else {
            tile = getNextTile(G, playerID, tileId)
            if (tile) {
                selectedTiles.push(tile)
                // console.debug(selectedTiles)
                if (selectedTiles.length == 3) {
                    if (!isSequenceValid(selectedTiles)) {
                        selectedTiles.pop()
                        selectedTiles.push(BlackJoker)
                        if (isSequenceValid(selectedTiles)) {
                            selectedTiles.pop()
                            setState({selectedTiles: selectedTileIds(selectedTiles)})
                        } else {
                            setState({selectedTiles: []})
                        }
                        return
                    } else {
                        setState({selectedTiles: selectedTileIds(selectedTiles)})
                    }
                } else if (selectedTiles.length < 3) {
                    setState({selectedTiles: selectedTileIds(selectedTiles)})
                } else {
                    if (!isSequenceValid(selectedTiles)) {
                        return
                    } else {
                        setState({selectedTiles: selectedTileIds(selectedTiles)})
                    }
                }
            } else {
                setState({selectedTiles: selectedTileIds(selectedTiles)})
                return
            }
        }
        longPressTimeoutId.current = setTimeout(cb.bind(this), defaultTimeout, tile)
    }), defaultTimeout, tileId)
}

function clearTurnTimeout(matchID, playerID) {
    localStorage.setItem(`${matchID}:${playerID}:expire`, '')
}

function updateTurnTimeout(matchID, playerID, value) {
    localStorage.setItem(`${matchID}:${playerID}:expire`, value)
}

function getTurnTimeout(matchID, playerID) {
    return localStorage.getItem(`${matchID}:${playerID}:expire`)
}

export {
    handleTileSelection,
    handleLongPress,
    clearTurnTimeout,
    updateTurnTimeout,
    getTurnTimeout,
}