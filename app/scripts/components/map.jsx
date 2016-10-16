import React from 'react';
import Leaflet from 'leaflet';
import ReactDOM from 'react-dom';

class Map extends React.Component {
    constructor(props) {
        super(props);
        this.leafletElement = null;
    }

    componentDidMount() {
        const osmUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
            osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            osm = Leaflet.tileLayer(osmUrl, {
                maxZoom: 18,
                attribution: osmAttrib
            });
        this.leafletElement = Leaflet.map(ReactDOM.findDOMNode(this)).setView([this.props.lat, this.props.long], 13).addLayer(osm);

        // Initialise the FeatureGroup to store editable layers
        const drawnItems = new Leaflet.FeatureGroup();
        this.leafletElement.addLayer(drawnItems);

        // Initialise the draw control and pass it the FeatureGroup of editable layers
        const drawControl = new Leaflet.Control.Draw({
            draw: {
                polyline: false,
                polygon: false,
                circle: false,
                marker: false
            },
            edit: {
                featureGroup: drawnItems,
                edit: false
            }
        });
        this.leafletElement.addControl(drawControl);

        let that = this;
        this.leafletElement.on("draw:created", (elm) => {
            const bounds = elm.layer.getBounds();
            drawnItems.addLayer(elm.layer);
            that.props.updateBounds(bounds);
        });
        this.leafletElement.on("draw:drawstart", () => {
            //Remove previously drawn rectangles
            drawnItems.getLayers().forEach(layer => {
                this.leafletElement.removeLayer(layer);
            });

        });
    }

    componentWillUnmount() {
        this.leafletElement.off("draw:created");
        this.leafletElement.off("draw:drawstart");
        this.leafletElement = null;
    }

    render() {
        return (
            <div className="map" id={this.mapId}></div>
        );
    }
}

Map.propTypes = {
    updateBounds: React.PropTypes.func.isRequired,
    lat: React.PropTypes.number,
    long: React.PropTypes.number
}

Map.defaultProps = {
    lat: 49.2573,
    long: -123.1241
}

export default Map;
