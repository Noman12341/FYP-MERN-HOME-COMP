import React, { useState } from 'react';
import { Container, Row, Col, Image, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import almirahLogo from '../Images/Logo_Almirah.png';
import sanaLogo from '../Images/sana-safinaz-logo.jpg';
import gulLogo from '../Images/gul-logo.png';
import dinersLogo from '../Images/diners-logo.png';
import sliderImg1 from '../Images/slider-img-1.jpg';
import sliderImg2 from '../Images/slider-img-2.jpg';
import sliderImg3 from '../Images/slider-img-3.jpg';

function CarouselBanner() {
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };

    return <Container id="carousel-banner" fluid>
        <div>
            <Row>
                <Col lg={3}>
                    <div className="heading-bands"><strong>My Brands</strong></div>
                    <div className="banner-bands">
                        <ul>
                            <li><Link to="/product-brands/Almirah"><Image className="mr-2" src={almirahLogo} height="30" width="30" />Almirah</Link></li>
                            <li><Link to="/product-brands/Sana Safinaz"><Image className="mr-2" src={sanaLogo} height="30" />Sana safiza</Link></li>
                            <li><Link to="/product-brands/Gul Ahmed"><Image className="mr-2" src={gulLogo} height="30" />Gul Ahmed</Link></li>
                            <li><Link to="/product-brands/Diners"><Image className="mr-2" src={dinersLogo} height="30" />Diners</Link></li>
                        </ul>
                    </div>
                    <div className="heading-bands"><strong style={{ color: "orange" }}>Catagories</strong></div>
                    <div className="banner-bands">
                        <ul>
                            <li><Link to="/catagories/Men">Men</Link></li>
                            <li><Link to="/catagories/Women">Women</Link></li>
                            <li><Link to="/catagories/Electronics">Electronics</Link></li>
                        </ul>
                    </div>
                </Col>
                <Col lg={9} className="pl-0">
                    <div>
                        <Carousel activeIndex={index} onSelect={handleSelect}>
                            <Carousel.Item>
                                <Image
                                    className="w-100"
                                    src={sliderImg1}
                                    alt="First slide"
                                />
                                {/* <Carousel.Caption>
                                    <h3>First slide label</h3>
                                    <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                                </Carousel.Caption> */}
                            </Carousel.Item>
                            <Carousel.Item>
                                <Image
                                    className="w-100"
                                    src={sliderImg2}
                                    alt="Second slide"
                                />

                                {/* <Carousel.Caption>
                                    <h3>Second slide label</h3>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                                </Carousel.Caption> */}
                            </Carousel.Item>
                            <Carousel.Item>
                                <Image className="w-100"
                                    src={sliderImg3}
                                    alt="Third slide"
                                />

                                {/* <Carousel.Caption>
                                    <h3>Third slide label</h3>
                                    <p>
                                        Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p>
                                </Carousel.Caption> */}
                            </Carousel.Item>
                        </Carousel>
                    </div>
                </Col>
            </Row>
        </div>
    </Container>
}
export default CarouselBanner;