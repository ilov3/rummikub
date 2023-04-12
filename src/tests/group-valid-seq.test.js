import {
    groupValidSequences,
    buildTileObj,
} from '../rummikub/util.js'
import {COLOR} from "../rummikub/constants";

test('groups a single valid sequence', () => {
    const input = [
        buildTileObj(1, COLOR.red, 0),
        buildTileObj(2, COLOR.red, 0),
        buildTileObj(3, COLOR.red, 0),
    ];
    const expected = [
        buildTileObj(1, COLOR.red, 0),
        buildTileObj(2, COLOR.red, 0),
        buildTileObj(3, COLOR.red, 0),
        null,
    ];
    expect(groupValidSequences(input)).toEqual(expected);
});

test('does not group an invalid sequence', () => {
    const input = [
        buildTileObj(1, COLOR.red, 0),
        buildTileObj(2, COLOR.red, 0),
        buildTileObj(4, COLOR.red, 0),
    ];
    expect(groupValidSequences(input)).toEqual(input);
});

test('groups multiple valid sequences', () => {
    const input = [
        buildTileObj(1, COLOR.red, 1),
        buildTileObj(2, COLOR.red, 0),
        buildTileObj(3, COLOR.red, 1),
        buildTileObj(5, COLOR.red, 0),
        buildTileObj(6, COLOR.red, 0),
        buildTileObj(7, COLOR.red, 0),
    ];
    const expected = [
        buildTileObj(1, COLOR.red, 1),
        buildTileObj(2, COLOR.red, 0),
        buildTileObj(3, COLOR.red, 1),
        null,
        buildTileObj(5, COLOR.red, 0),
        buildTileObj(6, COLOR.red, 0),
        buildTileObj(7, COLOR.red, 0),
        null
    ];
    expect(groupValidSequences(input)).toEqual(expected);
});

test('groups a single valid tile group', () => {
    const input = [
        buildTileObj(5, COLOR.red, 0),
        buildTileObj(5, COLOR.blue, 0),
        buildTileObj(5, COLOR.orange, 0),
    ];
    const expected = [
        buildTileObj(5, COLOR.red, 0),
        buildTileObj(5, COLOR.blue, 0),
        buildTileObj(5, COLOR.orange, 0),
        null,
    ];
    expect(groupValidSequences(input)).toEqual(expected);
});

test('does not group an invalid tile group', () => {
    const input = [
        buildTileObj(5, COLOR.red, 0),
        buildTileObj(5, COLOR.blue, 0),
    ];
    expect(groupValidSequences(input)).toEqual(input);
});

test('groups multiple valid tile groups', () => {
    const input = [
        buildTileObj(5, COLOR.red, 0),
        buildTileObj(5, COLOR.blue, 0),
        buildTileObj(5, COLOR.orange, 0),
        buildTileObj(7, COLOR.red, 0),
        buildTileObj(7, COLOR.blue, 0),
        buildTileObj(7, COLOR.orange, 0),
    ];
    const expected = [
        buildTileObj(5, COLOR.red, 0),
        buildTileObj(5, COLOR.blue, 0),
        buildTileObj(5, COLOR.orange, 0),
        null,
        buildTileObj(7, COLOR.red, 0),
        buildTileObj(7, COLOR.blue, 0),
        buildTileObj(7, COLOR.orange, 0),
        null
    ];
    expect(groupValidSequences(input)).toEqual(expected);
});
