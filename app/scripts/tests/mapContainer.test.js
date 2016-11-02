import {shallow} from 'enzyme';
import MapContainer from '../components/mapContainer';
import MapDirections from '../components/mapDirections';
import Map from '../components/map';
import 'whatwg-fetch';
import Promise from 'bluebird';
import React from 'react';
import Leaflet from 'leaflet';

describe('updateBounds', () => {

    let apiReturn;
    beforeAll(() => {
        apiReturn = null;
        Leaflet.Map.prototype.getSize = jest.fn(() => {
            return new Leaflet.Point(0,0);
        });
    });

    window.fetch = jest.fn().mockImplementation(() => {
        return Promise.resolve(apiReturn);
    });

    const stubApiReturn = (returnObj) => apiReturn = {
        ok: true,
        json: () => returnObj
    };

    it("Sets state with path on success", () => {
        const successResponse = {
            result: {
                status: 'ok',
                nodes: [{lat: 49.256, lng: -123.098}, {lat: 49.258, lng: -123.101}],
                path: [{lat: 49.256, lng: -123.098}, {lat: 49.258, lng: -123.101}]
            }
        };
        stubApiReturn(successResponse);
        const wrapper = shallow(<MapContainer />);
        return wrapper.instance().updateBounds(Leaflet.latLngBounds(Leaflet.latLng(49.256, -123.0983), Leaflet.latLng(49.259336, -123.094919))).then(() => {
            expect(wrapper.state().path).toEqual(successResponse.result.path);
            expect(wrapper.state().bounds).toEqual({
                SW: {lat: 49.256, lng: -123.0983},
                NE: {lat: 49.259336, lng: -123.094919},
                NW: {lat: 49.259336, lng: -123.0983},
                SE: {lat: 49.256, lng: -123.094919}
            });
            expect(wrapper.state().nodes).toEqual(successResponse.result.nodes);
        });
    });

    it("Sets state without path on fail", () => {
        const failResponse = {
            result: {
                status: 'fail',
                nodes: [{lat: 49.256, lng: -123.098}, {lat: 49.258, lng: -123.101}]
            }
        };
        stubApiReturn(failResponse);
        const wrapper = shallow(<MapContainer />);
        return wrapper.instance().updateBounds(Leaflet.latLngBounds(Leaflet.latLng(49.256, -123.0983), Leaflet.latLng(49.259336, -123.094919))).then(() => {
            expect(wrapper.state().path).toBeFalsy();
            expect(wrapper.state().bounds).toEqual({
                SW: {lat: 49.256, lng: -123.0983},
                NE: {lat: 49.259336, lng: -123.094919},
                NW: {lat: 49.259336, lng: -123.0983},
                SE: {lat: 49.256, lng: -123.094919}
            });
            expect(wrapper.state().nodes).toEqual(failResponse.result.nodes);
        });
    });

    it("Renders directions if present", () => {
        const successResponse = {
            result: {
                status: 'ok',
                nodes: [{lat: 49.256, lng: -123.098}, {lat: 49.258, lng: -123.101}],
                path: [{lat: 49.256, lng: -123.098}, {lat: 49.258, lng: -123.101}],
                directions: ["Main st (Park st - Poplar st)"]
            }
        };
        stubApiReturn(successResponse);
        const wrapper = shallow(<MapContainer/>);

        return wrapper.instance().updateBounds(Leaflet.latLngBounds(Leaflet.latLng(49.256, -123.0983), Leaflet.latLng(49.259336, -123.094919))).then(() => {
            wrapper.update();
            expect(wrapper.containsMatchingElement(<MapDirections directions={successResponse.result.directions}/>)).toEqual(true);
        });
    });

     it("Does not render directions if present", () => {
        const successResponse = {
            result: {
                status: 'ok',
                nodes: [{lat: 49.256, lng: -123.098}, {lat: 49.258, lng: -123.101}],
                path: [{lat: 49.256, lng: -123.098}, {lat: 49.258, lng: -123.101}],
                directions: null
            }
        };
        stubApiReturn(successResponse);
        const wrapper = shallow(<MapContainer/>);
        return wrapper.instance().updateBounds(Leaflet.latLngBounds(Leaflet.latLng(49.256, -123.0983), Leaflet.latLng(49.259336, -123.094919))).then(() => {
            wrapper.update();
            expect(wrapper.containsMatchingElement(<MapDirections/>)).toEqual(false);
        });
    });
});
