import React from 'react';
import CheckoutForm from '../Components/CheckoutWrap';
import OrderSummary from '../Components/OrderSummary';
import { Container, Row, Col } from 'react-bootstrap';

function Checkout() {
    return <Container fluid className="m-0">
        <Row>
            <Col lg={8} className="p-2" style={{ backgroundColor: "#f4f4f4", padding: "0" }}>
                <CheckoutForm />
            </Col>
            <Col lg={4} className="p-0">
                <OrderSummary />
            </Col>
        </Row>
    </Container>
}
export default Checkout;