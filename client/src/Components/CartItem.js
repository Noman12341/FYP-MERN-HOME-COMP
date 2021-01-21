import React from 'react';
import { Image, Button } from 'react-bootstrap';
import { RemoveItemFromCart } from '../Actions/MyCartActions';
import { useDispatch } from 'react-redux';

function CartItem({ id, name, image, quantity, price, totalItemPrice, isMyProduct, catagory, size }) {
    const dispatch = useDispatch();
    return <div className="d-flex mb-3" id="main-cart">
        <div>
            <Image src={isMyProduct ? "/static/images/" + image : image} alt="" height="70px" width="70px" />
        </div>
        <div className="px-3">
            <p>{name}</p>
            <Button bsPrefix="cart-remove-btn" onClick={() => dispatch(RemoveItemFromCart(id))}>remove</Button>
        </div>
        <div>
            <p>{quantity} x Rs.{price}</p>
            <div>{catagory === "Men" || catagory === "Women" ? <span className="cart-size">Size : {size}</span> : null}</div>
        </div>
        <div className="ml-3">
            <p className="cart-total">Rs. {totalItemPrice}</p>
        </div>
    </div>
}
export default CartItem;