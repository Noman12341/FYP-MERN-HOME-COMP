import React from 'react';
import { Link } from 'react-router-dom';

function BrandsDropDown() {
    return <ul className="brands-drop-down">
        <li><Link to="/product-brands/Almirah">Almirah</Link></li>
        <li><Link to="/product-brands/Sana Safinaz">Sana Safinaz</Link></li>
        <li><Link to="/product-brands/Gul Ahmed">Gul Ahmed</Link></li>
        <li><Link to="/product-brands/Diners">Diners</Link></li>
    </ul>;
}
export default BrandsDropDown;