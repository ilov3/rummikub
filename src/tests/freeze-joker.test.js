import {
    freezeJokersInRun,
    freezeJokersInGroup,
    RedJoker,
    BlackJoker,
    buildTileObj,
    freezeJokerProp, setTileValue
} from "../rummikub/util";
import {COLOR} from "../rummikub/constants";

test('test freeze one RedJoker', () => {
    let tiles = [
        buildTileObj(2, COLOR.red, 0),
        BlackJoker,
        buildTileObj(4, COLOR.red, 0),
    ]
    let expected = [
        buildTileObj(2, COLOR.red, 0),
        setTileValue(BlackJoker, 3),
        buildTileObj(4, COLOR.red, 0),
    ]
    expect(freezeJokersInRun(tiles)).toEqual(expected);
});

test('test freeze two jokers in the end', () => {
    let tiles = [
        RedJoker,
        buildTileObj(3, COLOR.red, 0),
        BlackJoker
    ]
    let expected = [
        setTileValue(RedJoker, 2),
        buildTileObj(3, COLOR.red, 0),
        setTileValue(BlackJoker, 4),
    ]
    expect(freezeJokersInRun(tiles)).toEqual(expected);
});

test('test freeze two jokers', () => {
    let tiles = [
        RedJoker,
        BlackJoker,
        buildTileObj(3, COLOR.red, 0),
    ]
    let expected = [
        setTileValue(RedJoker, 1),
        setTileValue(BlackJoker, 2),
        buildTileObj(3, COLOR.red, 0),
    ]
    expect(freezeJokersInRun(tiles)).toEqual(expected);
});

test('test freeze two jokers in middle', () => {
    let tiles = [
        buildTileObj(1, COLOR.red, 0),
        RedJoker,
        buildTileObj(3, COLOR.red, 0),
        BlackJoker,
        buildTileObj(5, COLOR.red, 0),
    ]
    let expected = [
        buildTileObj(1, COLOR.red, 0),
        setTileValue(RedJoker, 2),
        buildTileObj(3, COLOR.red, 0),
        setTileValue(BlackJoker, 4),
        buildTileObj(5, COLOR.red, 0),
    ]
    expect(freezeJokersInRun(tiles)).toEqual(expected);
});

test('test freeze one RedJoker 1 after 13', () => {
    let tiles = [
        buildTileObj(12, COLOR.red, 0),
        buildTileObj(13, COLOR.red, 0),
        BlackJoker
    ]
    let expected = [
        buildTileObj(12, COLOR.red, 0),
        buildTileObj(13, COLOR.red, 0),
        setTileValue(BlackJoker, 1)
    ]
    expect(freezeJokersInRun(tiles)).toEqual(expected);
});

test('test freeze two RedJoker 1 after 13', () => {
    let tiles = [
        buildTileObj(12, COLOR.red, 0),
        RedJoker,
        BlackJoker,
    ]
    let expected = [
        buildTileObj(12, COLOR.red, 0),
        setTileValue(RedJoker, 13),
        setTileValue(BlackJoker, 1),
    ]
    expect(freezeJokersInRun(tiles)).toEqual(expected);
});

test('test freeze one RedJoker in group', () => {
    let tiles = [
        buildTileObj(12, COLOR.red, 0),
        buildTileObj(12, COLOR.blue, 0),
        BlackJoker
    ]
    let expected = [
        buildTileObj(12, COLOR.red, 0),
        buildTileObj(12, COLOR.blue, 0),
        setTileValue(BlackJoker, 12)
    ]
    expect(freezeJokersInGroup(tiles)).toEqual(expected);
});

test('test freeze two RedJoker in group', () => {
    let tiles = [
        buildTileObj(12, COLOR.red, 0),
        RedJoker,
        BlackJoker
    ]
    let expected = [
        buildTileObj(12, COLOR.red, 0),
        setTileValue(RedJoker, 12),
        setTileValue(BlackJoker, 12),
    ]
    expect(freezeJokersInGroup(tiles)).toEqual(expected);
});

test('should freeze a single joker in a valid run', () => {
    const tiles = [buildTileObj(1, 0, 0), RedJoker, buildTileObj(3, 0, 0)];
    const expected = [buildTileObj(1, 0, 0), buildTileObj(2, 0, 0), buildTileObj(3, 0, 0)];
    const result = freezeJokersInRun(tiles);
    expect(result).toEqual(expected);
});

test('should handle two adjacent jokers in a valid run', () => {
    const tiles = [buildTileObj(1, 0, 0), RedJoker, RedJoker, buildTileObj(4, 0, 0)];
    const expected = [buildTileObj(1, 0, 0), buildTileObj(2, 0, 0), buildTileObj(3, 0, 0), buildTileObj(4, 0, 0)];
    const result = freezeJokersInRun(tiles);
    expect(result).toEqual(expected);
});


test('should return null for an invalid run with jokers', () => {
    const tiles = [
        buildTileObj(1, 0, 0),
        RedJoker,
        BlackJoker,
        buildTileObj(2, 0, 0)];
    const result = freezeJokersInRun(tiles);
    expect(result).toBeNull();
});

test('should handle a valid run with no jokers', () => {
    const tiles = [buildTileObj(1, 0, 0), buildTileObj(2, 0, 0), buildTileObj(3, 0, 0)];
    const expected = [buildTileObj(1, 0, 0), buildTileObj(2, 0, 0), buildTileObj(3, 0, 0)];
    const result = freezeJokersInRun(tiles);
    expect(result).toEqual(expected);
});

test('should handle wrap around run', () => {
    const tiles = [buildTileObj(12, 0, 0), RedJoker, buildTileObj(1, 0, 0)];
    const expected = [buildTileObj(12, 0, 0), buildTileObj(13, 0, 0), buildTileObj(1, 0, 0)];
    const result = freezeJokersInRun(tiles);
    expect(result).toEqual(expected);
});

