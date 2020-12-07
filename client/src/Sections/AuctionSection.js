import React, { useEffect, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import AuctionCard from '../Components/AuctionCard';

function CurrentAuctions() {

    const [auctionProducts, setAuctionProducts] = useState([]);

    useEffect(() => {
        async function fetchAuctionProducts() {
            await axios.get("/api/products/fetchAuctionProducts")
                .then(res => {
                    if (res.status === 200) {
                        setAuctionProducts(res.data.auctionProducts);
                    }
                }).catch(error => {
                    if (error.response.status === 400) {
                        throw error;
                    }
                });
        }
        fetchAuctionProducts();
    }, []);

    return <section className="section-top-shadow padding-70">
        <Container>
            <h2 className="text-left mb-5" style={{ fontSize: "42px", fontWeight: "800" }}>Auction <span style={{ fontWeight: "300", color: "#777777" }}>Products</span></h2>
            <Row>
                {auctionProducts.map(product => {
                    return <Col key={product._id} className="my-4" lg={3} md={4} sm={6}>
                        <AuctionCard auctionProduct={product} />
                    </Col>
                })}
            </Row>
        </Container>
    </section>
}
export default CurrentAuctions;