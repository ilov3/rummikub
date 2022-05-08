import {
    freezeJokersInRun,
    freezeJokersInGroup,
    RedJoker,
    BlackJoker,
    buildTileObj,
    freezeJokerProp, arraysEqual
} from "../rummikub/util";

test('test arraysEqual empty arrays equal', () => {
    let arr1 = []
    let arr2 = []

    expect(arraysEqual(arr1, arr2)).toEqual(true);
    expect(arraysEqual(arr2, arr1)).toEqual(true);
});

test('test arraysEqual non-empty arrays equal', () => {
    let arr1 = [1, 2, 3]
    let arr2 = [1, 2, 3]

    expect(arraysEqual(arr1, arr2)).toEqual(true);
    expect(arraysEqual(arr2, arr1)).toEqual(true);
});

test('test arraysEqual flat arrays unequal', () => {
    let arr1 = [1, 2]
    let arr2 = [2, 3]

    expect(arraysEqual(arr1, arr2)).toEqual(false);
    expect(arraysEqual(arr2, arr1)).toEqual(false);
});

test('test arraysEqual flat obj arrays equal', () => {
    let arr1 = [{a: 1}, {b: 2}]
    let arr2 = [{a: 1}, {b: 2}]

    expect(arraysEqual(arr1, arr2)).toEqual(true);
    expect(arraysEqual(arr2, arr1)).toEqual(true);
});

test('test arraysEqual flat obj arrays equal with null', () => {
    let arr1 = [{a: 1}, {b: 2}, null]
    let arr2 = [{a: 1}, {b: 2}, null]

    expect(arraysEqual(arr1, arr2)).toEqual(true);
    expect(arraysEqual(arr2, arr1)).toEqual(true);
});

test('test arraysEqual flat obj arrays unequal', () => {
    let arr1 = [{a: 1}, {b: 3}]
    let arr2 = [{a: 1}, {b: 2}]

    expect(arraysEqual(arr1, arr2)).toEqual(false);
    expect(arraysEqual(arr2, arr1)).toEqual(false);
});