import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import MyCheckoutForm from './CheckoutForm';
const stripePromise = loadStripe('pk_test_NEUzSvt8LQStb4pavCUP1vdQ00jwIMRczb');

function CheckoutFormWraper() {
    return <Elements stripe={stripePromise}>
        <MyCheckoutForm />
    </Elements>
}
export default CheckoutFormWraper;