import React, { useEffect, useState } from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import ProductCard from '../Components/ProductCard';
import axios from 'axios';
function ProductSection() {
    const [products, setProducts] = useState([]);
    useEffect(() => {
        async function fetchProducts() {
            await axios.get("/api/products/fetchOwnProducts")
                .then(res => {
                    setProducts(res.data.products);
                    console.log(res.data.products)
                }).catch(error => {
                    if (error.response.status === 400 || error.response.status === 500) {
                        // do anything redirect to error page
                        console.log("This is error.")
                    }
                });
        }
        fetchProducts();
    }, []);
    return <section className="section-top-shadow padding-70">
        <Container>
            <h2 className="text-left mb-5">Products</h2>
            <Row>
                {products.map((product, index) => {
                    return <Col className="my-4" key={index} lg={3} md={4} sm={6}>
                        <ProductCard product={product} />
                    </Col>
                })}
            </Row>
        </Container>
    </section>
}
export default ProductSection;