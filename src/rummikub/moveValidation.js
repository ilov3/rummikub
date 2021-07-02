import _ from "lodash";
import {arraysEqual, countSeqScore, isSequenceValid} from "./util.js";
import {BOARD_COLS, BOARD_ROWS, FIRST_MOVE_SCORE_LIMIT} from "./constants";

function isCalledByActivePlayer(ctx) {
    return ctx.playerID == ctx.currentPlayer
}

function freezeTmpTiles(G) {
    for (let tileId of Object.keys(G.tilePositions)) {
        let tilePos = G.tilePositions[tileId]
        if (tilePos && tilePos.tmp) {
            tilePos.tmp = false
            G.tilePositions[tileId] = tilePos
        }
    }
}

function isBoardDirty(G) {
    for (let tileId of Object.keys(G.tilePositions)) {
        if (G.tilePositions[tileId].tmp) {
            return true
        }
    }
    return false
}

function isBoardChanged(G) {
    return !arraysEqual(G.board, G.prevBoard)
}

function extractSeqs(board) {
    let seqs = []
    const rows = board.length
    const cols = board[0].length
    for (let row = 0; row < rows; row++) {
        let seq = []
        for (let col = 0; col < cols; col++) {
            let tile = board[row][col]
            if (tile) {
                seq.push(tile)
            } else {
                if (seq.length > 0) {
                    seqs.push(seq)
                    seq = []
                }
            }
        }
    }
    return seqs
}

function isBoardValid(board) {
    let seqs = extractSeqs(board)
    for (const seq of seqs) {
        if (!isSequenceValid(seq)) {
            return false
        }
    }
    return true
}

function isMoveValid(G, ctx) {
    let seqs = extractSeqs(G.board)
    console.debug(seqs)

    let newFound = _.find(seqs, function (seq) {
        for (let tile of seq) {
            let tilePos = G.tilePositions[tile.id]
            if (tilePos.tmp) {
                return true
            }
        }
    })
    if (!newFound) {
        console.debug("MOVE FAIL: NO NEW TILE")
        return false
    }
    for (const seq of seqs) {
        if (!isSequenceValid(seq)) {
            console.debug("MOVE FAIL: SEQ INV:", seq)
            return false
        }
    }
    return true
}


function isFirstMove(G, ctx) {
    return !G.firstMoveDone[ctx.currentPlayer]
}

function isFirstMoveValid(G, ctx) {
    let seqs = extractSeqs(G.board)
    console.debug(seqs)

    let mixed = _.find(seqs, function (seq) {
        let oldFound = false
        let newFound = false
        for (let tile of seq) {
            let tilePos = G.tilePositions[tile.id]
            if (tilePos.tmp) {
                newFound = true
            } else {
                oldFound = true
            }
        }
        return oldFound && newFound
    })
    if (mixed) {
        console.debug("FIRST MOVE FAIL: MIXED:", mixed)
        return false
    }

    let score = 0;
    for (let seq of seqs) {
        let seqScore = countSeqScore(seq)
        if (!seqScore) {
            console.debug("FIRST MOVE FAIL: INV SEQ:", seq)
            return false
        }
        let tile = seq[0]
        let tilePos = G.tilePositions[tile.id]
        if (tilePos.tmp) {
            score += seqScore
        }
    }
    if (score < FIRST_MOVE_SCORE_LIMIT) {
        console.debug("FIRST MOVE FAIL: NOT ENOUGH SCORE: ", score)
        return false
    }
    return true
}

export {
    isMoveValid,
    freezeTmpTiles,
    isFirstMoveValid,
    isFirstMove,
    isBoardDirty,
    isBoardChanged,
    isCalledByActivePlayer,
    isBoardValid,
}