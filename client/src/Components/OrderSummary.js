import React from 'react';
import { useSelector } from 'react-redux';

function OrderSummary() {

    const myCart = useSelector(state => state.MyCart);

    return <div id="summary" className="cart-summary">
        <div className="header">
            <h1>Order Summary</h1>
        </div>
        <div style={{ height: "300px", overflowY: "scroll" }}>
            {myCart.cartItems.map(item => {
                return <div key={item.ID} id="order-items">
                    <div className="line-item">
                        <img className="image" src={item.isMyProduct ? "/static/images/" + item.image : item.image} alt="" />
                        <div className="label">
                            <p className="product">{item.name}</p>
                            {/* <p className="sku">Collector Set</p> */}
                        </div>
                        <p className="count">{item.units} x Rs. {item.price}</p>
                        <p className="price">Rs.  {item.total}</p>
                    </div>
                </div>
            })}
        </div>
        {/* subtotal price in cart */}
        <div id="order-total">
            <div className="line-item subtotal">
                <p className="label">Subtotal</p>
                <p className="price" data-subtotal="">Rs. {myCart.totalAmount}</p>
            </div>
            <div className="line-item shipping">
                <p className="label">Shipping</p>
                <p className="price">Free</p>
            </div>
        </div>
        {/* total price div */}
        <div className="line-item total">
            <p className="label">Total</p>
            <p className="price" data-total="">Rs. {myCart.totalAmount}</p>
        </div>
    </div>
}
export default OrderSummary;