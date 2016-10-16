import MapWithDirections from './mapWithDirections';
import Hello from './hello';
import React from 'react';

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
