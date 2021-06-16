import React from "react";
import './board.css';
import GridContainer from "./GridContainer";
import {DndProvider} from 'react-dnd'
import {HTML5Backend} from 'react-dnd-html5-backend'
import {
    HAND_GRID_ID,
    BOARD_GRID_ID,
    BOARD_ROWS,
    BOARD_COLS,
    HAND_ROWS,
    HAND_COLS
} from "./constants";
import Sidebar from "./Sidebar";
import _ from 'lodash';
import {isBoardChanged, isBoardDirty} from "./moveValidation";
import {BlackJoker, getTileById, isSequenceValid, transpose, tryOrderTiles} from "./util";
import TileDragLayer from "./TileDragLayer";
import {getGridByIdPlayer} from "./moves";

class RummikubBoard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {selectedTiles: [], lastSelectedTileId: null}
        this.longPressTimeoutId = null
    }

    onBoardClick(e) {
        let classList = e.target.className && e.target.className.split(' ')
        if (!(classList && (classList.includes('tile') || classList.includes('tile-text')))) {
            this.setState({selectedTiles: [], lastSelectedTileId: null})
        }
    }

    onTileDragEnd() {
        this.setState({selectedTiles: [], lastSelectedTileId: null})
    }

    handleTileSelection(tileId, shiftKey, ctrlKey) {
        let tilePos = this.props.G.tilePositions[tileId]
        console.log('HANDLING CLICK ON TILE:', tileId, tilePos)
        if (ctrlKey) {
            this.setState((prevState) => {
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
                    selectedTiles: sorted.map(tile => tile.id),
                    lastSelectedTileId: prevState.lastSelectedTileId
                }
            })
            return
        }
        if (!shiftKey) {
            this.setState({selectedTiles: [tileId], lastSelectedTileId: tileId})
        } else if (this.state.lastSelectedTileId) {
            let lastSelectedTileId = this.state.lastSelectedTileId
            let lastSelectedPos = this.props.G.tilePositions[lastSelectedTileId]
            if (lastSelectedPos.gridId !== tilePos.gridId) {
                console.log('SELECTION CANCELED: GRID ID MISMATCH')
                return
            } else if (lastSelectedPos.row === tilePos.row || lastSelectedPos.col === tilePos.col) {
                let grid = getGridByIdPlayer(this.props.G, tilePos.gridId, this.props.playerID)
                let gridRow = grid[tilePos.row]
                if (lastSelectedPos.col === tilePos.col) {
                    grid = transpose(grid)
                    gridRow = grid[tilePos.col]
                }
                let findex = _.findIndex(gridRow, tile => tile && tile.id === tileId)
                let sindex = _.findIndex(gridRow, tile => tile && tile.id === lastSelectedTileId)
                console.log(findex, sindex)
                let left = _.min([findex, sindex])
                let right = _.max([findex, sindex])
                console.log(left, right)
                let selectedTiles = []
                for (let i = left; i <= right; i++) {
                    if (gridRow[i]) {
                        selectedTiles.push(gridRow[i])
                    } else {
                        break
                    }
                }
                let sorted = tryOrderTiles(selectedTiles)
                this.setState({selectedTiles: sorted.map(tile => tile.id), lastSelectedTileId: null})
            }
        }
    }

    getNextTile(tileId) {
        let tilePos = this.props.G.tilePositions[tileId]
        let grid = getGridByIdPlayer(this.props.G, tilePos.gridId, this.props.playerID)
        if (tilePos.col + 1 < grid[0].length) {
            return grid[tilePos.row][tilePos.col + 1]
        } else {
            return grid[tilePos.row + 1] && grid[tilePos.row + 1][0]
        }
    }

    onLongPressMouseUp() {
        console.log('LONG PRESS MOUSE UP REGISTERED')
        if (this.longPressTimeoutId) {
            clearTimeout(this.longPressTimeoutId)
        }
    }

    handleLongPress(tileId, timeout) {
        // if (!(this.state.selectedTiles.length === 0 || this.state.selectedTiles.includes(tileId))) return
        let defaultTimeout = timeout ? timeout : 200
        const selectedTileIds = (a) => a.map(tile => tile.id)
        let selectedTiles = []
        console.log('LONG PRESS STARTED')
        let firstCallDone = false;
        this.longPressTimeoutId = setTimeout((function cb(tileId) {
            console.log('Tile selected', tileId)
            // console.log(this.props)
            let tilePos = this.props.G.tilePositions[tileId]
            let grid = getGridByIdPlayer(this.props.G, tilePos.gridId, this.props.playerID)
            let tile = grid[tilePos.row][tilePos.col]
            if (!firstCallDone) {
                firstCallDone = true
                selectedTiles.push(tile)
                this.setState({selectedTiles: selectedTileIds(selectedTiles)})
            } else {
                tile = this.getNextTile(tileId)
                if (tile) {
                    selectedTiles.push(tile)
                    // console.log(selectedTiles)
                    if (selectedTiles.length == 3) {
                        if (!isSequenceValid(selectedTiles)) {
                            selectedTiles.pop()
                            selectedTiles.push(BlackJoker)
                            if (isSequenceValid(selectedTiles)) {
                                selectedTiles.pop()
                                this.setState({selectedTiles: selectedTileIds(selectedTiles)})
                            } else {
                                this.setState({selectedTiles: []})
                            }
                            return
                        } else {
                            this.setState({selectedTiles: selectedTileIds(selectedTiles)})
                        }
                    } else if (selectedTiles.length < 3) {
                        this.setState({selectedTiles: selectedTileIds(selectedTiles)})
                    } else {
                        if (!isSequenceValid(selectedTiles)) {
                            return
                        } else {
                            this.setState({selectedTiles: selectedTileIds(selectedTiles)})
                        }
                    }
                } else {
                    this.setState({selectedTiles: selectedTileIds(selectedTiles)})
                    return
                }
            }
            this.longPressTimeoutId = setTimeout(cb.bind(this), defaultTimeout, tile.id)
        }).bind(this), defaultTimeout, tileId)
    }

    onOrderByColorClicked(e) {
        this.props.moves.orderByColorVal();
    }

    drawTile(e) {
        localStorage.setItem(`${this.props.matchID}:expire`, '')
        this.props.moves.drawTile()
    }

    onOrderByValColor(e) {
        this.props.moves.orderByValColor()
    }

    endTurn(e) {
        localStorage.setItem(`${this.props.matchID}:expire`, '')
        this.props.moves.endTurn()
    }

    cancelMoves(e) {
        this.props.moves.cancelMoves()
    }

    onTimeout() {
        console.log('TURN TIME OUT!', new Date())
        localStorage.setItem(`${this.props.matchID}:expire`, '')
        this.props.moves.endTurn()
    }

    render() {
        let endBut = (
            <button className={'btn btn-primary'} onClick={() => {
                this.endTurn()
            }}>End
            </button>
        )
        let drawBut = (
            <button disabled={!(this.props.ctx.currentPlayer === this.props.playerID)} className={'btn btn-primary'}
                    onClick={() => {
                        this.drawTile()
                    }}>Draw
            </button>
        )

        let cancelBut = (
            <button disabled={!(this.props.ctx.currentPlayer === this.props.playerID && isBoardChanged(this.props.G))}
                    className={'text-white btn btn-warning'}
                    onClick={() => {
                        this.cancelMoves()
                    }}>Undo
            </button>
        )
        let drawOrEnd = isBoardDirty(this.props.G) ? endBut : drawBut

        return <DndProvider backend={HTML5Backend}>
            <div className={'container-float'}>
                <Sidebar
                    currentPlayer={this.props.ctx.currentPlayer}
                    playerID={this.props.playerID}
                    matchID={this.props.matchID}
                    matchData={this.props.matchData || []}
                    gameover={this.props.ctx.gameover}
                    onTimeout={this.onTimeout.bind(this)}
                    timePerTurn={this.props.G.timePerTurn}
                    hands={this.props.G.hands}
                    tilesOnPool={this.props.G.tiles_pool.length}
                />
                <div className="board" onClick={this.onBoardClick.bind(this)}>
                    <GridContainer rows={BOARD_ROWS}
                                   cols={BOARD_COLS}
                                   tiles2dArray={this.props.G.board}
                                   moves={this.props.moves}
                                   gridId={BOARD_GRID_ID}
                                   ctx={this.props.ctx}
                                   playerID={this.props.playerID}
                                   selectedTiles={this.state.selectedTiles}
                                   onTileDragEnd={this.onTileDragEnd.bind(this)}
                                   handleTileSelection={this.handleTileSelection.bind(this)}
                                   handleLongPress={this.handleLongPress.bind(this)}
                                   onLongPressMouseUp={this.onLongPressMouseUp.bind(this)}
                    ></GridContainer>
                    <div className={'hand-buttons'}>
                        <GridContainer rows={HAND_ROWS}
                                       cols={HAND_COLS}
                                       gridId={HAND_GRID_ID}
                                       moves={this.props.moves}
                                       ctx={this.props.ctx}
                                       playerID={this.props.playerID}
                                       tiles2dArray={this.props.G.hands[this.props.playerID]}
                                       selectedTiles={this.state.selectedTiles}
                                       onTileDragEnd={this.onTileDragEnd.bind(this)}
                                       handleTileSelection={this.handleTileSelection.bind(this)}
                                       handleLongPress={this.handleLongPress.bind(this)}
                                       onLongPressMouseUp={this.onLongPressMouseUp.bind(this)}
                        ></GridContainer>
                        <div className="buttons">
                            <button className={'btn btn-primary'} onClick={() => {
                                this.onOrderByColorClicked()
                            }}>789
                            </button>
                            <button className={'btn btn-primary'} onClick={() => {
                                this.onOrderByValColor()
                            }}>777
                            </button>
                            {drawOrEnd}
                            {cancelBut}
                        </div>
                    </div>
                </div>
                <TileDragLayer
                    G={this.props.G}
                    playerID={this.props.playerID}
                    selectedTiles={this.state.selectedTiles}
                />
            </div>
        </DndProvider>
    }
}

export {RummikubBoard}