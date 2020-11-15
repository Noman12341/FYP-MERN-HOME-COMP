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
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        let liveScrap = async () => {
            setIsLoading(true);
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
        searchObj.search && liveScrap();
    }, [searchObj.searchedWord, searchObj.search]);
    return <section className="section-top-shadow padding-70">
        <Container>
            {isLoading ? <PageSpinner containerHeight="50vh" /> : <div>
                <h2 className="text-left mb-5">Almirah Products</h2>
                <Row>
                    {searchObj.scrapedProducts.map((product, index) => {
                        return product.brand === "Almirah" && <Col className="my-4" key={index} lg={3} md={4} sm={6}>
                            <ScrapPCard product={product} />
                        </Col>
                    })}
                </Row>
                <h2 className="text-left my-5">Gul Ahmed Products</h2>
                <Row>
                    {searchObj.scrapedProducts.map((product, index) => {
                        return product.brand === "Gul Ahmed" && <Col className="my-4" key={index} lg={3} md={4} sm={6}>
                            <ScrapPCard product={product} />
                        </Col>
                    })}
                </Row>
                {/* <h2 className="text-left my-5">Alkaram Products</h2>
                <Row>
                    {searchObj.scrapedProducts.map((product, index) => {
                        return product.brand === "Alkaram" && <Col className="my-4" key={index} lg={3} md={4} sm={6}>
                            <ScrapPCard product={product} />
                        </Col>
                    })}
                </Row> */}
                {/* <h2 className="text-left my-5">Diners Products</h2>
                <Row>
                    {searchObj.scrapedProducts.map((product, index) => {
                        return product.brand === "Diners" && <Col className="my-4" key={index} lg={3} md={4} sm={6}>
                            <ScrapPCard product={product} />
                        </Col>
                    })}
                </Row> */}
            </div>}
        </Container>
    </section>
}

export default Search;