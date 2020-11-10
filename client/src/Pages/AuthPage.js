import React, { useState } from 'react';
import { useLocation, useHistory, Link } from 'react-router-dom'
import { Container, Row, Col, Card, Alert, Form, Button } from 'react-bootstrap';
import axios from 'axios';

function AuthPage() {
    const location = useLocation();
    const currPath = location.pathname;
    const history = useHistory();
    const [alertMsg, setAlertMsg] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password2: "",
    });

    // on form change
    function handleChange(event) {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    }
    async function onSubmitLoginForm(event) {
        event.preventDefault();
        await axios.post("/api/auth/login", { email: formData.email, password: formData.password })
            .then(res => {
                const { token, user } = res.data;
                if (res.status === 200) {
                    localStorage.setItem("token", token);
                    localStorage.setItem("userID", user.userID);
                    localStorage.setItem("userName", user.name);
                    localStorage.setItem("userEmail", user.email);
                    // history.push("/");
                    history.goBack();
                }
            }).catch(error => {
                if (error.response.status === 400) {
                    setAlertMsg(error.response.data.msg);
                }
            });
    }
    async function onSubmitRegisterForm(event) {
        event.preventDefault();
        await axios.post("/api/auth//registration", { ...formData })
            .then(res => {
                if (res.status === 200) {
                    const { token, user } = res.data;
                    localStorage.setItem("token", token);
                    localStorage.setItem("userID", user.userID);
                    localStorage.setItem("userName", user.name);
                    localStorage.setItem("userEmail", user.email);
                    history.push("/");
                }
            }).catch(error => {
                if (error.response.status === 400 || error.response.status === 500) {
                    setAlertMsg(error.response.data.msg);
                }
            });
    }
    return <Container id="auth-container" fluid style={{ backgroundColor: "#f4f4f4", height: currPath === "/login" ? "110vh" : "130vh" }}>
        <div className="account-chose-link"><Link to="/">Back to Main Page</Link></div>
        <div className="account-chose-link-left"><Link to={currPath === "/login" ? "/register" : "/login"}>{currPath === "/login" ? "Register Now" : "Sign In Now"}</Link></div>
        <Row>
            <Col md={6} className="m-auto">
                <Card>
                    <Card.Body>
                        <Card.Title className="text-left">{currPath === "/login" ? "Sign In" : "Registration"}</Card.Title>
                        {alertMsg && <Alert variant="danger" dismissible>{alertMsg}</Alert>}
                        <Form onSubmit={currPath === "/login" ? onSubmitLoginForm : onSubmitRegisterForm}>
                            {currPath === "/register" && <Form.Group controlId="formBasicUserName">
                                <Form.Label>User Name</Form.Label>
                                <Form.Control type="text" name="name" onChange={handleChange} value={formData.name} />
                            </Form.Group>}
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" name="email" onChange={handleChange} value={formData.email} />
                                <Form.Text className="text-muted">
                                    We'll never share your email with anyone else.
                                </Form.Text>
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" name="password" onChange={handleChange} value={formData.password} />
                            </Form.Group>
                            {currPath === "/register" && <Form.Group controlId="formBasicConformPassword">
                                <Form.Label>Confrim Password</Form.Label>
                                <Form.Control type="password" name="password2" onChange={handleChange} value={formData.password2} />
                            </Form.Group>}
                            <Button bsPrefix="auth-button-submit" type="submit" >
                                Submit
                            </Button>
                            <div className="text-center my-3"><span>or</span></div>
                            <Button bsPrefix="auth-button-google" type="submit">
                                <i className="fab fa-google"></i> {currPath === "/login" ? "login with google" : "Sign Up with google"}
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </Container>
}
export default AuthPage;