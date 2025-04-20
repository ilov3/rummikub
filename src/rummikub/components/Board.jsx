import React, {useState, useCallback, useRef, useEffect} from "react";
import './board.css';
import GridContainer from "./GridContainer";
import {DndProvider} from 'react-dnd'
import {HTML5Backend} from 'react-dnd-html5-backend'
import {
    HAND_GRID_ID, BOARD_GRID_ID, BOARD_ROWS, BOARD_COLS, HAND_ROWS, HAND_COLS
} from "../constants";
import Sidebar from "./Sidebar";
import {extractSeqs, isBoardHasNewTiles, isBoardValid} from "../moveValidation";
import {getSecTs, isSequenceValid} from "../util";
import TileDragLayer from "./TileDragLayer";
import GameOverModal from "./GameOverModal";
import {handleTileSelection, handleLongPress} from "../boardUtil";
import _ from "lodash";

const RummikubBoard = function ({G, ctx, moves, playerID, matchData, matchID, events}) {
    console.log('RENDER BOARD')
    const boardGridRef = useRef(null);
    const [boardGriBoundingBox, setboardGriBoundingBox] = useState({});
    useEffect(() => {
        if (boardGridRef.current) {
            const rect = boardGridRef.current.getBoundingClientRect();
            setboardGriBoundingBox(rect);
        }
    }, []);


    useEffect(() => {
        if (playerID === '0' && ctx.phase === 'playersJoin' && _.every(matchData, (item) => item.name)) {
            console.log('ALL PLAYERS JOINED', new Date())
            events.endPhase()
        }
    }, [matchData])


    const [state, setState] = useState({selectedTiles: [], lastSelectedTileId: null})
    const [showInvalidTiles, setShowInvalidTiles] = useState(false);
    const [validTiles, setValidTiles] = useState([])
    const [draggingTiles, setDraggingTiles] = useState([])
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
        console.log('TURN TIME OUT!', new Date())
        endTurn()
    }

    const checkTimerExpired = useCallback((timerId) => {
        if (ctx.gameover) {
            clearInterval(timerId)
        }
        if (G.timerExpireAt) {
            const secondsLeft = G.timerExpireAt - getSecTs();
            if (secondsLeft <= 0 && playerID === ctx.currentPlayer) {
                onTimeout()
            }
        }
    }, [G.timerExpireAt, ctx.currentPlayer, ctx.gameover])


    const endBut = (<button disabled={!(ctx.currentPlayer === playerID) || ctx.gameover}
                            className={'rummikub-button'}
                            onClick={() => {
                                endTurn()
                            }}>End
    </button>)

    const drawBut = (<button
        disabled={!(ctx.currentPlayer === playerID && G.tilesPool.length) || ctx.gameover || ctx.phase === 'playersJoin'}
        title={'Take a tile and skip the turn'}
        className={'rummikub-button'}
        onClick={() => {
            drawTile()
        }}>Draw
    </button>)
    const undoBut = (<button disabled={!G.gameStateStack.length || ctx.gameover}
                             className={'rummikub-button'}
                             title={'Undo last action'}
                             onClick={() => {
                                 moves.undo()
                             }}>Undo
    </button>)

    const redoBut = (<button disabled={!G.redoMoveStack.length || ctx.gameover}
                             className={'rummikub-button'}
                             title={'Redo last action'}
                             onClick={() => {
                                 moves.redo()
                             }}>Redo
    </button>)

    const boardGrid = (<div className="ref" ref={boardGridRef}>
        <GridContainer
            rows={BOARD_ROWS}
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
            moves={moves}
            playerID={playerID}
            draggingTiles={draggingTiles}
        /></div>)

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
                       moves={moves}
                       playerID={playerID}
                       draggingTiles={draggingTiles}
        />)

    const sidebar = (
        <Sidebar
            currentPlayer={ctx.currentPlayer}
            playerID={playerID}
            matchID={matchID}
            matchData={matchData || []}
            gameover={ctx.gameover}
            timePerTurn={G.timePerTurn}
            timerExpireAt={G.timerExpireAt}
            onTimeout={checkTimerExpired}
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
            {ctx.gameover &&
                <GameOverModal
                    gameover={ctx.gameover}
                    matchId={matchID}
                    playerID={playerID}
                    matchData={matchData}
                />}

            {sidebar}
            <div className="board" onClick={onBoardClick}>
                {boardGrid}
                <div className={'hand-buttons'}>
                    {handGrid}
                    <div className="controls-wrapper">
                        <button disabled={ctx.gameover}
                                title={'Order by runs'}
                                className={'rummikub-button'} onClick={() => {
                            onOrderByColorClicked()
                        }}>789
                        </button>
                        <button disabled={ctx.gameover}
                                title={'Order by sets'}
                                className={'rummikub-button'} onClick={() => {
                            onOrderByValColor()
                        }}>777
                        </button>
                        {drawOrEnd}
                        {(ctx.currentPlayer === playerID) ? undoBut : ''}
                        {(ctx.currentPlayer === playerID) ? redoBut : ''}
                    </div>
                </div>
            </div>
            <TileDragLayer
                G={G}
                playerID={playerID}
                selectedTiles={state.selectedTiles}
                draggingTiles={draggingTiles}
                setDraggingTiles={useCallback(setDraggingTiles, [])}
            />
        </div>
    </DndProvider>
}

export default RummikubBoard