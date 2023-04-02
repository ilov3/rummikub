import _ from "lodash";
import {COLOR, COLORS} from "./constants";

let isPrimitive = (val) => {
    if (val === null) {
        return true;
    }
    if (typeof val == "object" || typeof val == "function") {
        return false
    } else {
        return true
    }
}

const objectsEqual = function (o1, o2) {
    return isPrimitive(o1) ? o1 === o2 : Object.keys(o1).length === Object.keys(o2).length &&
        Object.keys(o1).every(p => o1[p] === o2[p])
};

function arraysEqual(a1, a2) {
    return a1.length === a2.length && a1.every((o, idx) => objectsEqual(o, a2[idx]));
}

function transpose(a) {
    return a[0].map((_, colIndex) => a.map(row => row[colIndex]));
}

function count2dArrItems(arr2d) {
    let counter = 0
    for (let row of arr2d) {
        for (let item of row) {
            if (item) {
                counter++
            }
        }
    }
    return counter
}

function buildTileObj(value, color, variant) {
    // console.log('BUILDING TILE AS INT FROM:', value, color, variant)
    let tile = variant
    tile = tile << 2
    tile += color
    tile = tile << 4
    tile += value
    // console.log('PARSING BACK:', getTileObj(tile))
    // console.log(tile, value, tile.toString(2))
    return tile
    // return {value: value, color: color, id: `${variant}-${value}-${color}`, i: variant}
}

function getTileValue(tile) {
    return tile & 0xf
}

function getTileColor(tile) {
    return (tile >> 4) & 0x3
}

function setTileValue(tile, value) {
    let copy = tile
    copy >>= 4
    copy += value
    return copy
}

function setTileColor(tile, color) {
    let copy = tile >> 6
    copy <<= 2
    copy += color
    copy <<= 4
    copy += getTileValue(tile)
    return copy
}

function getTileObj(tile) {
    const value = getTileValue(tile)
    const color = getTileColor(tile)
    const variant = tile >> 6
    return {value: value, color: color, id: `${variant}-${value}-${color}`, i: variant}
}

function getTileById(tileId) {
    const [variant, value, color] = tileId.split('-')
    return buildTileObj(parseInt(value), color, parseInt(variant))
}

const RedJoker = buildTileObj(0, COLOR.red, 0)
const BlackJoker = buildTileObj(0, COLOR.black, 0)

function getTiles() {
    let tiles = []
    const Values = _.range(1, 14)

    for (let i = 0; i < 2; i++) {
        for (const col of COLORS) {
            for (const val of Values) {
                let tile = buildTileObj(val, COLOR[col], i)
                tiles.push(tile)
            }
        }
    }
    tiles.push(RedJoker)
    tiles.push(BlackJoker)
    return tiles
}

function isJoker(tile) {
    if (getTileValue(tile) === 0) {
        return true
    } else {
        return false
    }
}

function isSameColor(tiles) {
    let colors = []
    for (let tile of tiles) {
        if (!isJoker(tile)) {
            colors.push(getTileColor(tile))
        }
    }
    let uniques = _.uniqBy(colors)
    return uniques.length > 1 ? false : true
}

function isDiffColor(tiles) {
    let colors = []
    let length = tiles.length
    for (let tile of tiles) {
        if (!isJoker(tile)) {
            colors.push(getTileColor(tile))
        } else {
            length--
        }
    }
    let uniques = _.uniqBy(colors)
    return uniques.length === length ? true : false
}

function isSameValue(tiles) {
    let values = []
    for (let tile of tiles) {
        if (!isJoker(tile)) {
            values.push(getTileValue(tile))
        }
    }
    let uniques = _.uniqBy(values)
    return uniques.length > 1 ? false : true
}


function extractJoker(tiles) {
    let sorted = _.orderBy(tiles, [(tile) => getTileValue(tile)], ['asc'])
    if (isJoker(sorted[0])) {
        return sorted.slice(1)
    }
    return sorted
}

function freezeJokerProp(joker, props) {
    return {...joker, ...props}
}

function freezeJokersInRun(tiles) {
    console.debug('call', tiles)

    let freezed = [];
    let left = 0;
    let twoJokersNear = false
    for (let right = 1; right < tiles.length; right++) {
        console.debug(right)
        let curr = tiles[left]
        let next = tiles[right]
        console.debug(curr, next)
        if (isJoker(curr) && isJoker(next)) {
            twoJokersNear = true
            if (right === tiles.length - 1) {
                let copy = setTileValue(curr, getTileValue(tiles[left - 1]) + 1)
                if (getTileValue(copy) === 14) {
                    return null
                }
                freezed.push(copy)
                freezed.push(next)
                left++
                continue
            }
            freezed.push(curr)
            left++
            continue
        } else if (isJoker(curr) && !isJoker(next)) {
            console.debug('curr is joker; next is not')
            let copy = setTileValue(curr, getTileValue(next) - 1)
            console.debug(getTileValue(copy))
            if (getTileValue(copy) === 0) {
                if (left === 0) {
                    return null
                } else {
                    copy = setTileValue(copy, 13)
                }
            }
            freezed.push(copy)
            console.debug('after push', freezed)
            if (right === tiles.length - 1) {
                freezed.push(next)
            }
            left++
            continue
        } else if (!isJoker(curr) && isJoker(next)) {
            freezed.push(curr)
            if (right === tiles.length - 1) {
                let copy = setTileValue(next, getTileValue(curr) + 1 === 14 ? 1 : getTileValue(curr) + 1)
                if (getTileValue(copy) === 2 && right !== 1) {
                    return null
                }
                freezed.push(copy)
            }
            left++
            continue
        } else {
            freezed.push(curr)
            if (right === tiles.length - 1) {
                freezed.push(next)
            }
            left++
            continue
        }
    }
    if (twoJokersNear) {
        freezed = freezeJokersInRun(freezed)
    }
    console.assert(freezed.length === tiles.length)
    freezed.forEach((tile) => console.debug(getTileValue(tile)))
    return freezed
}

function freezeJokersInGroup(tiles) {
    let freezed = []
    let simpleTile = _.find(tiles, (tile) => !isJoker(tile))
    for (let tile of tiles) {
        let copy = setTileValue(tile, getTileValue(simpleTile))
        freezed.push(copy)
    }
    return freezed
}


function countSeqScore(tiles) {
    let score = 0
    if (tiles.length < 3) {
        return 0
    }
    let jokersCount = 0
    for (let tile of tiles) {
        if (isJoker(tile)) {
            jokersCount++
        }
    }

    if (isSameColor(tiles)) {
        let freezed = jokersCount ? freezeJokersInRun(tiles) : tiles
        if (!freezed) {
            return 0
        }
        let left = 0
        let oneAfterThirteen = false
        for (let right = 1; right < freezed.length; right++) {
            if (oneAfterThirteen) {
                return 0
            }
            let curr = freezed[left]
            let next = freezed[right]
            if (getTileValue(next) - getTileValue(curr) === 1) {
                score += curr.value
                if (right === tiles.length - 1) {
                    score += getTileValue(next)
                }
            } else if (getTileValue(curr) === 13 && getTileValue(next) === 1) {
                oneAfterThirteen = true
                score += getTileValue(curr)
                if (right === tiles.length - 1) {
                    score += getTileValue(next)
                }
            } else {
                return 0
            }
            left++
        }
        return score
    }

    if (isDiffColor(tiles) && isSameValue(tiles)) {
        let freezed = jokersCount ? freezeJokersInGroup(tiles) : tiles
        score = getTileValue(freezed[0]) * freezed.length
    } else {
        return 0
    }

    return score
}

function isSequenceValid(tiles) {
    console.debug('IS SEQ VALID:', tiles)
    return countSeqScore(tiles) > 0
}

function countPoints(hands, excludeIndex) {
    let points = 0
    for (let i = 0; i < hands.length; i++) {
        if (i !== excludeIndex) {
            let hand = hands[i]
            let flattened = _.flatten(hand)
            for (let tile of flattened) {
                if (tile) {
                    let tilePoint = isJoker(tile) ? 30 : getTileValue(tile)
                    points += tilePoint
                }
            }
        }
    }
    return points
}

function findWinner(hands) {
    let winner_points = 1000
    let winner = 0

    for (let i = 0; i < hands.length; i++) {
        let points = 0
        let hand = hands[i]
        let flattened = _.flatten(hand)
        for (let tile of flattened) {
            if (tile) {
                let tilePoint = isJoker(tile) ? 30 : getTileValue(tile)
                points += tilePoint
            }
        }
        if (points < winner_points) {
            winner_points = points
            winner = i
        }
    }
    return winner
}

function tryOrderTiles(tiles) {
    try {
        if (isSequenceValid(tiles)) {
            return tiles
        } else {
            let sorted = _.orderBy(tiles, [
                (tile) => getTileColor(tile),
                (tile) => getTileValue(tile),
            ], ['asc'])
            if (isSequenceValid(sorted)) {
                return sorted
            }
            sorted = _.orderBy(tiles, [
                (tile) => getTileValue(tile),
                (tile) => getTileColor(tile),
            ], ['asc'])
            if (isSequenceValid(sorted)) {
                return sorted
            }
        }
    } catch (error) {
        console.debug('Could not find combination within given tiles')
    }
    return tiles
}

function reorderTiles(tiles) {
    if (!tiles || tiles.length < 3) {
        return tiles
    }
    let result = []
    let pointer = 0
    let validSeqs = []
    let validTiles = new Set()
    let index = pointer + 3
    while (index <= tiles.length) {
        let validSeqFound = false
        while (true) {
            let slice = tiles.slice(pointer, index)
            if (isSequenceValid(slice)) {
                validSeqFound = true
                slice.forEach((tile) => validTiles.add(tile))
                index++
            } else {
                if (validSeqFound) {
                    validSeqs.push(slice.slice(0, -1))
                    pointer = index
                    index += 3
                    validSeqFound = false
                } else {
                    pointer++
                    index = pointer + 3
                }
                break
            }
            if (index > tiles.length) {
                if (validSeqFound) {
                    validSeqs.push(slice)
                }
                break
            }
        }
    }
    for (const seq of validSeqs) {
        result.push(...seq)
        result.push(null)
    }
    for (const tile of tiles) {
        if (!validTiles.has(tile)) {
            result.push(tile)
        }
    }
    console.log('REORDER TILES', validSeqs, validTiles)
    return result
}

function getSecTs() {
    return Math.floor((new Date).getTime() / 1000)
}

export {
    buildTileObj,
    getTileValue,
    getTileColor,
    setTileValue,
    setTileColor,
    getTileById,
    getTiles,
    isJoker,
    isSequenceValid,
    tryOrderTiles,
    extractJoker,
    freezeJokerProp,
    freezeJokersInRun,
    freezeJokersInGroup,
    countSeqScore,
    arraysEqual,
    transpose,
    count2dArrItems,
    countPoints,
    reorderTiles,
    RedJoker,
    BlackJoker,
    findWinner,
    getSecTs,
}