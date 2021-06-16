import {
    freezeJokersInRun,
    freezeJokersInGroup,
    RedJoker,
    BlackJoker,
    buildTileObj,
    freezeJokerProp
} from "../game/util";

test('test freeze one joker', () => {
    let tiles = [
        buildTileObj(2, 'red', 0),
        BlackJoker,
        buildTileObj(4, 'red', 0),
    ]
    let expected = [
        buildTileObj(2, 'red', 0),
        freezeJokerProp(BlackJoker, {value: 3}),
        buildTileObj(4, 'red', 0),
    ]
    expect(freezeJokersInRun(tiles)).toEqual(expected);
});

test('test freeze two jokers in the end', () => {
    let tiles = [
        RedJoker,
        buildTileObj(3, 'red', 0),
        BlackJoker
    ]
    let expected = [
        freezeJokerProp(RedJoker, {value: 2}),
        buildTileObj(3, 'red', 0),
        freezeJokerProp(BlackJoker, {value: 4}),
    ]
    expect(freezeJokersInRun(tiles)).toEqual(expected);
});

test('test freeze two jokers', () => {
    let tiles = [
        RedJoker,
        BlackJoker,
        buildTileObj(3, 'red', 0),
    ]
    let expected = [
        freezeJokerProp(RedJoker, {value: 1}),
        freezeJokerProp(BlackJoker, {value: 2}),
        buildTileObj(3, 'red', 0),
    ]
    expect(freezeJokersInRun(tiles)).toEqual(expected);
});

test('test freeze two jokers in middle', () => {
    let tiles = [
        buildTileObj(1, 'red', 0),
        RedJoker,
        buildTileObj(3, 'red', 0),
        BlackJoker,
        buildTileObj(5, 'red', 0),
    ]
    let expected = [
        buildTileObj(1, 'red', 0),
        freezeJokerProp(RedJoker, {value: 2}),
        buildTileObj(3, 'red', 0),
        freezeJokerProp(BlackJoker, {value: 4}),
        buildTileObj(5, 'red', 0),
    ]
    expect(freezeJokersInRun(tiles)).toEqual(expected);
});

test('test freeze one joker 1 after 13', () => {
    let tiles = [
        buildTileObj(12, 'red', 0),
        buildTileObj(13, 'red', 0),
        BlackJoker
    ]
    let expected = [
        buildTileObj(12, 'red', 0),
        buildTileObj(13, 'red', 0),
        freezeJokerProp(BlackJoker, {value: 1})
    ]
    expect(freezeJokersInRun(tiles)).toEqual(expected);
});

test('test freeze two joker 1 after 13', () => {
    let tiles = [
        buildTileObj(12, 'red', 0),
        RedJoker,
        BlackJoker,
    ]
    let expected = [
        buildTileObj(12, 'red', 0),
        freezeJokerProp(RedJoker, {value: 13}),
        freezeJokerProp(BlackJoker, {value: 1}),
    ]
    expect(freezeJokersInRun(tiles)).toEqual(expected);
});

test('test freeze one joker in group', () => {
    let tiles = [
        buildTileObj(12, 'red', 0),
        buildTileObj(12, 'blue', 0),
        BlackJoker
    ]
    let expected = [
        buildTileObj(12, 'red', 0),
        buildTileObj(12, 'blue', 0),
        freezeJokerProp(BlackJoker, {value: 12})
    ]
    expect(freezeJokersInGroup(tiles)).toEqual(expected);
});


test('test freeze two joker in group', () => {
    let tiles = [
        buildTileObj(12, 'red', 0),
        RedJoker,
        BlackJoker
    ]
    let expected = [
        buildTileObj(12, 'red', 0),
        freezeJokerProp(RedJoker, {value: 12}),
        freezeJokerProp(BlackJoker, {value: 12}),
    ]
    expect(freezeJokersInGroup(tiles)).toEqual(expected);
});