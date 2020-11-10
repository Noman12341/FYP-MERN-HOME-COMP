import React from 'react';

function Stars({ rating }) {


    return <ul>
        <li><span style={{ color: 'black', marginLeft: "1%" }}>{rating}</span></li>
        <li><i className="fas fa-star"></i></li>
    </ul>
}
export default Stars;