/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "Leaflet*" }]*/

import React from 'react';
import ReactDOM from 'react-dom'
import Leaflet from 'leaflet';
import LeafletDraw from 'leaflet-draw';
// import LeafletRouting from 'leaflet-routing-machine'
import LeafletRouter from './leafletRouter';
import _ from 'lodash';

class Map extends React.Component {
    constructor(props) {
        super(props);
        this.leafletElement = null;
        this.mapId = "map";
    }

    componentDidMount() {
        this.leafletElement = Leaflet.map(ReactDOM.findDOMNode(this)).setView([this.props.lat, this.props.lng], 13)

        L.tileLayer('https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18,
            accessToken: CONFIG.mapboxKey
        }).addTo(this.leafletElement);

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

        this.markerGroup = Leaflet.layerGroup()
            .addTo(this.leafletElement);

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
            this.markerGroup.clearLayers();
        });
    }

    componentDidUpdate() {
        if (this.props.path) {
            let waypoints = this.props.path.map(coord => {
                return Leaflet.latLng(coord.lat, coord.lng)
            });
            if (waypoints.length > 25) {
                console.warn("Only showing path for 1st 25 coordinates")
            }
            Leaflet.Routing.control({
                waypoints: _.slice(waypoints, 0, 25),
                router: Leaflet.Routing.mapbox(CONFIG.mapboxKey)
            }).addTo(this.leafletElement);
            if (CONFIG.debug) {
                for (let i = 0; i < this.props.path.length - 1; i++) {
                    const edgeLatLngs = [
                        [this.props.path[i].lat, this.props.path[i].lng],
                        [this.props.path[i + 1].lat, this.props.path[i + 1].lng]
                    ];
                    const line = Leaflet.polyline(edgeLatLngs, {color: '#009933'}).addTo(this.leafletElement);
                    // this.leafletElement.fitBounds(line.getBounds());
                }
            }
        } else {
            this.props.nodes.forEach((node) => {
                const marker = Leaflet.marker([node.lat, node.lng]);
                this.markerGroup.addLayer(marker);
            });
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
    lng: -123.1241,
    updateBounds: () => {}
}

export default Map;
