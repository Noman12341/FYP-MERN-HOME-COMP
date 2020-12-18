import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

function Banner() {
    const history = useHistory();
    return <section id="Banner">
        <Container className="py-5">
            <span className="banner-small-heading">Get the best products</span>
            <h1 className="banner-heading">The best place <span className="d-block font-weight-bold">to buy or sell</span></h1>
            <div className="mt-5">
                <Button bsPrefix="banner-btn-dark" onClick={() => history.push("/login")}>Sign In</Button>
                <Button bsPrefix="banner-btn-dark" onClick={() => history.push("/register")}>Register <i className="fas fa-chevron-right setting-btn-icon"></i></Button>
            </div>
        </Container>
    </section>
}

export default Banner;