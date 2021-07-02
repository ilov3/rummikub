import {countSeqScore, RedJoker, BlackJoker, buildTileObj} from "../rummikub/util";

test('test count score one joker', () => {
    let tiles = [
        buildTileObj(2, 'red', 0),
        BlackJoker,
        buildTileObj(4, 'red', 0),
    ]
    expect(countSeqScore(tiles)).toEqual(9);
});

test('test count score two jokers in the end', () => {
    let tiles = [
        RedJoker, buildTileObj(3, 'red', 0), BlackJoker
    ]
    expect(countSeqScore(tiles)).toEqual(9);
});

test('test count score two jokers', () => {
    let tiles = [
        RedJoker, BlackJoker, buildTileObj(4, 'red', 0)
    ]
    expect(countSeqScore(tiles)).toEqual(9);
});

test('test count score two jokers in middle', () => {
    let tiles = [
        buildTileObj(1, 'red', 0),
        RedJoker,
        buildTileObj(3, 'red', 0),
        BlackJoker,
        buildTileObj(5, 'red', 0),
    ]
    expect(countSeqScore(tiles)).toEqual(15);
});

test('test count score one joker 1 after 13', () => {
    let tiles = [
        buildTileObj(12, 'red', 0),
        buildTileObj(13, 'red', 0),
        BlackJoker
    ]
    expect(countSeqScore(tiles)).toEqual(26);
});

test('test count score one joker in group', () => {
    let tiles = [
        buildTileObj(12, 'red', 0),
        buildTileObj(12, 'black', 0),
        BlackJoker
    ]
    expect(countSeqScore(tiles)).toEqual(36);
});


test('test count score two joker in group', () => {
    let tiles = [
        buildTileObj(12, 'red', 0),
        RedJoker,
        BlackJoker
    ]
    expect(countSeqScore(tiles)).toEqual(26);
});

test('test count score 1 after 13', () => {
    let tiles = [
        buildTileObj(12, 'red', 0),
        buildTileObj(13, 'red', 0),
        buildTileObj(1, 'red', 0),
    ]
    expect(countSeqScore(tiles)).toEqual(26);
});

test('negative test count score inv seq 1', () => {
    let tiles = [
        buildTileObj(5, 'red', 0),
        buildTileObj(6, 'red', 0),
        buildTileObj(7, 'red', 0),
        buildTileObj(6, 'red', 0),
    ]
    expect(countSeqScore(tiles)).toEqual(0);
});

test('negative test count score inv seq 2', () => {
    let tiles = [
        buildTileObj(13, 'red', 0),
        buildTileObj(1, 'red', 0),
        buildTileObj(2, 'red', 0),
    ]
    expect(countSeqScore(tiles)).toEqual(0);
});

test('negative test count score inv seq 3', () => {
    let tiles = [
        buildTileObj(6, 'red', 0),
        buildTileObj(7, 'red', 0),
        buildTileObj(8, 'black', 0),
    ]
    expect(countSeqScore(tiles)).toEqual(0);
});