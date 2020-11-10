import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function AboutUs() {
    return <section style={{ padding: "70px" }}>
        <Container>
            <Row>
                <Col lg={6}>
                    <h2>About <span style={{ fontWeight: '300', color: "#7777" }}>Us</span></h2>
                    <Row>
                        <Col lg={12} className="mb-5">
                            <div className="box-modern">
                                <div className="box-header">
                                    <div className="box-modern-icon">
                                        <i className="fas fa-laptop-code"></i>
                                    </div>
                                    <h5 className="box-modern-title">Quanity products for best customers</h5>
                                </div>
                                <p className="mt-4">Online Auction features a wide variety of quality products at wholesale prices with our main locations in Islamabad, Karachi and Lahore lol. We strive to make sure our customers are completely satisfied with their purchase.</p>
                            </div>
                        </Col>
                        <Col lg={12}>
                            <div className="box-modern">
                                <div className="box-header">
                                    <div className="box-modern-icon">
                                        <i className="far fa-thumbs-up"></i>
                                    </div>
                                    <h5 className="box-modern-title">Quanity products for best customers</h5>
                                </div>
                                <p className="mt-4">We have the knowledge and ability to handle any type of auction. We handle small local sales, and large multiple-day, multi-million dollar auctions. Our services are tailored to fit each client's needs.</p>
                            </div>
                        </Col>
                    </Row>
                </Col>
                <Col lg={6}>
                    <h2>Events</h2>
                    <Row>
                        <Col lg={12} className="mb-5">
                            <div className="box-modern">
                                <div className="box-header">
                                    <div className="box-modern-index-count"></div>
                                    <h5 className="box-modern-title">Laptops, Smartphones & IT Equipment Auction</h5>
                                </div>
                                <p className="mt-4">Next Saturday, we will be conducting our online auction of IT equipment including smartphones, laptops "Dell", "Apple" and "HP", monitors, printers, servers, network components, switches, and various accessories.</p>
                            </div>
                        </Col>
                        <Col lg={12}>
                            <div className="box-modern">
                                <div className="box-header">
                                    <div className="box-modern-index-count"></div>
                                    <h5 className="box-modern-title">Children’s Clothes & Shoes Auction</h5>
                                </div>
                                <p className="mt-4">If you are looking for a new outfit for our kids, then our upcoming event is for you! Our new auction of kids’ clothes and shoes will start next Sunday at 11:00 (PDT) featuring exclusive clothing collections from widely known brands.</p>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    </section>
}
export default AboutUs;