import React from 'react';
import MapWithDirections from './mapWithDirections';

class App extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="body">
                <MapWithDirections />
            </div>
        );
    }
}

export default App;
