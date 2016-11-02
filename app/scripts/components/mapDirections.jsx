import React from 'react';

const MapDirections = (props) => {
    const directionRows = props.directions.map((direction, i) => {
        return <li key={i}>{direction}</li>;
    });

    return (
        <div className="map-directions">
            <h3>Heatmap directions</h3>
            <ul>{directionRows}</ul>
        </div>
    );
};

MapDirections.propTypes = {
    directions: React.PropTypes.array
};

MapDirections.defaultProps = {
    directions: []
};

export default MapDirections;