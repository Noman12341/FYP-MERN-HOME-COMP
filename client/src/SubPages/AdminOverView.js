import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import AdminCard from '../Components/AdminCard';
import axios from 'axios';

function AdminOverView() {
    const history = useHistory();
    const [count, setCount] = useState({
        items: "",
        auctions: "",
        users: "",
        orders: ""
    });
    useEffect(() => {
        const fetchCounts = async () => {
            await axios.get("/api/admin/admin-count-modals", { headers: { "x-admin-token": localStorage.getItem('adminToken') } })
                .then(res => {
                    const { items, auctions, users, orders } = res.data;
                    setCount({ items, auctions, users, orders });
                }).catch(error => {
                    if (error.response.status === 401 || error.response.status === 400) {
                        history.push("/adminAuth");
                    }
                });
        }
        fetchCounts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <Container fluid>
        <Row>
            <Col lg={3}>
                <AdminCard count={count.items} about="Items" icon="fas fa-boxes fa-3x" />
            </Col>
            <Col lg={3}>
                <AdminCard count={count.auctions} about="Auctions" icon="fas fa-gavel fa-3x" />
            </Col>
            <Col lg={3}>
                <AdminCard count={count.users} about="Users" icon="fas fa-users fa-3x" />
            </Col>
            <Col lg={3}>
                <AdminCard count={count.orders} about="Orders" icon="fas fa-clipboard-list fa-3x" />
            </Col>
        </Row>

    </Container>;
}
export default AdminOverView;