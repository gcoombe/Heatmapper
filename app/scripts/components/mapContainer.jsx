import React from 'react';
import Map from './map';
import 'whatwg-fetch';

class MapContainer extends React.Component {
    constructor() {
        super();
        this.state = {
            bounds: null,
            path: null,
            nodes: null
        }
        this.updateBounds = this.updateBounds.bind(this);
    }

    updateBounds(bounds) {
        let that = this;

        const boundPoints = {
            NW: bounds.getNorthWest(),
            NE: bounds.getNorthEast(),
            SW: bounds.getSouthWest(),
            SE: bounds.getSouthEast()
        };
        return fetch('/a/1/path', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bounds)
        }).then(function (response) {
            if (response.ok) {
                return response.json()
            }
        }).then(function (json) {
            if (json) {
                if (json.status === "ok") {
                    that.setState({
                        bounds: boundPoints,
                        path: json.path,
                        nodes: json.nodes
                    });
                } else {
                    that.setState({
                        bounds: boundPoints,
                        path: null,
                        nodes: json.nodes
                    });
                }
            } else {
                that.setState({
                    bounds: boundPoints,
                    path: null
                });
            }
        })
    }

    render() {
        return (
            <Map updateBounds={this.updateBounds} bounds={this.state.bounds} path={this.state.path} nodes={this.state.nodes} />
        );
    }
}

export default MapContainer