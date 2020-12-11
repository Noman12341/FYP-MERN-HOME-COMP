import React, { useState } from 'react';
import { Container, Row, Col, Card, Alert, Form, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

function ForGotEmail() {

    const [alert, setAlert] = useState({
        show: false,
        success: false,
        msg: ""
    });
    const [hideForm, setHideForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState("");

    const handleSubmit = async event => {
        event.preventDefault();
        setIsLoading(true);
        await axios.put('/api/auth/forgot-password', { email, url: window.location.href })
            .then(res => {
                setAlert({ show: true, success: true, msg: res.data.msg });
                setHideForm(true);
                setIsLoading(false);
            }).catch(error => {
                setAlert({ show: true, success: false, msg: error.response.data.msg });
                setIsLoading(false);
            });
    }

    return <Container id="auth-container" style={{ height: "100vh", backgroundColor: "#f4f4f4" }} fluid>
        <div className="account-chose-link"><Link to="/">Back to Main Page</Link></div>
        <Row>
            <Col md={6} className="mx-auto">
                <Card>
                    <Card.Body>
                        <Card.Title className="text-center my-3">Password reset</Card.Title>
                        {alert.show && <Alert variant={alert.success ? "success" : "warning"}>{alert.msg}</Alert>}
                        {!hideForm && <Form onSubmit={handleSubmit}>
                            <Form.Group>
                                <Form.Label>Enter Email Address</Form.Label>
                                <Form.Control type="email" onChange={e => setEmail(e.target.value)} value={email} required />
                            </Form.Group>
                            <Button type="submit" bsPrefix="auth-button-submit">{isLoading ? <Spinner animation="border" /> : "Submit"}</Button>
                        </Form>}
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </Container>;
}
export default ForGotEmail;