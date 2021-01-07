import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button } from 'react-bootstrap';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function AdminUsers() {
    const history = useHistory();
    const [users, setUsers] = useState([])
    useEffect(() => {
        const fetchUsers = async () => {
            await axios.get("/api/admin/fetchUsers", { headers: { "x-admin-token": localStorage.getItem('adminToken') } })
                .then(res => {
                    setUsers(res.data.users)
                }).catch(error => {
                    if (error.response.status === 401 || error.response.status === 400) {
                        history.push("/adminAuth");
                    }
                });
        }
        fetchUsers();
    }, [history]);
    const handleDelete = async userID => {
        await axios.delete('/api/admin/delete-user/' + userID)
            .then(res => {
                setUsers(users.filter(item => item._id !== userID));
            }).catch(error => {
                console.log(error.response.data.msg);
            });
    }
    return <Container fluid>
        <Row>
            <Col lg={12}>
                <Card>
                    <Card.Header>
                        <h4 className="card-title">Users table</h4>
                        <p className="card-para">It Shows all the users that you have on the website.</p>
                    </Card.Header>
                    <Card.Body>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>email</th>
                                    <th>isAdmin</th>
                                    <th>Date</th>
                                    <th>Options</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => {
                                    return <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{user.name}</td>
                                        <td>{user.email}</td>
                                        <td>{user.isAdmin.toString()}</td>
                                        <td>{user.date}</td>
                                        <td><Button bsPrefix="delete-btn" type="button" onClick={() => handleDelete(user._id)} ><i className="far fa-trash-alt"></i></Button></td>
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
export default AdminUsers;