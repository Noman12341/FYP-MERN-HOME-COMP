import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import Comment from '../Components/Comment';
import StarRating from '../Components/StartRating';
import axios from 'axios';
import { store } from 'react-notifications-component';

function CommentSection({ productID, isAuctionPro }) {
    const userName = localStorage.getItem("userName");
    const [comments, setComments] = useState([]);
    const [rating, setRating] = useState(0);
    const [msg, setMsg] = useState("");
    const [run, setRun] = useState(false);
    const url = isAuctionPro === "true" ? "/api/products/postComment-auction-product/" + productID : "/api/products/postComment/" + productID;
    useEffect(() => {
        const source = axios.CancelToken.source();

        const fetchComments = async () => {
            try {
                await axios.get("/api/products/fetchComments/" + productID, { cancelToken: source.token })
                    .then(res => {
                        setComments(res.data.comments);
                    });
            } catch (error) {
                if (axios.isCancel(error)) {
                    console.log("Axios request Canceled.");
                } else { throw error; }
            }

        }
        fetchComments();

        return () => {
            source.cancel();
        }
    }, [productID, run]);


    const handleChange = (value) => {
        setRating(value);
    }
    function handleMsg(event) {
        setMsg(event.target.value)
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        await axios.post(url, { userName: localStorage.getItem("userName"), comment: msg, rating })
            .then(res => {
                if (res.status === 200) {
                    store.addNotification({
                        title: "Wonderfull!",
                        message: "Message Successfully added.",
                        type: "success",
                        insert: "top",
                        container: "top-right",
                        animationIn: ["animate__animated", "animate__fadeIn"],
                        animationOut: ["animate__animated", "animate__fadeOut"],
                        dismiss: {
                            duration: 5000,
                            onScreen: true,
                            pauseOnHover: true
                        }
                    });
                    setRating(0);
                    setMsg("");
                    setRun(!run);
                }
            }).catch(error => {
                store.addNotification({
                    title: "Wonderfull!",
                    message: "Your massage is not added.",
                    type: "danger",
                    insert: "top",
                    container: "center",
                    animationIn: ["animate__animated", "animate__fadeIn"],
                    animationOut: ["animate__animated", "animate__fadeOut"],
                    dismiss: {
                        duration: 5000,
                        onScreen: true,
                        pauseOnHover: true
                    }
                });
            });
    }
    return <Container fluid id="comment-section">
        <Row>
            <Col lg={6} className="my-2 pl-4">
                {comments.map((comment, index) => {
                    return <Comment key={index} userName={comment.userName} time={comment.date} msg={comment.comment} rating={comment.rating} />
                })}
            </Col>
            <Col lg={6} className="p-3">
                <h3>{userName ? "Write your comment here" : "Login to post your comment below."}</h3>
                {userName && <Form className="mr-2" onSubmit={handleSubmit}>
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Control as="textarea" value={msg} onChange={handleMsg} rows="4" />
                    </Form.Group>
                    <div><span className="star-rating-heading">Your Rating :</span> <StarRating
                        count={5}
                        size={30}
                        value={rating}
                        activeColor={'#ffd613'}
                        inactiveColor={'#ddd'}
                        onChange={handleChange} /></div>
                    <div><Button bsPrefix="rating-submit" type="submit">Submit</Button></div>
                </Form>}
            </Col>
        </Row>
    </Container>
}
export default CommentSection;