import React from 'react';
import Leaflet from 'leaflet';

class Map extends React.Component {
    constructor(props) {
        super(props);
        this.mapId = "map";
        this.leafletElement = null;
    }

    componentDidMount() {
        this.leafletElement = Leaflet.map(this.mapId).setView([this.props.lat, this.props.long], 12);
    }

    render() {
        return (
            <div id={this.mapId}></div>
        );
    }
}

Map.defaultProps = {
    lat: 49.2573,
    long: -123.1241
}

export default Map;
