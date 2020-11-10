import React from 'react';

function StarRating({ count, value,
    inactiveColor = '#ddd',
    size = 24,
    activeColor = '#f00', onChange }) {

    // short trick 
    const stars = Array.from({ length: count }, () => '🟊')

    // Internal handle change function
    const handleChange = (value) => {
        onChange(value + 1);
    }

    return (
        <div>
            {stars.map((s, index) => {
                let style = inactiveColor;
                if (index < value) {
                    style = activeColor;
                }
                return (
                    <span className={"star"}
                        key={index}
                        style={{ color: style, width: size, height: size, fontSize: size }}
                        onClick={() => handleChange(index)}>{s}</span>
                )
            })}
            {value}
        </div>
    )
}

export default StarRating;