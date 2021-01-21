import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Image } from 'react-bootstrap';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function AdminOrders() {
    const history = useHistory();
    const [orders, setOrders] = useState([]);
    const [pd, setPD] = useState({});
    const [run, setRun] = useState(false);
    useEffect(() => {
        const fetchUsers = async () => {
            await axios.get("/api/admin/fetchOrders", { headers: { "x-admin-token": localStorage.getItem('adminToken') } })
                .then(res => {
                    setOrders(res.data.orders)
                }).catch(error => {
                    if (error.response.status === 401 || error.response.status === 400) {
                        history.push("/adminAuth");
                    }
                });
        }
        fetchUsers();
    }, [history, run]);
    const handleOrderComplete = async id => {
        await axios.put("/api/admin/deliver-order/" + id)
            .then(res => {
                setRun(!run);
            }).catch(error => {
                console.log(error.response.data.msg);
            });
    }
    const handleDelete = async orderID => {
        await axios.delete('/api/admin/delete-order/' + orderID)
            .then(res => {
                setOrders(orders.filter(order => order._id !== orderID));
            }).catch(error => {
                console.log(error);
            });
    }
    return <Container fluid>
        <Row>
            <Col lg={12}>
                <Card>
                    <Card.Header>
                        <h4 className="card-title">Orders table</h4>
                        <p className="card-para">It Shows all the Orders that you have on the website.</p>
                    </Card.Header>
                    <Card.Body>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Total Items</th>
                                    <th>IsDelivered</th>
                                    <th>isPayCompleted</th>
                                    <th>Show Detail</th>
                                    <th>Delivered</th>
                                    <th>Remove</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order, index) => {
                                    return <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{order.name}</td>
                                        <td>{order.items.length}</td>
                                        <td>{String(order.isDelivered)}</td>
                                        <td>{String(order.isPayCompleted)}</td>
                                        <td><Button variant="primary" onClick={() => setPD(order)}>detail</Button></td>
                                        <td>{order.isDelivered ? "Delivered" : <Button variant="primary" onClick={() => handleOrderComplete(order._id)}>Deliver</Button>}</td>
                                        <td><Button bsPrefix="delete-btn" type="button" onClick={() => handleDelete(order._id)} ><i className="far fa-trash-alt"></i></Button></td>
                                    </tr>
                                })}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
        {/* show details to admin using below code */}
        <Row className="mt-4">
            <Col lg={12}>
                <Card>
                    <Card.Header>
                        <h4 className="card-title">Details</h4>
                        <p className="card-para">It Shows all the Orders that you have on the website.</p>
                    </Card.Header>
                    {pd.name && <Card.Body>
                        <Row>
                            <Col lg={6}>
                                <h4>Name</h4>
                                <h6>{pd.name}</h6>
                                <h4>Email</h4>
                                <h6>{pd.email}</h6>
                                <h4>Phone No.</h4>
                                <h6>{pd.phone}</h6>
                                <h4>Address</h4>
                                <h6>{pd.address.line1}</h6>
                                <h4>Total Amount paid</h4>
                                <h6>{pd.amount}</h6>
                            </Col>
                            <Col lg={6} className="p-detail-scroll">
                                {pd.items.map((p, i) => {
                                    return <div key={i} className="d-flex my-4" style={{ border: "2px solid #f4f4f4" }}>
                                        <div><Image src={p.isMyProduct ? "/static/images/" + p.image : p.image} height="70" width="70" /></div>
                                        <div className="mx-3 d-flex align-items-center" style={{ flex: "1" }}>
                                            <h6 className="">{p.name}</h6>
                                        </div>
                                        <div>
                                            <h6>{p.units} x {p.price}</h6>
                                            <span>total : {p.total}</span>
                                        </div>
                                        {p.size && <div>
                                            <span>Size : {p.size}</span>
                                        </div>}
                                    </div>
                                })}
                            </Col>
                        </Row>
                    </Card.Body>}
                </Card>
            </Col>
        </Row>
    </Container>;
}
export default AdminOrders;