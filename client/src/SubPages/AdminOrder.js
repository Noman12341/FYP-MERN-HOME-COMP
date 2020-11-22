import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button } from 'react-bootstrap';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function AdminOrders() {
    const history = useHistory();
    const [orders, setOrders] = useState([])
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
    }, [history]);
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
                                    <th>email</th>
                                    <th>Phone</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order, index) => {
                                    return <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{order.name}</td>
                                        <td>{order.email}</td>
                                        <td>{order.amount}</td>
                                        <td><Button bsPrefix="delete-btn" type="button" onClick={() => handleDelete(order._id)} ><i className="far fa-trash-alt"></i></Button></td>
                                    </tr>
                                })}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </Container>;
}
export default AdminOrders;