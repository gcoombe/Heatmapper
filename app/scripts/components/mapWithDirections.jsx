import React from 'react';

class MapWithDirections extends React.Component {

    setMapBounds(bounds) {
        console.log("NW bound", bounds.getNorthWest().lat, bounds.getNorthWest().lng);
        console.log("NE bound", bounds.getNorthEast().lat, bounds.getNorthEast().lng);
        console.log("SE bound", bounds.getSouthEast().lat, bounds.getSouthEast().lng);
        console.log("SW bound", bounds.getSouthWest().lat, bounds.getSouthWest().lng);
    }

    render() {
        return (
            <div>
                <Map updateBounds={this.setMapBounds}/>
            </div>
        )
    }
}

export default MapWithDirections;