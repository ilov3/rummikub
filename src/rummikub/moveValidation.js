import _ from "lodash";
import {countSeqScore, isSequenceValid} from "./util.js";
import {FIRST_MOVE_SCORE_LIMIT, BOARD_GRID_ID} from "./constants";


function freezeTmpTiles(G) {
    for (let tileId of Object.keys(G.tilePositions)) {
        let tilePos = G.tilePositions[tileId]
        if (tilePos && tilePos.tmp) {
            tilePos.tmp = false
            G.tilePositions[tileId] = tilePos
        }
    }
}

function isBoardHasNewTiles(G) {
    for (let tileId of Object.keys(G.tilePositions)) {
        if (G.tilePositions[tileId] && G.tilePositions[tileId].tmp) {
            return true
        }
    }
    return false
}

function extractSeqs(G) {
    const seqs = [];

    // Group all tile positions on the board by row
    const tilesByRow = {};
    for (const tileId in G.tilePositions) {
        const pos = G.tilePositions[tileId];
        if (pos.gridId === BOARD_GRID_ID) {
            if (!tilesByRow[pos.row]) {
                tilesByRow[pos.row] = {};
            }
            tilesByRow[pos.row][pos.col] = tileId;
        }
    }

    // For each row, scan left to right and extract contiguous sequences
    for (const rowStr of Object.keys(tilesByRow)) {
        const row = parseInt(rowStr);
        const rowTiles = tilesByRow[row];
        const cols = Object.keys(rowTiles).map(Number).sort((a, b) => a - b);

        let seq = [];
        for (let i = 0; i < cols.length; i++) {
            const col = cols[i];
            const tileId = rowTiles[col];

            if (seq.length === 0 || col === cols[i - 1] + 1) {
                seq.push(tileId);
            } else {
                if (seq.length > 0) {
                    seqs.push(seq);
                    seq = [tileId];
                }
            }
        }
        if (seq.length > 0) {
            seqs.push(seq);
        }
    }

    return seqs;
}


function isBoardValid(G) {
    let seqs = extractSeqs(G)
    for (const seq of seqs) {
        if (!isSequenceValid(seq)) {
            return false
        }
    }
    return true
}

function isMoveValid(G, ctx) {
    let seqs = extractSeqs(G)

    let newFound = _.find(seqs, function (seq) {
        for (let tile of seq) {
            let tilePos = G.tilePositions[tile]
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
            return false
        }
    }
    return true
}


function isFirstMove(G, ctx) {
    return !G.firstMoveDone[ctx.currentPlayer]
}

function isFirstMoveValid(G, ctx) {
    let seqs = extractSeqs(G)
    console.debug(seqs)

    let mixed = _.find(seqs, function (seq) {
        let oldFound = false
        let newFound = false
        for (let tile of seq) {
            let tilePos = G.tilePositions[tile]
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
        let tilePos = G.tilePositions[tile]
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
    isBoardHasNewTiles,
    isBoardValid,
    extractSeqs,
}