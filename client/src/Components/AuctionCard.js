import React from 'react';
import { Card, Button, Image } from 'react-bootstrap';
import CountDown from './CountDown';
import { Link } from 'react-router-dom';

function AuctionCard(props) {
    const { _id, name, image, initialPrice, currentPrice, auctionEndingDate } = props.auctionProduct;
    return <Card>
        <CountDown countDown={auctionEndingDate} pID={_id} />
        <Link to={"/product-auction-detail/" + _id}>
            {image && <Image className="card-img-top" src={"/static/images/" + image} height="290" />}
        </Link>
        <Card.Body className="p-0 pt-2">
            <div>
                <div className="auction-initial-price">Pkr:{initialPrice}</div>
                <div className="modern-price-value">{currentPrice}</div>
                <h5 className="card-product-name"><Link to={"/product-auction-detail/" + _id}>{name}</Link></h5>
            </div>
            <Link to={"/product-auction-detail/" + _id}><Button bsPrefix="card-buy-btn">Submit a bid</Button></Link>
        </Card.Body>
    </Card>
}
export default AuctionCard;