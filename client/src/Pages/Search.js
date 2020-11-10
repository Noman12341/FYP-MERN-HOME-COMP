import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import PageSpinner from '../Components/Spinner';
import { useSelector, useDispatch } from 'react-redux';
import { getScrapedProducts, searchOn } from '../Actions/MyScrapedProducts';
import axios from 'axios';
import ScrapPCard from '../Components/ScrapPCard';

function Search() {
    const dispatch = useDispatch();
    let searchObj = useSelector(state => state.customizedInfo);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        let liveScrap = async () => {
            await axios.post("/api/products/live-scrape", { word: searchObj.searchedWord })
                .then(res => {
                    dispatch(getScrapedProducts(res.data.products));
                    dispatch(searchOn());
                    setIsLoading(false);
                    console.log(searchObj.scrapedProducts);
                }).catch(error => {
                    console.log(error.response.data.msg);
                    setIsLoading(false);
                })
        }
        searchObj.search ? liveScrap() : setIsLoading(false);

    }, []);
    return <section className="section-top-shadow padding-70">
        <Container>
            <h2 className="text-left mb-5">Products</h2>
            <Row>
                {isLoading ? <PageSpinner containerHeight="50vh" /> : searchObj.scrapedProducts.map((product, index) => {
                    return <Col className="my-4" key={index} lg={3} md={4} sm={6}>
                        <ScrapPCard product={product} />
                    </Col>
                })}
            </Row>
        </Container>
    </section>
}

export default Search;