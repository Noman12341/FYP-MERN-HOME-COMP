import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Image, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { AddItemInCart } from '../Actions/MyCartActions';
import PageSpinner from '../Components/Spinner';
function ProductDetail() {
    const dispatch = useDispatch();
    const [product, setProduct] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const scraperLink = useSelector(state => state.customizedInfo.scrapLink);
    const selectedProductID = useSelector(state => state.customizedInfo.pClickedID);
    console.log(scraperLink);
    useEffect(() => {
        let fetchScrapDetail = async () => {
            await axios.post("/api/products/scrap-product-detail", { link: scraperLink })
                .then(res => {
                    setProduct({ ...res.data.productDetail, _id: selectedProductID });
                    setIsLoading(false);
                }).catch(error => {
                    console.log(error.response.data.msg);
                    setIsLoading(false);
                })
        }
        fetchScrapDetail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scraperLink]);
    return <section id="product-detail">
        <Container fluid style={{ backgroundColor: "white" }}>
            {isLoading ? <PageSpinner containerHeight="70vh" /> : <Row>
                <Col lg={4}>
                    <Image className="mt-3" src={product.image} fluid />
                </Col>
                <Col lg={8}>
                    <div className="ml-4">
                        <h4 className="product-detail-name">{product.name}</h4>
                        <div><span className="font-weight-bold">Brand : </span>{product.brand}</div>
                        <div className="rating-product-stars">
                            {/* <ul>
                                <li ><span style={{ color: 'black', marginLeft: "1%" }}>{product.rating}</span></li>
                                <li><i className="fas fa-star"></i></li>
                                <span style={{ color: 'black', marginLeft: "1%" }}>Reviews ({product.totalReviews})</span>
                            </ul> */}
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
            </Row>}
        </Container>
    </section>
}

export default ProductDetail;