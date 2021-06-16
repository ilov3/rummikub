import React from 'react';
import {Tile} from './Tile'

export class TileSeq extends React.Component {
    render() {
        let tileSeq = this.props.tileSeq.map((tile) => {
            return <Tile key={tile.id} tile={tile}/>
        })
        return tileSeq
    }
}

export default TileSeq