import React from 'react';
import Leaflet from 'leaflet';
import ReactDOM from 'react-dom';

class Map extends React.Component {
    constructor(props) {
        super(props);
        this.leafletElement = null;
    }

    componentDidMount() {
        var osmUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
            osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            osm = L.tileLayer(osmUrl, {
                maxZoom: 18,
                attribution: osmAttrib
            });
        this.leafletElement = Leaflet.map(ReactDOM.findDOMNode(this)).setView([this.props.lat, this.props.long], 13).addLayer(osm);
    }

    render() {
        return (
            <div className="map" id={this.mapId}></div>
        );
    }
}

Map.defaultProps = {
    lat: 49.2573,
    long: -123.1241
}

export default Map;
