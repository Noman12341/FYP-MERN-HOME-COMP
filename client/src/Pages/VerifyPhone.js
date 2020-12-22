import React, { useState } from 'react';
import { Container, Row, Col, Card, Alert, Form, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

function VerifyPhone() {

    const [alert, setAlert] = useState({
        show: false,
        success: false,
        msg: ""
    });
    const [hideForm, setHideForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [num, setNum] = useState("");
    const [token, setToken] = useState("");
    const [showCodeForm, setCode] = useState(true);
    const submitNumber = async event => {
        event.preventDefault();
        setIsLoading(true);
        await axios.post('/api/auth/send-number', { number: num })
            .then(res => {
                localStorage.setItem("codeID", res.data.id)
                setAlert({ show: true, success: true, msg: res.data.msg });
                setHideForm(true);
                setCode(false);
                setIsLoading(false);
            }).catch(error => {
                setAlert({ show: true, success: false, msg: error.response.data.msg });
                setIsLoading(false);
            });
    }

    const submitToken = async e => {
        e.preventDefault();
        setIsLoading(true);
        await axios.post("/api/auth/verify-code-number", { id: localStorage.getItem("codeID"), token })
            .then(res => {
                setAlert({ show: true, success: true, msg: res.data.msg });
                setToken("");
                setIsLoading(false);
            }).catch(error => {
                setAlert({ show: true, success: false, msg: error.response.data.msg });
                localStorage.removeItem("codeID");
                setIsLoading(false);
            });
    }

    return <Container id="auth-container" style={{ height: "100vh", backgroundColor: "#f4f4f4" }} fluid>
        <div className="account-chose-link"><Link to="/">Back to Main Page</Link></div>
        <Row>
            <Col md={6} className="mx-auto">
                <Card>
                    <Card.Body>
                        <Card.Title className="text-center my-3">Verify Phone number</Card.Title>
                        {alert.show && <Alert variant={alert.success ? "success" : "warning"}>{alert.msg}</Alert>}
                        {!hideForm && <Form onSubmit={submitNumber}>
                            <Form.Group>
                                <Form.Label>Enter Phone No to verify</Form.Label>
                                <Form.Control type="tel" onChange={e => setNum(e.target.value)} value={num} required />
                            </Form.Group>
                            <Button type="submit" bsPrefix="auth-button-submit">{isLoading ? <Spinner animation="border" /> : "Verify"}</Button>
                        </Form>}
                        {!showCodeForm && <Form onSubmit={submitToken}>
                            <Form.Group>
                                <Form.Label>Enter Verification Code</Form.Label>
                                <Form.Control type="number" onChange={e => setToken(e.target.value)} value={token} required />
                            </Form.Group>
                            <Button type="submit" bsPrefix="auth-button-submit">{isLoading ? <Spinner animation="border" /> : "Verify"}</Button>
                        </Form>}
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </Container>;
}
export default VerifyPhone;