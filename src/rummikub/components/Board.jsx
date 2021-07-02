import React, {useState, useCallback, useRef, useEffect} from "react";
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
} from "../constants";
import Sidebar from "./Sidebar";
import _ from 'lodash';
import {isBoardChanged, isBoardDirty, isBoardValid} from "../moveValidation";
import {BlackJoker, getTileById, isSequenceValid, transpose, tryOrderTiles} from "../util";
import TileDragLayer from "./TileDragLayer";
import {getGridByIdPlayer} from "../moves";
import {handleTileSelection, handleLongPress, clearTurnTimeout} from "../boardUtil";


const RummikubBoard = function ({G, ctx, moves, playerID, matchData, matchID}) {
    const [state, setState] = useState({selectedTiles: [], lastSelectedTileId: null})
    let longPressTimeoutId = useRef(null)

    const moveTilesUseCb = useCallback((col, row, destGridId, tileIdObj, selectedTiles) => {
        moves.moveTiles(col, row, destGridId, tileIdObj, selectedTiles)
    }, [])
    const handleTileSelectionCb = handleTileSelection.bind(null, G, state, setState, playerID)
    const handleLongPressCb = handleLongPress.bind(null, G, playerID, setState, longPressTimeoutId)

    function onBoardClick(e) {
        let classList = e.target.className && e.target.className.split(' ')
        if (!(classList && (classList.includes('tile') || classList.includes('tile-text')))) {
            setState({selectedTiles: [], lastSelectedTileId: null})
        }
    }

    const onTileDragEnd = useCallback(() => {
        setState({selectedTiles: [], lastSelectedTileId: null})
    }, [])

    const onLongPressMouseUp = useCallback(() => {
        console.debug('LONG PRESS MOUSE UP REGISTERED')
        if (longPressTimeoutId.current) {
            clearTimeout(longPressTimeoutId.current)
        }
    }, [longPressTimeoutId])

    function onOrderByColorClicked(e) {
        moves.orderByColorVal();
    }

    function drawTile(e) {
        clearTurnTimeout(matchID, playerID)
        moves.drawTile()
    }

    function onOrderByValColor(e) {
        moves.orderByValColor()
    }

    function endTurn(e) {
        clearTurnTimeout(matchID, playerID)
        moves.endTurn()
    }

    function cancelMoves(e) {
        moves.cancelMoves()
    }

    function onTimeout() {
        console.debug('TURN TIME OUT!', new Date())
        clearTurnTimeout(matchID, playerID)
        moves.endTurn()
    }


    const endBut = (
        <button className={'btn btn-primary'} onClick={() => {
            endTurn()
        }}>End
        </button>
    )

    const drawBut = (
        <button disabled={!(ctx.currentPlayer === playerID)} className={'btn btn-primary'}
                onClick={() => {
                    drawTile()
                }}>Draw
        </button>
    )

    const cancelBut = (
        <button disabled={!(ctx.currentPlayer === playerID && isBoardChanged(G))}
                className={'text-white btn btn-warning'}
                onClick={() => {
                    cancelMoves()
                }}>Undo
        </button>
    )

    const boardGrid = (
        <GridContainer rows={BOARD_ROWS}
                       cols={BOARD_COLS}
                       tiles2dArray={G.board}
                       gridId={BOARD_GRID_ID}
                       canDnD={ctx.currentPlayer === playerID}
                       moveTiles={moveTilesUseCb}
                       selectedTiles={state.selectedTiles}
                       onTileDragEnd={onTileDragEnd}
                       handleTileSelection={handleTileSelectionCb}
                       handleLongPress={handleLongPressCb}
                       onLongPressMouseUp={onLongPressMouseUp}
        />
    )

    const handGrid = (
        <GridContainer rows={HAND_ROWS}
                       cols={HAND_COLS}
                       tiles2dArray={G.hands[playerID]}
                       gridId={HAND_GRID_ID}
                       canDnD={true}
                       moveTiles={moveTilesUseCb}
                       selectedTiles={state.selectedTiles}
                       onTileDragEnd={onTileDragEnd}
                       handleTileSelection={handleTileSelectionCb}
                       handleLongPress={handleLongPressCb}
                       onLongPressMouseUp={onLongPressMouseUp}
        />
    )

    const sidebar = (
        <Sidebar
            boardIsValid={isBoardValid(G.board)}
            currentPlayer={ctx.currentPlayer}
            playerID={playerID}
            matchID={matchID}
            matchData={matchData || []}
            gameover={ctx.gameover}
            onTimeout={onTimeout}
            timePerTurn={G.timePerTurn}
            hands={G.hands}
            tilesOnPool={G.tiles_pool.length}
        />
    )

    const drawOrEnd = isBoardDirty(G) ? endBut : drawBut

    return <DndProvider backend={HTML5Backend}>
        <div className={'container-float'}>
            {sidebar}
            <div className="board" onClick={onBoardClick}>
                {boardGrid}
                <div className={'hand-buttons'}>
                    {handGrid}
                    <div className="buttons">
                        <button className={'btn btn-primary'} onClick={() => {
                            onOrderByColorClicked()
                        }}>789
                        </button>
                        <button className={'btn btn-primary'} onClick={() => {
                            onOrderByValColor()
                        }}>777
                        </button>
                        {drawOrEnd}
                        {cancelBut}
                    </div>
                </div>
            </div>

            <TileDragLayer
                G={G}
                playerID={playerID}
                selectedTiles={state.selectedTiles}
            />
        </div>
    </DndProvider>
}

export default RummikubBoard