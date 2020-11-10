import React from 'react';
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';

function OrderSuccess() {
    const orderDetail = useSelector(state => state.Order);
    return <div id="order-success">
        <div className="success-card">
            <div className="px-4">
                <div className="text-center success-icon"><i className="my-3 fas fa-check-circle fa-3x"></i></div>
                <h3 className="text-center success-heading">Payment successfull!</h3>
                <div className="d-flex mt-4">
                    <p style={{ flex: "1", }} className="order-detail-thing">Name</p>
                    <p className="order-detial-answer">{orderDetail.name}</p>
                </div>
                <div className="d-flex mt-1">
                    <p style={{ flex: "1", }} className="order-detail-thing">Mobile</p>
                    <p className="order-detial-answer">{orderDetail.phone}</p>
                </div>
                <div className="d-flex mt-1">
                    <p style={{ flex: "1", }} className="order-detail-thing">Email</p>
                    <p className="order-detial-answer">{orderDetail.email}</p>
                </div>
                <div className="d-flex mt-4">
                    <p style={{ flex: "1", color: "#818797" }} className="font-weight-bold">Amount paid</p>
                    <p className="order-detial-answer">{orderDetail.amountPayed}</p>
                </div>
                <div className="d-flex mt-3">
                    <p style={{ flex: "1", color: "#818797" }} className="">Transation ID</p>
                    <p style={{ fontFamily: "sans-serif" }}>{orderDetail.orderID}</p>
                </div>
                <div className="text-center mt-3"><Link to="/" className="order-success-btn">Home</Link></div>
            </div>
        </div>
    </div>
}
export default OrderSuccess;