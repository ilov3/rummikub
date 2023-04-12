import {
    buildTileObj, getTileColor, getTileValue,
} from '../rummikub/util.js'
import {COLOR} from "../rummikub/constants";
import {orderByFunc, compareTilesByColorVal, compareTilesByValColor} from "../rummikub/orderTiles";


test('order by color, val simple case', () => {
    const input = [
        buildTileObj(1, COLOR.red, 0),
        buildTileObj(3, COLOR.red, 1),
        buildTileObj(2, COLOR.red, 0),
    ];
    const expected = [
        buildTileObj(1, COLOR.red, 0),
        buildTileObj(2, COLOR.red, 0),
        buildTileObj(3, COLOR.red, 1),
    ];
    expect(orderByFunc(input, compareTilesByColorVal)).toEqual(expected);
});


test('order by color, val two colors case', () => {
    const input = [
        buildTileObj(2, COLOR.red, 1),
        buildTileObj(1, COLOR.red, 0),
        buildTileObj(7, COLOR.red, 1),
        buildTileObj(4, COLOR.red, 0),
        buildTileObj(5, COLOR.red, 1),
        buildTileObj(4, COLOR.red, 1),
        buildTileObj(6, COLOR.red, 1),
        buildTileObj(2, COLOR.blue, 0),
        buildTileObj(8, COLOR.red, 0),
        buildTileObj(3, COLOR.red, 0),
        buildTileObj(1, COLOR.blue, 0),
        buildTileObj(3, COLOR.blue, 1),
    ];
    const expected = [
        buildTileObj(1, COLOR.red, 0),
        buildTileObj(2, COLOR.red, 1),
        buildTileObj(3, COLOR.red, 0),
        buildTileObj(4, COLOR.red, 0),
        buildTileObj(5, COLOR.red, 1),
        buildTileObj(6, COLOR.red, 1),
        buildTileObj(7, COLOR.red, 1),
        buildTileObj(8, COLOR.red, 0),
        buildTileObj(1, COLOR.blue, 0),
        buildTileObj(2, COLOR.blue, 0),
        buildTileObj(3, COLOR.blue, 1),
        buildTileObj(4, COLOR.red, 1),
    ];
    expect(orderByFunc(input, compareTilesByColorVal)).toEqual(expected);
});


test('order by val, color simple case', () => {
    const input = [
        buildTileObj(1, COLOR.red, 0),
        buildTileObj(1, COLOR.red, 1),
        buildTileObj(1, COLOR.blue, 0),
        buildTileObj(1, COLOR.orange, 0),
    ];
    const expected = [
        buildTileObj(1, COLOR.red, 0),
        buildTileObj(1, COLOR.blue, 0),
        buildTileObj(1, COLOR.orange, 0),
        buildTileObj(1, COLOR.red, 1),
    ];
    expect(orderByFunc(input, compareTilesByValColor)).toEqual(expected);
});
