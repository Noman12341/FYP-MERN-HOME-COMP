import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { AddItemInCart } from '../Actions/MyCartActions';
import { Link, useHistory } from 'react-router-dom';
import { getScrapPLink, storeProductID } from '../Actions/MyScrapedProducts';

function ScrapPCard({ product }) {
    const dispatch = useDispatch();
    const history = useHistory();
    let handleClick = () => {
        dispatch(getScrapPLink(product.detailPage));
        dispatch(storeProductID(product._id));
        history.push("/scrap-product-detail");
    }
    return <Card>
        <Link to="#" onClick={handleClick}>
            <Card.Img variant="top" src={product.image} width="200" height="217" />
        </Link>
        <Card.Body className="p-0 pt-2">
            <div>
                <div className="modern-price-value">{product.price}</div>
                <h5 className="card-product-name"><Link to={"/product-details/" + product._id}>{product.name}</Link></h5>
            </div>
            <Button bsPrefix="card-buy-btn" type="button" onClick={() => dispatch(AddItemInCart(product))}>Add to Card</Button>
        </Card.Body>
    </Card>
}
export default ScrapPCard;