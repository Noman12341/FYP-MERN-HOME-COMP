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
    const [size, setSize] = useState("M");
    useEffect(() => {
        async function fetchProduct() {
            await axios.get("/api/products/fetchProductDetails/" + productID)
                .then(res => {
                    if (res.status === 200) {
                        setProduct({ size: "M", ...res.data.product });
                    }
                }).catch(error => {
                    if (error.response.status === 400) {
                        throw error.response;
                    }
                });
        }
        fetchProduct();
    }, [productID]);
    const addItemIncart = () => {
        const newPro = { ...product, size };
        dispatch(AddItemInCart(newPro));
    }
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
                        {product.catagory === "Men" || product.catagory === "Women" ? <div className="mt-2">
                            <label className="product-quantity">Size : </label><Button bsPrefix={size === "XL" ? "size-btn size-btn-active" : "size-btn"} onClick={() => setSize("XL")}>XL</Button><Button bsPrefix={size === "L" ? "size-btn size-btn-active" : "size-btn"} onClick={() => setSize("L")}>L</Button><Button bsPrefix={size === "M" ? "size-btn size-btn-active" : "size-btn"} onClick={() => setSize("M")}>M</Button><Button bsPrefix={size === "S" ? "size-btn size-btn-active" : "size-btn"} onClick={() => setSize("S")}>S</Button>
                        </div> : null}

                        {/* Below Is add to cart Button */}
                        <div className="my-3">
                            <Button bsPrefix="product-detail-add-btn" type="button" onClick={addItemIncart} >Add to Cart</Button>
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