import React from "react";
import styled from 'styled-components'
import GridTile from "./GridTile";

export class GridContainer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let tiles2dArray = this.props.tiles2dArray
        let rows = this.props.rows
        let cols = this.props.cols
        let gridId = this.props.gridId
        let colWidth = 2.2
        let Grid = styled.div`
            display: grid;
            grid-template-columns: repeat(${cols}, ${colWidth}vw);
            grid-template-rows: repeat(${rows}, 7vh);
            grid-column-gap: 0.05vw;
            grid-row-gap: 2px;
            margin-top: 2vh;
        `
        let Centered = styled.div`
            width: ${cols * colWidth + (cols - 1) * 0.05}vw;
            margin: 0 auto;
        `

        let gridItems = []
        let key = 0
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {

                let tile = tiles2dArray[y] && tiles2dArray[y][x]
                let gridTile = <GridTile moves={this.props.moves}
                                         onTileDragEnd={this.props.onTileDragEnd}
                                         selectedTiles={this.props.selectedTiles}
                                         handleTileSelection={this.props.handleTileSelection}
                                         handleLongPress={this.props.handleLongPress}
                                         onLongPressMouseUp={this.props.onLongPressMouseUp}
                                         ctx={this.props.ctx}
                                         playerID={this.props.playerID}
                                         gridId={gridId}
                                         row={y} col={x}
                                         key={key} tile={tile}/>
                gridItems.push(gridTile)
                key++
            }
        }
        return (
            <Centered>
                <Grid>
                    {gridItems}
                </Grid>
            </Centered>
        )
    }
}

export default GridContainer