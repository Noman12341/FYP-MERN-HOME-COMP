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
        {reduxCart.cartItems.length === 0 ? <h4>Your Cart is currently empty</h4> : <div>
            <div id="cart-items-container">
                {reduxCart.cartItems.map((item, index) => {
                    return <CartItem key={index} id={item.ID} name={item.name} image={item.image} price={item.price} quantity={item.units} totalItemPrice={item.total} isMyProduct={item.isMyProduct} size={item.size || null} catagory={item.catagory} />
                })}
            </div>
            {/* go to Check out button */}
            <Button onClick={() => history.push("/checkout")} bsPrefix="card-buy-btn">Move to check out</Button>
        </div>}
    </div>
}
export default Cart;