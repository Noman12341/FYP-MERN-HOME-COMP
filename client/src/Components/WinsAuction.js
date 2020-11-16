import Axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Alert } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { AddItemInCart } from '../Actions/MyCartActions';

function WinsAuction() {
    const dispatch = useDispatch();
    const [auctionProduct, setProduct] = useState({});

    // let userID = localStorage.getItem("userID");
    let userID = localStorage.getItem("userID");

    useEffect(() => {
        async function FetchWin() {
            await Axios.post("/api/products/fetchFinishedAuction", { userID })
                .then(res => {
                    if (res.status === 200) {
                        if (res.data.finishedAuction) {
                            setProduct(res.data.finishedAuction);
                        }
                        const { productID, productName, productImg, productPrice, isMyProduct } = res.data.finishedAuction;

                        const product = { _id: productID, name: productName, image: productImg, price: productPrice, isMyProduct }
                        dispatch(AddItemInCart(product));
                        console.log(res.data);
                    }
                }).catch(error => {
                    if (error.response.status === 400) {
                        setProduct({});
                    }
                });
        }
        if (userID && Object.keys(auctionProduct).length === 0) {
            FetchWin();
        }
    }, []);
    return Object.keys(auctionProduct).length === 0 ? null : <Alert variant="success" className="mb-0">U wins the auction Now pay the price.</Alert>
}
export default WinsAuction;