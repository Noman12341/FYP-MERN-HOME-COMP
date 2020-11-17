import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Image } from 'react-bootstrap';
import axios from 'axios';

function AdminQRCodes() {
    const [codes, setCodes] = useState([]);
    useEffect(() => {
        const getCodes = async () => {
            await axios.get("/api/admin/fetchqrcodes")
                .then(res => {
                    setCodes(res.data.codes);
                }).catch(error => {
                    console.log(error);
                });
        }
        getCodes();
    }, []);
    return <Container fluid>
        <Row>
            <Col lg={12}>
                <Card>
                    <Card.Header>
                        <h4 className="card-title">QRCodes Table</h4>
                        <p className="card-para">It Shows all the QR cide that are preasent in the website.</p>
                    </Card.Header>
                    <Card.Body>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>QRCode</th>
                                    <th>Price</th>
                                    <th>image</th>
                                    <th>Delete</th>
                                </tr>
                            </thead>
                            <tbody>
                                {codes.map((c, i) => {
                                    return <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{c.disCode}</td>
                                        <td>{c.disPrice}</td>
                                        <td><Image src={"/static/QRCodes/" + c.qrCodeImg} className="table-image" /></td>
                                        <td><Button bsPrefix="delete-btn" type="button" ><i className="far fa-trash-alt"></i></Button></td>
                                    </tr>
                                })}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </Container>;;
}
export default AdminQRCodes;