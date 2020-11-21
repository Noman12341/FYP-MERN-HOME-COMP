import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import AdminCard from '../Components/AdminCard';

function AdminOverView() {
    return <Container fluid>
        <Row>
            <Col lg={3}>
                <AdminCard count="3380" about="Items" icon="fas fa-cubes fa-3x" />
            </Col>
            <Col lg={3}>
                <AdminCard count="2370" about="Auctions" icon="fa fa-buysellads fa-3x" />
            </Col>
            <Col lg={3}>
                <AdminCard count="1390" about="Users" icon="fas fa-users fa-3x" />
            </Col>
            <Col lg={3}>
                <AdminCard count="1390" about="Orders" icon="fas fa-clipboard-list fa-3x" />
            </Col>
        </Row>

    </Container>;
}
export default AdminOverView;