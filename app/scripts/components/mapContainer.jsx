import React from 'react';
import Map from './map';
import 'whatwg-fetch';

class MapContainer extends React.Component {
    constructor() {
        super();
        this.state = {
            bounds: null,
            path: null
        }
        this.updateBounds = this.updateBounds.bind(this);
    }

    updateBounds(bounds) {
        let that = this;

        fetch('/a/1/path', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                NW: bounds.getNorthWest(),
                NE: bounds.getNorthEast(),
                SW: bounds.getSouthWest(),
                SE: bounds.getSouthEast()
            })
        }).then(function (response) {
            if (response.ok) {
                return response.json()
            }
        }).then(function (json) {
            if (json) {
                that.setState({
                    bounds: bounds,
                    path: json.result
                });
            } else {
                that.setState({
                    bounds: bounds,
                    path: null
                });
            }
        })
    }

    render() {
        return (
            <Map updateBounds={this.updateBounds} bounds={this.state.bounds} path={this.state.path} />
        );
    }
}

export default MapContainer