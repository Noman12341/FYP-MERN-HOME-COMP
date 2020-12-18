import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'
import { Container, Row, Col, Image, Button, Form } from 'react-bootstrap';
import CountDown from '../Components/CountDown';
import { useHistory, Link } from 'react-router-dom';
import SocialShare from '../Components/SocialShare';
import { store } from 'react-notifications-component';
import CommentSection from '../Sections/CommentSection';

function ProductDetail() {
    const { auctionProductID } = useParams();
    const [auctionProduct, setAuctionProduct] = useState({});
    const [bid, setBid] = useState("");
    const history = useHistory();
    const [run, setRun] = useState(false);
    useEffect(() => {
        let source = axios.CancelToken.source();
        async function fetchProduct() {
            try {
                await axios.get("/api/products/fetchAuctionDetail/" + auctionProductID, { cancelToken: source.token })
                    .then(res => {
                        setAuctionProduct(res.data.auctionProduct);
                    });
            } catch (error) {
                if (axios.isCancel(error)) {
                    console.log("Axios request Canceled.");
                } else { throw error; }
            }
        }
        fetchProduct();
        // below function is a cleanup function
        return () => {
            source.cancel();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [run]);
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
                // setAlertMsg("");
                store.addNotification({
                    title: "Wonderful!",
                    message: "your Bid is submited.",
                    type: "success",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                        duration: 5000,
                        onScreen: true
                    }
                });
                // setBid(null);
                setRun(!run);
            }
        }).catch(error => {
            if (error.response.status === 406) {
                store.addNotification({
                    title: "Wops",
                    message: error.response.data.msg,
                    type: "danger",
                    insert: "top",
                    container: "top-right",
                    animationIn: ["animate__animated", "animate__BounceIn"],
                    animationOut: ["animate__animated", "animate__BounceOut"],
                    dismiss: {
                        duration: 5000,
                        onScreen: true
                    }
                });
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
                    <Image className="mt-3" src={auctionProduct.image && "/static/images/" + auctionProduct.image} fluid />
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
                            <div className="mt-3 position-relative"><Link to={"/view-bids/" + auctionProductID} className="view-bid">View Bids</Link><span className="font-weight-bold">Current Price : </span><span className="product-detail-price">{auctionProduct.currentPrice}</span><CountDown countDown={auctionProduct.auctionEndingDate} /></div>
                            <Form.Control type="number" style={{ width: "60%", margin: "17px auto" }} placeholder="Enter the price" name="bid" onChange={handleChange} value={bid} required />
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
        <CommentSection productID={auctionProductID} isAuctionPro="true" />
        <SocialShare />
    </section>
}

export default ProductDetail;