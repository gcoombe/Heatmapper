import Map from './map';
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
                <Map/>
            </div>
        );
    }
}

export default App;
