/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "Leaflet*" }]*/

import React from 'react';
import Leaflet from 'leaflet';
import LeafletDraw from 'leaflet-draw';
import LeafletRouting from 'leaflet-routing-machine'
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
        this.leafletElement = Leaflet.map(document.getElementById(this.mapId)).setView([this.props.lat, this.props.long], 13).addLayer(osm);

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

        //Test by going around the block
        Leaflet.Routing.control({
            waypoints: [
                Leaflet.latLng(49.275868, -123.124258),
                Leaflet.latLng(49.275238, -123.123292),
                Leaflet.latLng(49.274195, -123.124858),
                Leaflet.latLng(49.274846, -123.125813)
            ],
            router: Leaflet.Routing.osrmMatch({})
        }).addTo(this.leafletElement);
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
