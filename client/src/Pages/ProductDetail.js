import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom'
import { Container, Row, Col, Image, Button } from 'react-bootstrap';
import CommentSection from '../Sections/CommentSection';
import { useDispatch } from 'react-redux';
import { AddItemInCart } from '../Actions/MyCartActions';
import SocialShare from '../Components/SocialShare';

function ProductDetail() {
    const dispatch = useDispatch();
    const { productID } = useParams();
    const [product, setProduct] = useState({});
    useEffect(() => {
        async function fetchProduct() {
            await axios.get("/api/products/fetchProductDetails/" + productID)
                .then(res => {
                    if (res.status === 200) {
                        setProduct(res.data.product);
                    }
                }).catch(error => {
                    if (error.response.status === 400) {
                        throw error.response;
                    }
                });
        }
        fetchProduct();
    }, [productID]);
    return <section id="product-detail">
        <Container fluid style={{ backgroundColor: "white" }}>
            <Row>
                <Col lg={4}>
                    <Image className="mt-3" src={product.image && product.isMyProduct ? "/static/images/" + product.image : product.image} fluid />
                </Col>
                <Col lg={8}>
                    <div className="ml-4">
                        <h4 className="product-detail-name">{product.name}</h4>
                        <div><span className="font-weight-bold">Brand : </span>{product.brand}</div>
                        <div className="rating-product-stars">
                            <ul>
                                <li ><span style={{ color: 'black', marginLeft: "1%" }}>{product.rating}</span></li>
                                <li><i className="fas fa-star"></i></li>
                                <span style={{ color: 'black', marginLeft: "1%" }}>Reviews ({product.totalReviews})</span>
                            </ul>
                        </div>
                        <p className="product-details-description"><span className="font-weight-bold">Description : </span>{product.description}</p>
                        <hr />
                        <div><span className="font-weight-bold">Price : </span><span className="product-detail-price">{product.price}</span></div>
                        {/* Need to put size here */}
                        {/* <div className="mt-2">
                            <label className="product-quantity">Size : </label>
                        </div> */}
                        <div className="my-3">
                            <Button bsPrefix="product-detail-add-btn" type="button" onClick={() => dispatch(AddItemInCart(product))} >Add to Cart</Button>
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
        <CommentSection productID={productID} isAuctionPro="false" />
        <SocialShare />
    </section>
}

export default ProductDetail;