import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Alert, Form, Button } from 'react-bootstrap';
import ProductCard from '../Components/ProductCard';
import axios from 'axios';
import PageSpinner from '../Components/Spinner';
import { useParams } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
function BrandProducts() {
    const { brand } = useParams();
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState("");
    const [tempArr, setTempArr] = useState([]);
    const [word, setWord] = useState("");
    useEffect(() => {
        const fetchScrap = async () => {
            setIsLoading(true);
            setAlert("");
            await axios.get("/api/products/fetchBrand/" + brand)
                .then(res => {
                    setItems(res.data.items);
                    setTempArr(res.data.items);
                    setIsLoading(false);
                }).catch(error => {
                    setAlert(error.response.data.msg);
                    setIsLoading(false);
                });
        }
        fetchScrap();
    }, [brand]);
    const handleFilter = (e) => {
        e.preventDefault();
        let newArr = tempArr.filter(el => el.name.toLowerCase().includes(word.toLowerCase()));
        console.log(newArr);
        console.log(word);
        setItems(newArr);
    }
    return <section className="section-top-shadow padding-70">
        <Container>
            <div className="d-flex"><h2 className="text-left mb-5" style={{ flex: "2" }}>Products</h2><div style={{ flex: "1" }}><Form onSubmit={handleFilter} inline><Form.Control type="search" bsPrefix="filter-search" placeholder="Search" onChange={e => setWord(e.target.value)} value={word} required /><Button type="submit" bsPrefix="search-btn"><FaSearch /></Button></Form></div></div>
            {isLoading ? <PageSpinner containerHeight="50vh" /> : alert ? <Alert variant="dark" onClose={() => setAlert("")} dismissible>
                <Alert.Heading > Oh snap! You got an error!</Alert.Heading>
                <p>{alert}</p>
            </Alert> : <Row>
                    {items.map((product, index) => {
                        return <Col className="my-4" key={index} lg={3} md={4} sm={6}>
                            <ProductCard product={product} />
                        </Col>
                    })}
                </Row>}
        </Container>
    </section>
}
export default BrandProducts;