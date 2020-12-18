import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Card } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import Spinner from '../Components/Spinner';
import axios from 'axios';
function ActiveEmailSuccess() {
    const { token } = useParams();
    console.log(token)
    const [alert, setAlert] = useState({
        show: false,
        varient: "",
        msg: ""
    });
    const [showHeading, setShowHeading] = useState(false)
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        setIsLoading(true);
        const activeEmail = async () => {
            await axios.put('/api/auth/active-email', { token })
                .then(res => {
                    setShowHeading(true);
                    setAlert({ show: true, varient: "success", msg: res.data.msg });
                    setIsLoading(false);
                }).catch(error => {
                    setAlert({ show: true, varient: "warning", msg: error.response.data.msg });
                    setIsLoading(false);
                });
        }
        activeEmail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return <Container id="auth-container" style={{ height: "100vh", backgroundColor: "#f4f4f4" }} fluid>
        <div className="account-chose-link"><Link to="/">Back to Main Page</Link></div>
        <Row>
            <Col md={6} className="mx-auto">
                <Card>
                    <Card.Body>
                        {showHeading && <Card.Title className="text-center my-3">Email Activated</Card.Title>}
                        {alert.show && <Alert variant={alert.varient}>{alert.msg}</Alert>}
                        {isLoading && <Spinner containerHeight="200px" />}
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </Container>;
}
export default ActiveEmailSuccess;