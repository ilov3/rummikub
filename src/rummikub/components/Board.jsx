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
import {extractSeqs, isBoardHasNewTiles, isBoardValid} from "../moveValidation";
import {BlackJoker, getTileById, isSequenceValid, transpose, tryOrderTiles} from "../util";
import TileDragLayer from "./TileDragLayer";
import {getGridByIdPlayer} from "../moves";
import {handleTileSelection, handleLongPress, clearTurnTimeout} from "../boardUtil";


const RummikubBoard = function ({G, ctx, moves, playerID, matchData, matchID}) {
    console.log('RENDER BOARD')
    const [state, setState] = useState({selectedTiles: [], lastSelectedTileId: null})
    const [showInvalidTiles, setShowInvalidTiles] = useState(false);
    let longPressTimeoutId = useRef(null)

    let validTiles = []
    let seqs = extractSeqs(G.board)
    for (const seq of seqs) {
        if (isSequenceValid(seq)) {
            for (const tile of seq) {
                validTiles.push(tile.id)
            }
        }
    }

    const moveTilesUseCb = useCallback((col, row, destGridId, tileIdObj, selectedTiles) => {
        moves.moveTiles(col, row, destGridId, tileIdObj, selectedTiles)
    }, [])
    const handleTileSelectionCb = useCallback((tileId, shiftKey, ctrlKey) => {
        console.log(state)
        handleTileSelection(G, state, setState, playerID, tileId, shiftKey, ctrlKey)
    }, [G, playerID, state])
    const handleLongPressCb = useCallback((tileId, timeout) => {
        handleLongPress(G, playerID, setState, longPressTimeoutId, tileId, timeout)
    }, [G, playerID, longPressTimeoutId])

    const onTileDragEnd = useCallback(() => {
        setState({selectedTiles: [], lastSelectedTileId: null})
    }, [])

    const onLongPressMouseUp = useCallback(() => {
        console.debug('LONG PRESS MOUSE UP REGISTERED')
        if (longPressTimeoutId.current) {
            clearTimeout(longPressTimeoutId.current)
        }
    }, [longPressTimeoutId])

    function onBoardClick(e) {
        let classList = e.target.className && e.target.className.split && e.target.className.split(' ')
        if (!(classList && (classList.includes('tile') || classList.includes('tile-text')))) {
            setState({selectedTiles: [], lastSelectedTileId: null})
        }
    }

    function onOrderByColorClicked(e) {
        moves.orderByColorVal();
    }

    function drawTile(e) {
        clearTurnTimeout(matchID, playerID)
        moves.drawTile(!isBoardValid(G.board))
    }

    function onOrderByValColor(e) {
        moves.orderByValColor()
    }

    function endTurn(e) {
        setShowInvalidTiles(true)
        setTimeout(() => {
            setShowInvalidTiles(false)
            clearTurnTimeout(matchID, playerID)
            moves.endTurn()
        }, 567)
    }

    function onTimeout() {
        console.debug('TURN TIME OUT!', new Date())
        endTurn()
    }


    const endBut = (
        <button className={'btn btn-primary'} onClick={() => {
            endTurn()
        }}>End
        </button>
    )

    const drawBut = (
        <button disabled={!(ctx.currentPlayer === playerID && G.tilesPool.length)} className={'btn btn-primary'}
                onClick={() => {
                    drawTile()
                }}>Draw
        </button>
    )

    const undoBut = (
        <button disabled={!(ctx.currentPlayer === playerID && G.gameStateStack.length)}
                className={'text-white btn btn-warning'}
                onClick={() => {
                    moves.undo()
                }}>Undo
        </button>
    )

    const redoBut = (
        <button disabled={!(ctx.currentPlayer === playerID && G.redoMoveStack.length)}
                className={'text-white btn btn-warning'}
                onClick={() => {
                    moves.redo()
                }}>Redo
        </button>
    )

    const boardGrid = (
        <GridContainer rows={BOARD_ROWS}
                       cols={BOARD_COLS}
                       tiles2dArray={G.board}
                       gridId={BOARD_GRID_ID}
                       canDnD={ctx.currentPlayer === playerID}
                       moveTiles={moveTilesUseCb}
                       highlightTiles={showInvalidTiles}
                       validTiles={validTiles}
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
                       highlightTiles={false}
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
            tilesOnPool={G.tilesPool.length}
        />
    )

    const drawOrEnd = isBoardHasNewTiles(G) || G.tilesPool.length ? endBut : drawBut

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
                        {undoBut}
                        {redoBut}
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