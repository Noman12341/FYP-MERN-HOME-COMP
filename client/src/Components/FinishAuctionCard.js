import React from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function FinishedAuctionCard(props) {

    const { pID, pName, pPrice, pImg } = props;

    return <Card style={{ position: "relative" }}>
        <Card.Img variant="top" src={"/static/images/" + pImg} height="270" />
        <div className="card-bandage">
            Final Price
            <div className="final-value">{pPrice}</div>
        </div>
        <Card.Body className="p-0 mt-2">
            <h5 className="card-product-name"><Link to={"/" + pID}>{pName}</Link></h5>
        </Card.Body>
    </Card>;
}
export default FinishedAuctionCard;