import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';

function AdminAuth() {
    const history = useHistory();
    const [form, setForm] = useState({
        email: "",
        password: ""
    });
    const [alert, setAlert] = useState("");
    let handleChange = (event) => {
        setForm({ ...form, [event.target.name]: event.target.value });
    }
    let handleSubmit = async (event) => {
        event.preventDefault();
        await axios.post("/api/auth/login-admin", { ...form })
            .then(res => {
                console.log(res.data);
                localStorage.setItem("adminName", res.data.user.name);
                localStorage.setItem("adminID", res.data.user.userID);
                localStorage.setItem("adminToken", res.data.token);
                localStorage.setItem("adminEmail", res.data.user.email);
                history.push("/admin");
            }).catch(error => {
                setAlert(error.response.data.msg);
            });
    }
    return <main id="admin-auth-container">
        <Container>
            <Row>
                <Col lg={5} className="card-wrapper">
                    <Card>
                        <Card.Body>
                            <h4 className="text-center">Admin Sign In</h4>
                            {alert && <Alert variant='warning'>{alert}</Alert>}
                            <Form onSubmit={handleSubmit} className="mt-4">
                                <Form.Group>
                                    <Form.Label>Email address</Form.Label>
                                    <Form.Control type="email" name="email" value={form.email} onChange={handleChange} />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control type="password" name="password" value={form.password} onChange={handleChange} />
                                </Form.Group>
                                <h6 className="text-right my-4"><Link to="#">Forgot Password</Link></h6>
                                <Button type="submit" variant="primary" block>Sign In</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    </main>
}
export default AdminAuth;