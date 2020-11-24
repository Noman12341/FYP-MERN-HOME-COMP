import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Image, Modal, Alert, Form, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
function AdminQRCodes() {
    const history = useHistory();
    const [codes, setCodes] = useState([]);
    // const [showModal, setModal] = useState(false);
    const [showModal, setModal] = useState({
        modal1: false,
        modal2: false
    })
    const [isLoading, setIsLoading] = useState(false);
    const [alert, setAlert] = useState("");
    const [form, setForm] = useState({
        disPrice: "",
        qrcodeNo: ""
    });
    useEffect(() => {
        const getCodes = async () => {
            await axios.get("/api/admin/fetchqrcodes", { headers: { "x-admin-token": localStorage.getItem('adminToken') } })
                .then(res => {
                    setCodes(res.data.codes);
                }).catch(error => {
                    if (error.response.status === 401 || error.response.status === 400) {
                        history.push("/adminAuth");
                    }
                });
        }
        getCodes();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // below 4 lines handle modals show and close
    const closeModal1 = () => setModal({ ...showModal, modal1: false });
    const showModal1 = () => setModal({ ...showModal, modal1: true });
    const closeModal2 = () => setModal({ ...showModal, modal2: false });
    const showModal2 = () => setModal({ ...showModal, modal2: true });
    const handleChange = event => setForm({ ...form, [event.target.name]: event.target.value });
    const onSubmitForm = async event => {
        event.preventDefault();
        setIsLoading(true);
        await axios.post("/api/admin/post-qrcodes-users", { ...form })
            .then(res => {
                setForm({ disPrice: "", qrcodeNo: "" });
                setIsLoading(false);
                setAlert(res.data.msg);
            }).catch(error => {
                setForm({ disPrice: "", qrcodeNo: "" });
                setIsLoading(false);
                setAlert(error.response.data.msg);
            });
    }

    const onSubmitForm2 = async event => {
        event.preventDefault();
        setIsLoading(true);
        await axios.post("/api/admin/gen-qrcodes", { ...form })
            .then(res => {
                setForm({ disPrice: "", qrcodeNo: "" });
                setIsLoading(false);
                setAlert(res.data.msg);
            }).catch(error => {
                setForm({ disPrice: "", qrcodeNo: "" });
                setIsLoading(false);
                setAlert(error.response.data.msg);
            });
    }
    // delete code without images
    const handleDeleteNoImage = async codeID => {
        await axios.delete('/api/admin/delete-qrcode-no-image/' + codeID)
            .then(res => {
                setCodes(codes.filter(code => code._id !== codeID));
            }).catch(error => {
                console.log(error);
            });
    }
    // delete code without images
    const handleDeleteWithImage = async (codeID, imgName) => {
        await axios.delete('/api/admin/delete-qrcode-with-image/' + codeID + "/" + imgName)
            .then(res => {
                setCodes(codes.filter(code => code._id !== codeID));
            }).catch(error => {
                console.log(error);
            });
    }
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
                                    <th>User Email</th>
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
                                        <td>{c.userEmail ? c.userEmail : null}</td>
                                        <td>{c.disPrice}</td>
                                        <td>{c.qrCodeImg ? <Image src={"/static/QRCodes/" + c.qrCodeImg} className="table-image" /> : null}</td>
                                        <td>{c.qrCodeImg ? <Button bsPrefix="delete-btn" type="button" onClick={() => handleDeleteWithImage(c._id, c.qrCodeImg)}><i className="far fa-trash-alt"></i></Button> :
                                            <Button bsPrefix="delete-btn" type="button" onClick={() => handleDeleteNoImage(c._id)}><i className="far fa-trash-alt"></i></Button>}</td>
                                    </tr>
                                })}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </Col>
            <Col lg={12} className="text-center my-3">
                <Card>
                    <Card.Body>
                        <Button type="button" onClick={showModal1}>Add QRCodes</Button>
                        <Button type="button" className="mx-4" onClick={showModal2}>Add QRCodes</Button>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
        <Modal size="lg" show={showModal.modal1} onHide={closeModal1} animation={false}>
            <Modal.Header>
                <Modal.Title>Generate QRCodes with QRCode Image</Modal.Title>
            </Modal.Header>
            <Form onSubmit={onSubmitForm}>
                <Modal.Body>
                    {alert && <Alert variant="warning">{alert}</Alert>}
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>Add Discount Price</Form.Label>
                            <Form.Control type="number" name="disPrice" value={form.disPrice} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Number of code</Form.Label>
                            <Form.Control type="text" name="qrcodeNo" value={form.qrcodeNo} onChange={handleChange} required />
                        </Form.Group>
                    </Form.Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal1}>Close</Button>
                    <Button variant="primary" type="submit">{isLoading ? <Spinner animation="border" role="status"></Spinner> : "Save Changes"}</Button>
                </Modal.Footer>
            </Form>
        </Modal>
        <Modal size="lg" show={showModal.modal2} onHide={closeModal2} animation={false}>
            <Modal.Header>
                <Modal.Title>Generate QRCodes only not qrCode images</Modal.Title>
            </Modal.Header>
            <Form onSubmit={onSubmitForm2}>
                <Modal.Body>
                    {alert && <Alert variant="warning">{alert}</Alert>}
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>Add Discount Price</Form.Label>
                            <Form.Control type="number" name="disPrice" value={form.disPrice} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Number of code</Form.Label>
                            <Form.Control type="text" name="qrcodeNo" value={form.qrcodeNo} onChange={handleChange} required />
                        </Form.Group>
                    </Form.Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal2}>Close</Button>
                    <Button variant="primary" type="submit">{isLoading ? <Spinner animation="border" role="status"></Spinner> : "Save Changes"}</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    </Container>;;
}
export default AdminQRCodes;