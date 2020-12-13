import React from 'react';
import Stars from './ListStars';

function Comment({ userName, time, msg, rating }) {
    return <div className="comment-boxes">
        <div className="d-flex m-3">
            <div style={{ flex: "5" }}>
                <div><span className="comment-user"><i className="mr-2 fas fa-user"></i>{userName}</span><span className="comment-time"><i className="mr-2 fas fa-clock"></i>{time}</span></div>
                <p className="my-2">{msg}</p>
            </div>
            <div className="rating-product-stars" style={{ flex: "1" }}>
                <Stars rating={rating} />
            </div>
        </div>
    </div>;
}
export default Comment;