import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Form, Spinner } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import Axios from 'axios';
import { FetchOrderDetails, SaveCustomerInfo } from '../Actions/OrderActions';
import { ClearCart } from '../Actions/MyCartActions';
import { useDispatch, useSelector } from 'react-redux';
import QRCodeViewer from './QRCodeViewer';
const CARD_OPTIONS = {
    style: {
        base: {
            color: '#32325d',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
                color: '#aab7c4'
            }
        },
        invalid: {
            color: '#fa755a',
            iconColor: '#fa755a'
        }
    }
};

const MyCheckoutForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false);
    const [billingData, setBillingData] = useState({
        name: "",
        email: "",
        phone: "",
        address: {
            city: "",
            country: "PK",
            line1: ""
        }
    });
    const dispatch = useDispatch();
    const totalAmount = useSelector(state => state.MyCart.totalAmount);
    const cartItems = useSelector(state => state.MyCart.cartItems);
    function handleChange(e) {
        const { name, value } = e.target;
        setBillingData(preValue => {
            if (name === "name") {
                return {
                    name: value,
                    email: preValue.email,
                    phone: preValue.phone,
                    address: { ...preValue.address }
                }
            } else if (name === "email") {
                return {
                    name: preValue.name,
                    email: value,
                    phone: preValue.phone,
                    address: { ...preValue.address }
                }
            } else if (name === "phone") {
                return {
                    name: preValue.name,
                    email: preValue.email,
                    phone: value,
                    address: { ...preValue.address }
                }
            } else if (name === "line1") {
                return {
                    name: preValue.name,
                    email: preValue.email,
                    phone: preValue.phone,
                    address: { ...preValue.address, line1: value }
                }
            } else if (name === "city") {
                return {
                    name: preValue.name,
                    email: preValue.email,
                    phone: preValue.phone,
                    address: { ...preValue.address, city: value }
                }
            } else if (name === "country") {
                return {
                    name: preValue.name,
                    email: preValue.email,
                    phone: preValue.phone,
                    address: { ...preValue.address, country: value }
                }
            }
        });
    }
    // Cash on Deliver fucntion Below
    const handleCashOnDelivery = () => {
        dispatch(SaveCustomerInfo(billingData));
        history.push("/verify-number");
    }

    const handleSubmit = async (event) => {
        // Block native form submission.
        event.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not loaded yet. Make sure to disable
            // form submission until Stripe.js has loaded.
            return;
        }

        // Get a reference to a mounted CardElement. Elements knows how
        // to find your CardElement because there can only ever be one of
        // each type of element.
        const cardElement = elements.getElement(CardElement);
        setIsLoading(true);
        // Use your card Element with other Stripe.js APIs
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
            billing_details: billingData
        });

        if (error) {
            setIsLoading(false);
            console.log('[error]', error);
        } else {
            console.log('[PaymentMethod]', paymentMethod);
            // now posting payment token to backend for confirm payment
            const { id } = paymentMethod;
            await Axios.post("/api/payment/checkout", { id, amount: totalAmount * 100, items: cartItems, ...billingData })
                .then(res => {
                    if (res.status === 200) {
                        elements.getElement(CardElement).clear();
                        const { orderID, name, email, phone, amountPayed } = res.data;
                        dispatch(FetchOrderDetails(orderID, name, email, phone, amountPayed));
                        dispatch(ClearCart());
                        setIsLoading(false);
                        history.push("/order-success");
                    }
                }).catch(error => {
                    if (error.response.status === 400) {
                        setIsLoading(false);
                        elements.getElement(CardElement).clear();
                        console.log(error.response);
                    }
                });
        }
    };

    return (
        <Form id="payment-form" onSubmit={handleSubmit}>
            <h2>Shipping & Billing Information</h2>
            <fieldset>
                <label>
                    <span>Name</span>
                    <input name="name" type="text" className="field" placeholder="Enter Name" onChange={handleChange} value={billingData.name} required={true} />
                </label>
                <label>
                    <span>Email</span>
                    <input name="email" type="email" className="field" placeholder="@gmail.com" onChange={handleChange} value={billingData.email} required={true} />
                </label>
                <label>
                    <span>Phone No.</span>
                    <input name="phone" type="number" className="field" placeholder="Phone" onChange={handleChange} value={billingData.phone} required={true} />
                </label>
                <label>
                    <span>Address</span>
                    <input name="line1" type="text" className="field" placeholder="Enter address" onChange={handleChange} required={true} />
                </label>
                <label>
                    <span>City</span>
                    <input name="city" type="text" className="field" placeholder="Islamabad" onChange={handleChange} required={true} />
                </label>
                <label>
                    <span>Country</span>
                    <div id="country" className="field">
                        <select name="country" onChange={handleChange}>
                            <option value="PK">Pakistan</option>
                            <option value="IN">India</option>
                            <option value="CN">China</option>
                        </select>
                    </div>
                </label>
            </fieldset>
            <h2>Payment Information</h2>

            <fieldset>
                <CardElement options={CARD_OPTIONS} />
            </fieldset>
            <button type="submit" className="payment-btn" disabled={!stripe}>{isLoading ? <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
            </Spinner> : "pay"} </button>
            <div>
                <h2 className="text-center">or</h2>
                <button type="button" className="payment-btn" onClick={handleCashOnDelivery}>Cash on Delivery</button>
            </div>
            <div>
                <QRCodeViewer />
            </div>

        </Form>
    );
}

export default MyCheckoutForm;