import React from 'react';
import { Container, Button } from 'react-bootstrap';
function Banner() {

    return <section id="Banner">
        <Container className="py-5">
            <span className="banner-small-heading">Get the best products</span>
            <h1 className="banner-heading">The best place <span className="d-block font-weight-bold">to buy or sell</span></h1>
            <div className="mt-5">
                <Button href="/login" bsPrefix="banner-btn-dark">Sign In</Button>
                <Button href="/register" bsPrefix="banner-btn-dark">Register <i className="fas fa-chevron-right setting-btn-icon"></i></Button>
            </div>
        </Container>
    </section>
}

export default Banner;