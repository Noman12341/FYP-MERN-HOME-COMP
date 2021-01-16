import React, { useState } from 'react';
import { useLocation, useHistory, Link } from 'react-router-dom'
import { Container, Row, Col, Card, Alert, Form, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { AddItemInCart } from '../Actions/MyCartActions';
import { store } from 'react-notifications-component';

function AuthPage() {
    const currPath = useLocation().pathname;
    const dispatch = useDispatch();
    const history = useHistory();
    const [isLoading, setIsLoading] = useState(false);
    const [alertMsg, setAlertMsg] = useState([]);

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
        setIsLoading(true);
        await axios.post("/api/auth/login", { email: formData.email, password: formData.password })
            .then(async res => {
                const { token, user } = res.data;
                if (res.status === 200) {
                    localStorage.setItem("token", token);
                    localStorage.setItem("userID", user.userID);
                    localStorage.setItem("userName", user.name);
                    localStorage.setItem("userEmail", user.email);
                    await checkWinAuction(user.userID);
                    setIsLoading(false);
                    // history.push("/");
                    history.goBack();
                }
            }).catch(error => {
                if (error.response.status === 400) {
                    setAlertMsg(error.response.data.msg);
                    setIsLoading(false);
                }
            });
    }
    async function onSubmitRegisterForm(event) {
        event.preventDefault();
        setIsLoading(true);
        console.log(window.location.origin)
        await axios.post("/api/auth//registration", { ...formData, url: window.location.origin })
            .then(async res => {
                if (res.status === 200) {
                    setAlertMsg(res.data.msg);
                    setIsLoading(false);
                    // const { token, user } = res.data;
                    // localStorage.setItem("token", token);
                    // localStorage.setItem("userID", user.userID);
                    // localStorage.setItem("userName", user.name);
                    // localStorage.setItem("userEmail", user.email);
                    // setIsLoading(false);
                    // history.push("/");
                }
            }).catch(error => {
                if (error.response.status === 400 || error.response.status === 500) {
                    setAlertMsg(error.response.data.msg);
                    setIsLoading(false);
                }
            });
    }

    // check user if he wins the auction
    const checkWinAuction = async userID => {
        await axios.get("/api/products/fetchFinishedAuction/" + userID)
            .then(res => {
                const products = res.data.finishedAuction;
                if (products.length > 0) {
                    products.forEach(item => {
                        const { productID, productName, productImg, productPrice, isMyProduct } = item;
                        const product = { _id: productID, name: productName, image: productImg, price: productPrice, isMyProduct }
                        dispatch(AddItemInCart(product));
                    });
                    store.addNotification({
                        title: "Wonderful!",
                        message: "You won the Auction. Product is now added into your Cart.",
                        type: "success",
                        insert: "top",
                        container: "center",
                        animationIn: ["animate__animated", "animate__fadeIn"],
                        animationOut: ["animate__animated", "animate__fadeOut"],
                        dismiss: {
                            duration: 5000,
                            onScreen: true,
                            pauseOnHover: true
                        }
                    });
                    return;
                } else return;

            }).catch(error => {
                console.log(error);
                return;
            });
    }
    return <Container id="auth-container" fluid style={{ backgroundColor: "#f4f4f4", height: currPath === "/login" ? "110vh" : "130vh" }}>
        <div className="account-chose-link-left"><Link to={currPath === "/login" ? "/register" : "/login"}>{currPath === "/login" ? "Register Now" : "Sign In Now"}</Link></div>
        <Row>
            <Col md={6} className="m-auto">
                <Card>
                    <Card.Body>
                        <Card.Title className="text-left">{currPath === "/login" ? "Sign In" : "Registration"}</Card.Title>
                        {alertMsg.length > 0 && <Alert variant="danger"><ul className="mb-0">{alertMsg.map((msg, i) => {
                            return <li key={i}>{msg}</li>
                        })}</ul></Alert>}
                        <Form onSubmit={currPath === "/login" ? onSubmitLoginForm : onSubmitRegisterForm}>
                            {currPath === "/register" && <Form.Group controlId="formBasicUserName">
                                <Form.Label>User Name</Form.Label>
                                <Form.Control type="text" name="name" onChange={handleChange} value={formData.name} required />
                            </Form.Group>}
                            <Form.Group controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" name="email" onChange={handleChange} value={formData.email} required />
                                <Form.Text className="text-muted">
                                    We'll never share your email with anyone else.
                                </Form.Text>
                            </Form.Group>

                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" name="password" onChange={handleChange} value={formData.password} required />
                            </Form.Group>
                            {currPath === "/register" && <Form.Group controlId="formBasicConformPassword">
                                <Form.Label>Confrim Password</Form.Label>
                                <Form.Control type="password" name="password2" onChange={handleChange} value={formData.password2} required />
                            </Form.Group>}
                            {currPath === "/login" && <h6 className="text-right my-4"><Link to="/forgot-password">Forgot Password ?</Link></h6>}
                            <Button bsPrefix="auth-button-submit" type="submit" >
                                {isLoading ? <Spinner animation="border" /> : "Submit"}
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