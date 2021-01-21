import React from 'react';
import { Card, Button } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { AddItemInCart } from '../Actions/MyCartActions';
import { Link } from 'react-router-dom';

function ProductCard(props) {
    const { product } = props;
    const dispatch = useDispatch();
    const handleClick = () => {
        let newPro = {};
        product.catagory === "Men" || product.catagory === "Women" ? newPro = { ...product, size: "M" } : newPro = product;
        dispatch(AddItemInCart(newPro));
    }
    return <Card>
        <Link to={"/product-details/" + product._id}>
            <Card.Img variant="top" src={product.isMyProduct ? "/static/images/" + product.image : product.image} height="320" />
        </Link>
        <Card.Body className="p-0 pt-2">
            <div>
                <div className="modern-price-value">{product.price}</div>
                <h5 className="card-product-name"><Link to={"/product-details/" + product._id}>{product.name}</Link></h5>
            </div>
            <Button bsPrefix="card-buy-btn" type="button" onClick={handleClick}>Add to Cart</Button>
        </Card.Body>
    </Card>
}
export default ProductCard;