/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "Leaflet*" }]*/

import Leaflet from 'leaflet'
import LeafletRouting from 'leaflet-routing-machine'
import _ from 'lodash'

Leaflet.Routing.OSRMMatch = Leaflet.Routing.Mapbox.extend({
    options: {
            serviceUrl: 'https://api.mapbox.com/matching/v4',
            profile: 'mapbox.walking',
            useHints: false
        },


    buildRouteUrl: function(waypoints, options) {
        var locs = [],
            hints = [],
            wp,
            latLng,
            computeInstructions;

        for (var i = 0; i < waypoints.length; i++) {
            wp = waypoints[i];
            latLng = wp.latLng;
            locs.push(latLng.lng + ',' + latLng.lat);
            hints.push(this._hints.locations[this._locationKey(latLng)] || '');
        }

        computeInstructions =
            !(options && options.geometryOnly);

        return this.options.serviceUrl + '/' + this.options.profile + '/' +
            locs.join(';') + '?' +
            (options.geometryOnly ? (options.simplifyGeometry ? '' : 'overview=full') : 'overview=false') +
            '&steps=' + computeInstructions.toString();
    },

    _routeDone: function (response, inputWaypoints, options, callback, context) {
        response.waypoints = response.tracepoints;
        let bestRoute = response.matchings && response.matchings.length ?_.max(response.matchings, function (route) {
            return route.confidence;
        }) : null;
        response.routes = bestRoute ? [bestRoute] : [];
        return Leaflet.Routing.OSRMv1.prototype._routeDone.call(this, response, inputWaypoints, options, callback, context);
    }
});

Leaflet.Routing.osrmMatch = function(accessToken) {
    return new Leaflet.Routing.OSRMMatch(accessToken);
};

export default Leaflet.Routing