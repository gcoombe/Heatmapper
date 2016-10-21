import React from 'react';
import MapContainer from './mapContainer';

class App extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="body">
                <MapContainer />
            </div>
        );
    }
}

export default App;
