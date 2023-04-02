import {
    freezeJokersInRun,
    freezeJokersInGroup,
    RedJoker,
    BlackJoker,
    buildTileObj,
    freezeJokerProp, setTileValue
} from "../rummikub/util";
import {COLOR} from "../rummikub/constants";

test('test freeze one joker', () => {
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

test('test freeze one joker 1 after 13', () => {
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

test('test freeze two joker 1 after 13', () => {
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

test('test freeze one joker in group', () => {
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


test('test freeze two joker in group', () => {
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