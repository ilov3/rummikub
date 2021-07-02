import _ from "lodash";

const objectsEqual = (o1, o2) =>
    Object.keys(o1).length === Object.keys(o2).length
    && Object.keys(o1).every(p => o1[p] === o2[p]);

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
    return {value: value, color: color, id: `${variant}-${value}-${color}`, i: variant}
}

function getTileById(tileId) {
    const [variant, value, color] = tileId.split('-')
    return buildTileObj(parseInt(value), color, parseInt(variant))
}

const RedJoker = buildTileObj(0, 'red', 0)
const BlackJoker = buildTileObj(0, 'black', 0)

function getTiles() {
    let tiles = []
    const Values = _.range(1, 14)
    const Colors = ['red', 'black', 'blue', 'orange']
    for (let i = 0; i < 2; i++) {
        for (const col of Colors) {
            for (const val of Values) {
                let tile = buildTileObj(val, col, i)
                tiles.push(tile)
            }
        }
    }
    tiles.push(RedJoker)
    tiles.push(BlackJoker)
    return tiles
}

function isJoker(tile) {
    if (tile.value === 0) {
        return true
    } else {
        return false
    }
}

function isSameColor(tiles) {
    let colors = []
    for (let tile of tiles) {
        if (!isJoker(tile)) {
            colors.push(tile.color)
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
            colors.push(tile.color)
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
            values.push(tile.value)
        }
    }
    let uniques = _.uniqBy(values)
    return uniques.length > 1 ? false : true
}


function extractJoker(tiles) {
    let sorted = _.orderBy(tiles, ['value'], ['asc'])
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
                let copy = Object.assign({}, curr)
                copy.value = tiles[left - 1].value + 1
                if (copy.value === 14) {
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
            let copy = Object.assign({}, curr)
            copy.value = next.value - 1
            console.debug(copy.value)
            if (copy.value === 0) {
                if (left === 0) {
                    return null
                } else {
                    copy.value = 13
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
                let copy = Object.assign({}, next)
                copy.value = (curr.value + 1) === 14 ? 1 : curr.value + 1
                if (copy.value === 2 && right !== 1) {
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
    console.debug('result', freezed)
    return freezed
}

function freezeJokersInGroup(tiles) {
    let freezed = []
    let simpleTile = _.find(tiles, (tile) => {
        return !isJoker(tile)
    })
    for (let tile of tiles) {
        let copy = Object.assign({}, tile)
        copy.value = simpleTile.value
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
            if (next.value - curr.value === 1) {
                score += curr.value
                if (right === tiles.length - 1) {
                    score += next.value
                }
            } else if (curr.value === 13 && next.value === 1) {
                oneAfterThirteen = true
                score += curr.value
                if (right === tiles.length - 1) {
                    score += next.value
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
        score = freezed[0].value * freezed.length
    } else {
        return 0
    }

    return score
}

function isSequenceValid(tiles) {
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
                    let tilePoint = isJoker(tile) ? 30 : tile.value
                    points += tilePoint
                }
            }
        }
    }
    return points
}

function tryOrderTiles(tiles) {
    try {
        if (isSequenceValid(tiles)) {
            return tiles
        } else {
            let sorted = _.orderBy(tiles, ['color', 'value'], ['asc'])
            if (isSequenceValid(sorted)) {
                return sorted
            }
            sorted = _.orderBy(tiles, ['value', 'color'], ['asc'])
            if (isSequenceValid(sorted)) {
                return sorted
            }
        }
    } catch (error) {
        console.debug('Could not find combination within given tiles')
    }
    return tiles
}

export {
    buildTileObj,
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
    RedJoker,
    BlackJoker,
}