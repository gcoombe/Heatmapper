/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "Leaflet*" }]*/

import React from 'react';
import Leaflet from 'leaflet';
import LeafletDraw from 'leaflet-draw';
// import LeafletRouting from 'leaflet-routing-machine'
import LeafletRouter from './leafletRouter'

class Map extends React.Component {
    constructor(props) {
        super(props);
        this.leafletElement = null;
        this.mapId = "map";
    }

    componentDidMount() {
        const osmUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
            osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            osm = Leaflet.tileLayer(osmUrl, {
                maxZoom: 18,
                attribution: osmAttrib
            });
        this.leafletElement = Leaflet.map(document.getElementById(this.mapId)).setView([this.props.lat, this.props.lng], 13).addLayer(osm);

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

    componentDidUpdate() {
        if (this.props.path) {
            let waypoints = this.props.path.map(coord => {
                return Leaflet.latLng(coord.lat, coord.lng)
            });
            Leaflet.Routing.control({
                waypoints: waypoints,
                router: Leaflet.Routing.osrmMatch({})
            }).addTo(this.leafletElement);
        }
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
    lng: React.PropTypes.number,
    path: React.PropTypes.array
}

Map.defaultProps = {
    lat: 49.2573,
    lng: -123.1241
}

export default Map;
