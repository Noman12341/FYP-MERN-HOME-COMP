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
    // function for adding item in cart
    const addItemIncart = () => {
        const newPro = { ...product, size: "M", catagory: "Men" };
        dispatch(AddItemInCart(newPro));
    }
    return <Card>
        <Link to="#" onClick={handleClick}>
            <Card.Img variant="top" src={product.image} height="320" />
        </Link>
        <Card.Body className="p-0 pt-2">
            <div>
                <div className="modern-price-value">{product.price}</div>
                <h5 className="card-product-name"><Link to={"/product-details/" + product._id}>{product.name}</Link></h5>
            </div>
            <Button bsPrefix="card-buy-btn" type="button" onClick={addItemIncart}>Add to Card</Button>
        </Card.Body>
    </Card>
}
export default ScrapPCard;