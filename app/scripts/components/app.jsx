import React from 'react';
import Hello from './hello';
import MapWithDirections from './mapWithDirections';

class App extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <Hello/>
                <MapWithDirections />
            </div>
        );
    }
}

export default App;
