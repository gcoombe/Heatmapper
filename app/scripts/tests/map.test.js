//I can't get enzyme.mount to work so using react test utils.
// import TestUtils from 'react-addons-test-utils';
import Map from '../components/map';
import {mount} from 'enzyme';
import React from 'react';
import jsdom from "jsdom";
import Leaflet from "leaflet";

describe("map", () => {

    beforeAll(() => {
        //Stub getSize since it relies on a browser size which jsdom doesn't provide
        Leaflet.Map.prototype.getSize = jest.fn(() => {
            return new Leaflet.Point(0,0);
        });
    });

    it("Show leaflet map", () => {
        const wrapper = mount(<div><Map updateBounds={() => {}}/></div>);
        expect(wrapper.find(".leaflet-container").length).toBe(1);
    });

    it("Sets nodes if no path", () => {
        const wrapper = mount(<Map updateBounds={() => {}} />);
        wrapper.setProps({path: null, nodes: [{lat: 49.256, lng: -123.098}, {lat: 49.258, lng: -123.101}]});
        console.log(wrapper.find(".leaflet-marker-icon"));
        expect(wrapper.find(".leaflet-marker-icon").length).toBe(2);
    });
});