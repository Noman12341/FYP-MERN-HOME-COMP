import React from 'react';
import { Card } from 'react-bootstrap';
function AdminCard(props) {
    const { count, about, icon } = props;
    return <Card style={{ boxShadow: "0 2px 4px 0 rgba(0,0,0,.2)" }}>
        <Card.Body>
            <div style={{ display: "flex", textAlign: "center" }}>
                <div style={{ flex: "1" }}>
                    <h3>{count}</h3>
                    <h6>{about}</h6>
                </div>
                <div style={{ flex: "1" }}>
                    <div className="admin-card-box"><i className={icon}></i></div>
                </div>
            </div>
        </Card.Body>
    </Card>
}
export default AdminCard;