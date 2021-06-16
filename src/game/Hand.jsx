import React from 'react';
import GridContainer from "./GridContainer";
import {HAND_COLS, HAND_ROWS} from "./Game";

const Hand = function ({G, ctx}) {
    let state = {
        tilesPositions: {},
        hand: G.hands[ctx.currentPlayer],
    }

    return <GridContainer rows={HAND_ROWS} cols={HAND_COLS} tiles2dArray={hand}></GridContainer>

}

export default Hand