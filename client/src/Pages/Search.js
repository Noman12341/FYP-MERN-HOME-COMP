import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import PageSpinner from '../Components/Spinner';
import { useSelector, useDispatch } from 'react-redux';
import { getScrapedProducts, searchOn } from '../Actions/MyScrapedProducts';
import axios from 'axios';
import ScrapPCard from '../Components/ScrapPCard';

function Search() {
    const dispatch = useDispatch();
    let searchObj = useSelector(state => state.customizedInfo);
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState("");
    useEffect(() => {
        let liveScrap = async () => {
            setIsLoading(true);
            await axios.post("/api/products/live-scrape", { word: searchObj.searchedWord })
                .then(res => {
                    dispatch(getScrapedProducts(res.data.products));
                    dispatch(searchOn());
                    setIsLoading(false);
                }).catch(error => {
                    setIsLoading(false);
                    dispatch(searchOn());
                    setAlert(error.response.data.msg)
                });
        }
        searchObj.search && liveScrap();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchObj.search]);
    return <section className="padding-70">
        <Container>
            {isLoading ? <PageSpinner containerHeight="50vh" /> : alert ? <Alert variant="danger" onClose={() => setAlert("")} dismissible>
                <Alert.Heading > Oh snap! You got an error!</Alert.Heading>
                <p>{alert}</p>
            </Alert> : <div>
                    <h2 className="text-left mb-5">Almirah Products</h2>
                    <Row>
                        {searchObj.scrapedProducts.map((product, index) => {
                            return product.brand === "Almirah" && <Col className="my-4" key={index} lg={3} md={4} sm={6}>
                                <ScrapPCard product={product} />
                            </Col>
                        })}
                    </Row>
                    <hr></hr>
                    <h2 className="text-left my-5">Gul Ahmed Products</h2>
                    <Row>
                        {searchObj.scrapedProducts.map((product, index) => {
                            return product.brand === "Gul Ahmed" && <Col className="my-4" key={index} lg={3} md={4} sm={6}>
                                <ScrapPCard product={product} />
                            </Col>
                        })}
                    </Row>
                    <hr></hr>
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
                </div>
            }
        </Container >
    </section >
}

export default Search;