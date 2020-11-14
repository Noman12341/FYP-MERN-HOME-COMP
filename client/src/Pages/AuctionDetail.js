import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'
import { Container, Row, Col, Image, Button, Form, Alert } from 'react-bootstrap';
import CountDown from '../Components/CountDown';
import { useHistory, Link } from 'react-router-dom';
import SocialShare from '../Components/SocialShare';

function ProductDetail() {
    const { auctionProductID } = useParams();
    const [auctionProduct, setAuctionProduct] = useState({});
    const [bid, setBid] = useState(0);
    const [alertMsg, setAlertMsg] = useState("");
    const history = useHistory();
    useEffect(() => {
        async function fetchProduct() {
            await axios.get("/api/products/fetchAuctionDetail/" + auctionProductID)
                .then(res => {
                    if (res.status === 200) {
                        setAuctionProduct(res.data.auctionProduct);
                    }
                }).catch(error => {
                    if (error.response.status === 400) {
                        throw error;
                    }
                });
        }
        fetchProduct();
    }, [auctionProductID]);
    function handleChange(event) {
        setBid(event.target.value);
    }
    // Submit Bid request
    async function handleOnSubmitBid(event) {
        event.preventDefault();
        const jwtToken = localStorage.getItem("token");
        const data = {
            userName: localStorage.getItem("userName"),
            userID: localStorage.getItem("userID"),
            productID: auctionProductID,
            bidPrice: bid,
            currentPrice: auctionProduct.currentPrice
        }
        await axios.post("/api/products/postBid", { ...data }, {
            headers: {
                'content-Type': 'application/json',
                "x-auth-token": jwtToken
            }
        }).then(res => {
            if (res.status === 200) {
                setAlertMsg("");
                history.push("/");
            }
        }).catch(error => {
            if (error.response.status === 406) {
                setAlertMsg(error.response.data.msg);
            }
            if (error.response.status === 400) {
                history.push("/login");
            }
        });

    }
    return <section id="product-detail">
        <Container fluid style={{ backgroundColor: "white" }}>
            <Row>
                <Col lg={4}>
                    <Image src={auctionProduct.image && "/static/images/" + auctionProduct.image} className="p-3" fluid />
                </Col>
                <Col lg={8}>
                    <div className="ml-4">
                        <h4 className="product-detail-name">{auctionProduct.name}</h4>
                        <div><span className="font-weight-bold">Brand : </span>{auctionProduct.brand}</div>
                        <div className="rating-product-stars">
                            <ul>
                                <li><i className="fas fa-star"></i></li>
                                <li><i className="fas fa-star"></i></li>
                                <li><i className="fas fa-star"></i></li>
                                <li><i className="fas fa-star"></i></li>
                                <li><i className="fas fa-star"></i></li>
                                <span style={{ color: 'black', marginLeft: "1%" }}>Reviews ({auctionProduct.totalReviews})</span>
                            </ul>
                        </div>
                        <p className="product-details-description"><span className="font-weight-bold">Description : </span>{auctionProduct.description}</p>
                        <hr />
                        {localStorage.getItem("token") ? <Form onSubmit={handleOnSubmitBid} style={{ backgroundColor: "#e4e4e4", padding: "20px", marginBottom: "10px", textAlign: "center" }}>
                            {alertMsg && <Alert variant="danger">{alertMsg}</Alert>}
                            <div className="mt-3"><span className="font-weight-bold">Current Price : </span><span className="product-detail-price">{auctionProduct.currentPrice}</span><CountDown countDown={auctionProduct.auctionEndingDate} /></div>
                            <Form.Control type="number" style={{ width: "60%", margin: "17px auto" }} placeholder="Enter the price" name="bid" onChange={handleChange} value={bid} />
                            <Button bsPrefix="product-detail-add-btn" type="submit" >Place a Bid</Button>
                        </Form> : <div> <div><span className="font-weight-bold">Price : </span><span className="product-detail-price">{auctionProduct.currentPrice}</span></div>
                                <div className="my-4">
                                    <Link to="/login" className="product-detail-add-btn" >Place a Bid</Link>
                                </div>
                            </div>}
                    </div>
                </Col>
            </Row>
        </Container>
        <SocialShare />
    </section>
}

export default ProductDetail;