import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
function WorkSection() {
    return <section className="section-top-shadow padding-70 bg-gray">
        <Container>
            <h2>How <span style={{ fontWeight: '300', color: "#7777" }}>it works</span></h2>
            <Row className="mt-5">
                <Col lg={3} className="colume-arrow">
                    <div className="w-100 mx-auto">
                        <div className="box-icon">
                            <i className="fas fa-mouse"></i>
                        </div>
                        <h5 className="box-icon-heading">Register</h5>
                        <p>To start using our auction, you’ll need to register. It’s completely free and requires just a few clicks!</p>
                    </div>
                </Col>
                <Col lg={3} className="colume-arrow">
                    <div className="w-100 mx-auto">
                        <div className="box-icon">
                            <i className="fas fa-cart-arrow-down"></i>
                        </div>
                        <h5 className="box-icon-heading">Buy or Bid</h5>
                        <p>You can instantly buy or place a bid on any desired product right after registration on our website</p>
                    </div>
                </Col>
                <Col lg={3} className="colume-arrow">
                    <div className="w-100 mx-auto">
                        <div className="box-icon">
                            <i className="fas fa-gavel"></i>
                        </div>
                        <h5 className="box-icon-heading">Submit a Bid</h5>
                        <p>Submitting a bid to our auction is quick and easy. The process takes approximately 5 minutes.</p>
                    </div>
                </Col>
                <Col lg={3}>
                    <div className="w-100 mx-auto">
                        <div className="box-icon">
                            <i className="fas fa-trophy"></i>
                        </div>
                        <h5 className="box-icon-heading">Win</h5>
                        <p>Easily win at our auction and enjoy owning the product you dream of after the bidding is closed.</p>
                    </div>
                </Col>
            </Row>
        </Container>
    </section>
}

export default WorkSection;