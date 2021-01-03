import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
function Footer() {
    const location = useLocation();
    const currLocation = location.pathname;
    // hide footer for the following routes in anyother case
    // currLocation.includes("/login") || currLocation.includes("/register") ||  || currLocation.includes("/forgot") || currLocation.includes("/verify")
    if (currLocation.includes("/admin")) return null;
    const currentYear = new Date().getFullYear();
    return <footer id="footer">
        <div style={{ padding: "75px 0 105px" }}>
            <Container>
                <Row>
                    <Col lg={3}>
                        <h4 className="footer-title">Information</h4>
                        <ul className="footer-ul">
                            <li><a className="footer-link" href="#0">My Account</a></li>
                            <li><a className="footer-link" href="#0">Price List</a></li>
                            <li><a className="footer-link" href="#0">About Us</a></li>
                            <li><a className="footer-link" href="#0">Contacts</a></li>
                            <li><a className="footer-link" href="#0">Registration</a></li>
                            <li><a className="footer-link" href="#0">News</a></li>
                        </ul>
                    </Col>
                    <Col lg={3}>
                        <h4 className="footer-title">Help Center</h4>
                        <ul className="footer-ul">
                            <li><a className="footer-link" href="#0">Assistance</a></li>
                            <li><a className="footer-link" href="#0">FAQs</a></li>
                            <li><a className="footer-link" href="#0">Testimonials</a></li>
                            <li><a className="footer-link" href="#0">Account Refill</a></li>
                            <li><a className="footer-link" href="#0">Payments</a></li>
                        </ul>
                    </Col>
                    <Col lg={3}>
                        <h4 className="footer-title">Parteners</h4>
                        <ul className="footer-ul">
                            <li><a className="footer-link" href="#0">Almirah</a></li>
                            <li><a className="footer-link" href="#0">Gul Ahmed</a></li>
                            <li><a className="footer-link" href="#0">Sana Safinaz</a></li>
                            <li><a className="footer-link" href="#0">Khaddi</a></li>
                            <li><a className="footer-link" href="#0">HSY</a></li>
                        </ul>
                    </Col>
                    <Col lg={3}>
                        <h4 className="footer-title">Contact Us</h4>
                        <ul className="footer-ul-social">
                            <li><a className="footer-link" href="#0"><i className="fab fa-facebook fa-2x"></i></a></li>
                            <li><a className="footer-link" href="#0"><i className="fab fa-whatsapp fa-2x"></i></a></li>
                            <li><a className="footer-link" href="#0"><i className="fab fa-pinterest fa-2x"></i></a></li>
                            <li><a className="footer-link" href="#0"><i className="fab fa-linkedin-in fa-2x"></i></a></li>
                        </ul>
                    </Col>
                </Row>
            </Container>
        </div>
        <div className="footer-panel">
            <Container>
                <p>{currentYear} Multi brand all right recieved.</p>
            </Container>
        </div>
    </footer>
}
export default Footer;