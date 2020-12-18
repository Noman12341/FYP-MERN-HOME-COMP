import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table } from 'react-bootstrap';
import AuctionCard from '../Components/AuctionCard';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../Components/Spinner';
function ViewBids() {
    const { pID } = useParams();
    const [product, setProduct] = useState({});
    const [bids, setBids] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        setIsLoading(true);
        let source = axios.CancelToken.source();
        const fetchDetails = async () => {
            try {
                await axios.get("/api/products/view-bids/" + pID, { cancelToken: source.token })
                    .then(res => {
                        setProduct(res.data.product);
                        setBids(res.data.bids);
                        setIsLoading(false);
                    });
            } catch (error) {
                if (axios.isCancel(error)) {
                    console.log("Axios request Canceled.");
                } else {
                    setIsLoading(false);
                    throw error;
                }
            }
        }
        fetchDetails();
        return () => {
            source.cancel();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return isLoading ? <Spinner containerHeight="70vh" /> : <Container id="viewbid-container" className="p-5" fluid>
        <Row>
            <Col lg={4}>
                <AuctionCard auctionProduct={product} />
            </Col>
            <Col lg={8}>
                <Card className="view-bid-card">
                    <Card.Header>
                        <h4 className="card-title">Bids Table</h4>
                        <p className="card-para">It Shows all the Bids users posted on this specific product.</p>
                    </Card.Header>
                    <Card.Body>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>User Name</th>
                                    <th>Bid</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bids.map((bid, index) => {
                                    return <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{bid.userName}</td>
                                        <td>{bid.bidPrice}</td>
                                        <td>{bid.date}</td>
                                    </tr>
                                })}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </Container>
}
export default ViewBids;