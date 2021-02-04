import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import PageSpinner from '../Components/Spinner';
import { useSelector, useDispatch } from 'react-redux';
import { getScrapedProducts, searchOn } from '../Actions/MyScrapedProducts';
import axios from 'axios';
import ScrapPCard from '../Components/ScrapPCard';

function Search() {
    const dispatch = useDispatch();
    let search = useSelector(state => state.customizedInfo.search);
    let searchedWord = useSelector(state => state.customizedInfo.searchedWord);
    let almirah = useSelector(state => state.customizedInfo.almirah);
    let gulAhmed = useSelector(state => state.customizedInfo.gulAhmed);
    let alkarm = useSelector(state => state.customizedInfo.alkarm);
    let diners = useSelector(state => state.customizedInfo.diners);
    let [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState("");
    useEffect(() => {
        let liveScrap = async () => {
            setIsLoading(true);
            await axios.post("/api/products/live-scrape", { word: searchedWord })
                .then(res => {
                    const { Almirah, GulAhmed, Alkaram, Diners } = res.data;
                    dispatch(getScrapedProducts(Almirah, GulAhmed, Alkaram, Diners));
                    dispatch(searchOn());
                    setIsLoading(false);
                }).catch(error => {
                    const { Almirah, GulAhmed, Alkaram, Diners } = error.response.data;
                    setAlert(error.response.data.msg);
                    dispatch(getScrapedProducts(Almirah, GulAhmed, Alkaram, Diners));
                    dispatch(searchOn());
                    setIsLoading(false);
                });
        }
        search && liveScrap();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);
    return <section className="padding-70">
        <Container>
            {isLoading ? <PageSpinner containerHeight="50vh" /> : searchedWord && <div>
                <div>{alert && <Alert variant="danger" onClose={() => setAlert("")} dismissible>
                    <Alert.Heading > Oh snap! You got an error!</Alert.Heading>
                    <p>{alert}</p>
                </Alert>}
                </div>
                {almirah.length > 0 && <div>
                    <h2 className="text-left mb-5">Almirah Products</h2>
                    <Row>
                        {almirah.map((p, i) => {
                            return <Col className="my-4" key={i} lg={3} md={4} sm={6}>
                                <ScrapPCard product={p} />
                            </Col>
                        }
                        )}
                    </Row>
                    <hr />
                </div>}

                {gulAhmed.length > 0 && <div>
                    <h2 className="text-left my-5">Gul Ahmed Products</h2>
                    <Row>
                        {gulAhmed.map((p, i) => {
                            return <Col className="my-4" key={i} lg={3} md={4} sm={6}>
                                <ScrapPCard product={p} />
                            </Col>
                        }
                        )}
                    </Row>
                    <hr />
                </div>}

                {alkarm.length > 0 && <div>
                    <h2 className="text-left my-5">Alkaram Products</h2>
                    <Row>
                        {alkarm.map((p, i) => {
                            return <Col className="my-4" key={i} lg={3} md={4} sm={6}>
                                <ScrapPCard product={p} />
                            </Col>
                        }
                        )}
                    </Row>
                    <hr />
                </div>}
                {diners.length > 0 && <div>
                    <h2 className="text-left my-5">Diners Products</h2>
                    <Row>
                        {diners.map((p, i) => {
                            return <Col className="my-4" key={i} lg={3} md={4} sm={6}>
                                <ScrapPCard product={p} />
                            </Col>
                        }
                        )}
                    </Row>
                </div>}
            </div>
            }
        </Container>
    </section>
}

export default Search;