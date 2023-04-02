import {countSeqScore, RedJoker, BlackJoker, buildTileObj, getTileValue, setTileValue, getTileColor, setTileColor} from "../rummikub/util";
import {COLOR} from "../rummikub/constants";

test('test build tile simple', () => {
    let tile1 = buildTileObj(1, COLOR.red, 0);
    let tile2 = buildTileObj(5, COLOR.red, 0);
    let tile3 = buildTileObj(13, COLOR.red, 0);
    expect(getTileValue(tile1)).toEqual(1);
    expect(getTileValue(tile2)).toEqual(5);
    expect(getTileValue(tile3)).toEqual(13);

    expect(getTileColor(tile1)).toEqual(COLOR.red);
    expect(getTileColor(tile2)).toEqual(COLOR.red);
    expect(getTileColor(tile3)).toEqual(COLOR.red);
});

test('test build tile joker', () => {
    expect(getTileValue(RedJoker)).toEqual(0);
    expect(getTileValue(BlackJoker)).toEqual(0);
});

test('test set tile value', () => {
    let tile = buildTileObj(1, COLOR.red, 0);
    let tileMod = setTileValue(tile, 5)
    expect(getTileValue(tile)).toEqual(1);
    expect(getTileValue(tileMod)).toEqual(5);
    expect(getTileColor(tileMod)).toEqual(COLOR.red);
});

test('test set tile color', () => {
    let tile = buildTileObj(1, COLOR.red, 0);
    let tileMod = setTileColor(tile, COLOR.black)
    expect(getTileColor(tile)).toEqual(COLOR.red);
    expect(getTileColor(tileMod)).toEqual(COLOR.black);
    expect(getTileValue(tileMod)).toEqual(1);
});