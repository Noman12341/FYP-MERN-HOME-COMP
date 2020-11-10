import React from 'react';
import { Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import CartItem from './CartItem';

function Cart() {
    const history = useHistory();
    const reduxCart = useSelector(state => state.MyCart);


    return <div className="cart-dropdown-content">
        <div className="d-flex cart-info">
            <div style={{ flex: "1" }}><p>Items: {reduxCart.totalItems}</p></div>
            <div><p>Total: Rs. {reduxCart.totalAmount}</p></div>
        </div>
        <hr></hr>
        <div id="cart-items-container">
            {reduxCart.cartItems.map((item, index) => {
                return <CartItem key={index} id={item.ID} name={item.name} image={item.image} price={item.price} quantity={item.units} totalItemPrice={item.total} isMyProduct={item.isMyProduct} />
            })}
        </div>
        {/* <ul className="items-list">
            {products.map(product => {
                return <li className="mb-4" key={product._id}>
                    <img src={"/static/images/" + product.image} height="70px" width="70px" alt="product img" />
                    <span className="d-block cart-product-name">{product.name} <Button bsPrefix="item-delete-btn" type="button" onClick={() => dispatch(removeItemCart(product._id))}>x</Button></span>
                    <span className="item-price">{product.price}</span>
                    <span className="items-quantity">Quanityx1</span>
                </li>
            })}
        </ul> */}
        {/* go to Check out button */}
        <Button onClick={() => history.push("/checkout")} bsPrefix="card-buy-btn">Move to check out</Button>
    </div>
}
export default Cart;