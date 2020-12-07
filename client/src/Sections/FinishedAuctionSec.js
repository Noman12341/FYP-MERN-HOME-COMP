import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import FinishedAuctionCard from '../Components/FinishAuctionCard';

function FinishedAuctionSection() {

    const [products, setProducts] = useState([]);
    useEffect(() => {
        const fetchPro = async () => {
            await axios.get("/api/products/fetchFinishedAuctions")
                .then(res => {
                    setProducts(res.data.products);
                }).catch(error => {
                    throw error;
                });
        }
        fetchPro();
    }, []);

    function kFormatter(num) {
        return Math.abs(num) > 999 ? Math.sign(num) * ((Math.abs(num) / 1000).toFixed(1)) + 'k' : Math.sign(num) * Math.abs(num)
    }

    return <section className="section-top-shadow padding-70">
        <Container>
            <h2 className="text-left mb-5" style={{ fontSize: "42px", fontWeight: "800" }}>Finished <span style={{ fontWeight: "300", color: "#777777" }}>Auctions</span></h2>
            <Row>
                {products.map((p, i) => {
                    return <Col lg={3} md={4} sm={6} key={i}>
                        <FinishedAuctionCard pID={p._ID} pName={p.productName} pPrice={kFormatter(p.productPrice)} pImg={p.productImg} />
                    </Col>
                })}
            </Row>
        </Container>
    </section>
}
export default FinishedAuctionSection;