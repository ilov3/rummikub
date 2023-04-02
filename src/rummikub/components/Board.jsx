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
import {extractSeqs, isBoardHasNewTiles, isBoardValid} from "../moveValidation";
import {getSecTs, isSequenceValid} from "../util";
import TileDragLayer from "./TileDragLayer";

import {handleTileSelection, handleLongPress, clearTurnTimeout} from "../boardUtil";
import _ from "lodash";


const RummikubBoard = function ({G, ctx, moves, playerID, matchData, matchID, events}) {
    console.log('RENDER BOARD')
    useEffect(() => {
        if (playerID === '0' &&
            ctx.phase === 'playersJoin' &&
            _.every(matchData, (item) => item.name)) {
            console.log('ALL PLAYERS JOINED', new Date())
            events.endPhase()
        }
    }, [matchData])
    const [state, setState] = useState({selectedTiles: [], lastSelectedTileId: null})
    const [showInvalidTiles, setShowInvalidTiles] = useState(false);
    const [counter, setCounter] = useState(G.timerExpireAt ? G.timerExpireAt - getSecTs() : G.timePerTurn)
    const [validTiles, setValidTiles] = useState([])
    let longPressTimeoutId = useRef(null)

    const moveTilesUseCb = useCallback((col, row, destGridId, tileIdObj, selectedTiles) => {
        moves.moveTiles(col, row, destGridId, tileIdObj, selectedTiles)
    }, [moves])
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
        moves.drawTile(!isBoardValid(G.board))
        // setSecondsLeft(G.timePerTurn)
    }

    function onOrderByValColor(e) {
        moves.orderByValColor()
    }

    function endTurn(e) {
        let seqs = extractSeqs(G.board)
        let _validTiles = []
        for (const seq of seqs) {
            if (isSequenceValid(seq)) {
                for (const tile of seq) {
                    _validTiles.push(tile)
                }
            }
        }
        setValidTiles(_validTiles)
        setShowInvalidTiles(true)
        setTimeout(() => {
            setShowInvalidTiles(false)
            moves.endTurn()
        }, 250)
    }

    function onTimeout() {
        console.debug('TURN TIME OUT!', new Date())
        endTurn()
    }

    const checkTimerExpired = useCallback((timerId) => {
        if (ctx.gameover) {
            clearInterval(timerId)
        }
        if (G.timerExpireAt) {
            const secondsLeft = G.timerExpireAt - getSecTs();
            setCounter(secondsLeft >= 0 ? secondsLeft : 0)
            if (secondsLeft <= 0 && playerID === ctx.currentPlayer) {
                onTimeout()
            }
        }
    }, [G, ctx])


    const endBut = (
        <button disabled={!(ctx.currentPlayer === playerID) || ctx.gameover}
                className={'btn btn-primary'}
                onClick={() => {
                    endTurn()
                }}>End
        </button>
    )

    const drawBut = (
        <button disabled={!(ctx.currentPlayer === playerID && G.tilesPool.length) || ctx.gameover}
                title={'Take a tile and skip the turn'}
                className={'btn btn-primary'}
                onClick={() => {
                    drawTile()
                }}>Draw
        </button>
    )

    const undoBut = (
        <button disabled={!(ctx.currentPlayer === playerID && G.gameStateStack.length) || ctx.gameover}
                className={'text-white btn btn-warning'}
                title={'Undo last action'}
                onClick={() => {
                    moves.undo()
                }}>Undo
        </button>
    )

    const redoBut = (
        <button disabled={!(ctx.currentPlayer === playerID && G.redoMoveStack.length) || ctx.gameover}
                className={'text-white btn btn-warning'}
                title={'Redo last action'}
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
            currentPlayer={ctx.currentPlayer}
            playerID={playerID}
            matchID={matchID}
            matchData={matchData || []}
            gameover={ctx.gameover}
            timer={counter}
            checkTimerExpired={checkTimerExpired}
            hands={G.hands}
            tilesOnPool={G.tilesPool.length}
        />
    )

    // todo finish and check
    let drawOrEnd
    if (G.tilesPool.length > 0 && !isBoardHasNewTiles(G)) {
        drawOrEnd = drawBut
    } else {
        drawOrEnd = endBut
    }

    return <DndProvider backend={HTML5Backend}>
        <div className={'container-float'}>
            {sidebar}
            <div className="board" onClick={onBoardClick}>
                {boardGrid}
                <div className={'hand-buttons'}>
                    {handGrid}
                    <div className="buttons">
                        <button disabled={ctx.gameover}
                                title={'Order by runs'}
                                className={'btn btn-primary'} onClick={() => {
                            onOrderByColorClicked()
                        }}>789
                        </button>
                        <button disabled={ctx.gameover}
                                title={'Order by sets'}
                                className={'btn btn-primary'} onClick={() => {
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