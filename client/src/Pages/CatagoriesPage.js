import React, { useEffect, useState } from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import ProductCard from '../Components/ProductCard';
import AuctionCard from '../Components/AuctionCard';
import Spinner from '../Components/Spinner';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function CatagoriesPage() {
    const { catagory } = useParams();
    const [products, setProducts] = useState([]);
    const [auctionP, setAuctionP] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        setIsLoading(true);
        async function fetchProducts() {
            await axios.get("/api/products/catagory-items/" + catagory)
                .then(res => {
                    setProducts(res.data.products);
                    setAuctionP(res.data.auctionP);
                    setIsLoading(false);
                }).catch(error => {
                    if (error.response.status === 400 || error.response.status === 500) {
                        // do anything redirect to error page
                        console.log("Read the error => " + error.response.data.msg);
                        setIsLoading(false);
                    }
                });
        }
        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return <main>{isLoading ? <Spinner containerHeight="50vh" /> : <div>
        <section className="section-top-shadow padding-70">
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
        <section className="section-top-shadow padding-70">
            <Container>
                <h2 className="text-left mb-5" style={{ fontSize: "42px", fontWeight: "800" }}>Auction <span style={{ fontWeight: "300", color: "#777777" }}>Products</span></h2>
                <Row>
                    {auctionP.map((p, i) => {
                        return <Col key={i} className="my-4" lg={3} md={4} sm={6}>
                            <AuctionCard auctionProduct={p} />
                        </Col>
                    })}
                </Row>
            </Container>
        </section>
    </div>}
    </main>
}
export default CatagoriesPage;