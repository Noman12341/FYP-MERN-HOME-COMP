import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import ProductCard from '../Components/ProductCard';
import axios from 'axios';
import PageSpinner from '../Components/Spinner';
import { useParams } from 'react-router-dom';
function BrandProducts() {
    const { brand } = useParams();
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState("");
    useEffect(() => {
        const fetchScrap = async () => {
            setIsLoading(true);
            setAlert("");
            await axios.get("/api/products/fetchBrand/" + brand)
                .then(res => {
                    setItems(res.data.items);
                    setIsLoading(false);
                }).catch(error => {
                    setAlert(error.response.data.msg);
                    setIsLoading(false);
                });
        }
        fetchScrap();
    }, [brand]);



    return <section className="section-top-shadow padding-70">
        <Container>
            <h2 className="text-left mb-5">Products</h2>
            {isLoading ? <PageSpinner containerHeight="50vh" /> : alert ? <Alert variant="dark" onClose={() => setAlert("")} dismissible>
                <Alert.Heading > Oh snap! You got an error!</Alert.Heading>
                <p>{alert}</p>
            </Alert> : <Row>
                    {items.map((product, index) => {
                        return <Col className="my-4" key={index} lg={3} md={4} sm={6}>
                            <ProductCard product={product} />
                        </Col>
                    })}
                </Row>}
        </Container>
    </section>
}
export default BrandProducts;