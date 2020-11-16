import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Form, Col, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { applyDiscount } from '../Actions/MyCartActions';

function OrderSummary() {

    const myCart = useSelector(state => state.MyCart);
    const [code, setCode] = useState(null);
    const [alert, setAlert] = useState("");
    const dispatch = useDispatch();
    const handleSubmit = async event => {
        event.preventDefault();
        await axios.post("/api/payment/check-discount", { code })
            .then(res => {
                console.log(res.data);
                dispatch(applyDiscount(res.data.obj.disPrice));
                setCode(null);
            }).catch(error => {
                console.log(error);
                setAlert(error.response.data.msg);
            });
    }
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
        {alert && <Alert className="mx-4" variant='danger' onClose={() => setAlert("")} dismissible>{alert}</Alert>}
        <Form className="mt-3" onSubmit={handleSubmit}>
            <Form.Row className="mx-0">
                <Col lg={8}>
                    <Form.Control value={code || ""} onChange={e => setCode(e.target.value)} placeholder="Coupon code" />
                </Col>
                <Col lg={3}>
                    <Button type="submit">Submit</Button>
                </Col>
            </Form.Row>
        </Form>

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