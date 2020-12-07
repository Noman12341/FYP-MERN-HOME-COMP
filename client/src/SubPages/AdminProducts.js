import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Alert, Table, Card, Image, Button, Modal, Form, Spinner } from 'react-bootstrap';
import axios from 'axios';
import { store } from 'react-notifications-component';
import { useHistory } from 'react-router-dom';

function AdminProducts() {
    const history = useHistory();
    const [products, setProducts] = useState([]);
    const [auctionProducts, setAuctionProducts] = useState([]);
    const [form, setForm] = useState({
        name: "",
        brand: "",
        catagory: "Men",
        price: 0,
        emailMarketing: false,
        description: "",
        date: "",
        link: "",
        searchingBrand: "Almirah"
    });
    const [alert, setAlert] = useState("");
    const [image, setImage] = useState(undefined);
    const [showModal1, setModal1] = useState(false);
    const [showModal2, setModal2] = useState(false);
    const [showModal3, setModal3] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function fetchAllProducts() {
            await axios.get("/api/admin/fetchAllProducts", { headers: { "x-admin-token": localStorage.getItem('adminToken') } })
                .then(res => {
                    setProducts(res.data.simpleProducts);
                    setAuctionProducts(res.data.auctionProducts);
                }).catch(error => {
                    if (error.response.status === 401 || error.response.status === 400) {
                        history.push("/adminAuth");
                    }
                });
        }
        // initialize fetchAllProducts function
        fetchAllProducts();
    }, [history]);

    async function deleteScrapedProduct(productID) {
        await axios.get("/api/admin/deleteScrapedProduct/" + productID)
            .then(res => {
                setProducts(products.filter(value => value._id !== productID));
            }).catch(error => {
                console.log(error);
                store.addNotification({
                    title: "Error!",
                    message: "Product is not deleted Successfully.",
                    type: "danger",
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
            });
    }

    async function deleteProduct(productID, imageName) {
        await axios.get("/api/admin/deleteProduct/" + productID + "/" + imageName)
            .then(res => {
                setProducts(products.filter(value => value._id !== productID));
            }).catch(error => {
                console.log(error.response);
                store.addNotification({
                    title: "Error!",
                    message: "Product is not deleted Successfully.",
                    type: "danger",
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
            });
    }

    async function deleteAuctionProduct(itemID, imageName) {
        await axios.get("/api/admin/deleteAuctionProduct/" + itemID + "/" + imageName)
            .then(res => {
                setAuctionProducts(auctionProducts.filter(value => value._id !== itemID));
            }).catch(error => {
                store.addNotification({
                    title: "Error!",
                    message: error.response.data.msg,
                    type: "danger",
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
            });
    }
    // Handle Form 
    function handleChange(event) {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    }
    function handleFile(event) {
        setImage(event.target.files[0]);
    }

    async function addSimpleProduct(e) {
        e.preventDefault();
        setIsLoading(true);
        const newForm = new FormData();
        newForm.append("name", form.name);
        newForm.append("brand", form.brand);
        newForm.append("catagory", form.catagory);
        newForm.append("description", form.description);
        newForm.append("price", form.price);
        newForm.append("image", image);
        newForm.append("emailMarketing", form.emailMarketing);

        await axios.post("/api/admin/addSimpleProduct", newForm)
            .then(res => {
                // setAlert(res.data.msg);
                setIsLoading(false);
                setModal1(false);
                setForm({
                    name: "",
                    brand: "",
                    catagory: "Men",
                    price: 0,
                    emailMarketing: false,
                    description: "",
                    date: "",
                    link: "",
                    searchingBrand: "Almirah"
                });
            }).catch(error => {
                setIsLoading(false)
                setAlert(error.response.data.msg);
                setForm({
                    name: "",
                    brand: "",
                    catagory: "Men",
                    price: 0,
                    emailMarketing: false,
                    description: "",
                    date: "",
                    link: "",
                    searchingBrand: "Almirah"
                });
            });
    }

    const addAuctionProduct = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const newForm = new FormData();
        newForm.append("name", form.name);
        newForm.append("brand", form.brand);
        newForm.append("catagory", form.catagory);
        newForm.append("description", form.description);
        newForm.append("price", form.price);
        newForm.append("image", image);
        newForm.append("emailMarketing", form.emailMarketing);
        newForm.append("date", form.date);
        await axios.post("/api/admin/addAuctionProduct", newForm)
            .then(res => {
                setIsLoading(false);
                setModal2(false);
                setForm({
                    name: "",
                    brand: "",
                    catagory: "Men",
                    price: 0,
                    emailMarketing: false,
                    description: "",
                    date: "",
                    link: "",
                    searchingBrand: "Almirah"
                });

            }).catch(error => {
                setIsLoading(false);
                setAlert(error.response.data.msg);
                setForm({
                    name: "",
                    brand: "",
                    catagory: "Men",
                    price: 0,
                    emailMarketing: false,
                    description: "",
                    date: "",
                    link: "",
                    searchingBrand: "Almirah"
                });
            });
    }
    // scraping modal post req
    const startScraping = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        await axios.post("/api/admin/ScrapProducts", { searchingBrand: form.searchingBrand, url: form.link })
            .then(res => {
                setIsLoading(false)
                setModal3(false)
                setForm({
                    name: "",
                    brand: "",
                    catagory: "Men",
                    price: 0,
                    emailMarketing: false,
                    description: "",
                    date: "",
                    link: "",
                    searchingBrand: "Almirah"
                })
            }).catch(error => {
                setIsLoading(false)
                setAlert(error.response.data.msg)
                setForm({
                    name: "",
                    brand: "",
                    catagory: "Men",
                    price: 0,
                    emailMarketing: false,
                    description: "",
                    date: "",
                    link: "",
                    searchingBrand: "Almirah"
                })
            });
    }

    let onHideModal1 = () => {
        setAlert("");
        setModal1(false);
    }
    let onHideModal2 = () => {
        setAlert("");
        setModal2(false);
    }
    let onHideModal3 = () => {
        setAlert("");
        setModal3(false);
    }
    return <Container fluid>
        <Row>
            <Col lg={12}>
                <Card>
                    <Card.Header>
                        <h4 className="card-title">Products table</h4>
                        <p className="card-para">It Shows all the products that u posted on the website.</p>
                    </Card.Header>
                    <Card.Body>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Brand</th>
                                    <th>Image</th>
                                    <th>Price</th>
                                    <th>Options</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product, index) => {
                                    return <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{product.name}</td>
                                        <td>{product.brand}</td>
                                        <td><Image src={product.isMyProduct ? "/static/images/" + product.image : product.image} className="table-image" /></td>
                                        <td>{product.price}</td>
                                        {product.isMyProduct.toString() === "true" ? <td><Button bsPrefix="delete-btn" type="button" onClick={() => deleteProduct(product._id, product.image)}><i className="far fa-trash-alt"></i></Button></td> :
                                            <td><Button bsPrefix="delete-btn" type="button" onClick={() => deleteScrapedProduct(product._id)}><i className="far fa-trash-alt"></i></Button></td>}
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
                        <Button type="button" onClick={() => setModal1(true)}>Add Product</Button>
                        <Button className="mx-4" type="button" onClick={() => setModal2(true)}>Add Auction Product</Button>
                        <Button type="button" onClick={() => setModal3(true)}>Do webscrapping</Button>
                    </Card.Body>
                </Card>

            </Col>
            <Col lg={12} className="">
                <Card>
                    <Card.Header>
                        <h4 className="card-title">Auction Products table</h4>
                        <p className="card-para">It contains all the Auction Products that u posted on the website.</p>
                    </Card.Header>
                    <Card.Body>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Brand</th>
                                    <th>Image</th>
                                    <th>Init Price</th>
                                    <th>Curr Price</th>
                                    <th>Options</th>
                                </tr>
                            </thead>
                            <tbody>
                                {auctionProducts.map((product, index) => {
                                    return <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{product.name}</td>
                                        <td>{product.brand}</td>
                                        <td><Image src={"/static/images/" + product.image} className="table-image" /></td>
                                        <td>{product.initialPrice}</td>
                                        <td>{product.currentPrice}</td>
                                        <td> <Button bsPrefix="delete-btn" type="button" onClick={() => deleteAuctionProduct(product._id, product.image)}><i className="far fa-trash-alt"></i></Button></td>
                                    </tr>
                                })}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
        {/* Modals for adding Simple Products */}
        <Modal size="lg" show={showModal1} onHide={onHideModal1} animation={false}>
            <Modal.Header>
                <Modal.Title>Add Simple Product</Modal.Title>
            </Modal.Header>
            <Form onSubmit={addSimpleProduct}>
                <Modal.Body>
                    {alert && <Alert variant="warning">{alert}</Alert>}
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" name="name" value={form.name} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Brand</Form.Label>
                            <Form.Control type="text" name="brand" value={form.brand} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Catagory</Form.Label>
                            <Form.Control as="select" className="mr-sm-2" name="catagory" onChange={handleChange} custom>
                                <option value="Men">Men</option>
                                <option value="Women">Women</option>
                                <option value="Electronics">Electronics</option>
                            </Form.Control>
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.File label="Select Image" type="file" name="Image" onChange={handleFile} required />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Price</Form.Label>
                            <Form.Control type="number" name="price" value={form.price} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Email Marketing</Form.Label>
                            <Form.Control as="select" className="mr-sm-2" name="emailMarketing" onChange={handleChange} custom>
                                <option value={false}>Off</option>
                                <option value={true}>On</option>
                            </Form.Control>
                        </Form.Group>
                    </Form.Row>
                    <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows={4} name="description" value={form.description} onChange={handleChange} required />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHideModal1}>Close</Button>
                    <Button variant="primary" type="submit">{isLoading ? <Spinner animation="border" role="status">
                    </Spinner> : "Save Changes"}</Button>
                </Modal.Footer>
            </Form>
        </Modal>

        {/* Modal for adding Auction Products */}
        <Modal size="lg" show={showModal2} onHide={onHideModal2} animation={false}>
            <Modal.Header>
                <Modal.Title>Add Auction Product</Modal.Title>
            </Modal.Header>
            <Form onSubmit={addAuctionProduct}>
                <Modal.Body>
                    {alert && <Alert variant="warning">{alert}</Alert>}
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" name="name" value={form.name} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Brand</Form.Label>
                            <Form.Control type="text" name="brand" value={form.brand} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Catagory</Form.Label>
                            <Form.Control as="select" className="mr-sm-2" name="catagory" onChange={handleChange} custom>
                                <option value="Men">Men</option>
                                <option value="Women">Women</option>
                                <option value="Electronics">Electronics</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Date</Form.Label>
                            <Form.Control className="mr-sm-2" type="date" name="date" onChange={handleChange} required />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.File label="Select Image" type="file" name="Image" onChange={handleFile} required />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Price</Form.Label>
                            <Form.Control type="number" name="price" value={form.price} onChange={handleChange} required />
                        </Form.Group>

                        <Form.Group as={Col}>
                            <Form.Label>Email Marketing</Form.Label>
                            <Form.Control as="select" className="mr-sm-2" name="emailMarketing" onChange={handleChange} custom>
                                <option value={false}>Off</option>
                                <option value={true}>On</option>
                            </Form.Control>
                        </Form.Group>
                    </Form.Row>
                    <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows={4} name="description" value={form.description} onChange={handleChange} required />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHideModal2}>Close</Button>
                    <Button variant="primary" type="submit">{isLoading ? <Spinner animation="border" role="status">
                    </Spinner> : "Save Changes"}</Button>
                </Modal.Footer>
            </Form>
        </Modal>
        {/* Modal for Adding Webscraping */}
        <Modal size="lg" show={showModal3} onHide={onHideModal3} animation={false}>
            <Modal.Header>
                <Modal.Title>Scrap Products</Modal.Title>
            </Modal.Header>
            <Form onSubmit={startScraping}>
                <Modal.Body>
                    {alert && <Alert variant="warning">{alert}</Alert>}
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>Choose Brand</Form.Label>
                            <Form.Control as="select" className="mr-sm-2" name="searchingBrand" onChange={handleChange} custom>
                                <option value="Almirah">Almirah</option>
                                <option value="Sana Safinaz">Sana Safinaz</option>
                                <option value="Gul Ahmed">Gul Ahmed</option>
                                <option value="Diners">Diners</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Enter Link plz</Form.Label>
                            <Form.Control type="text" name="link" value={form.link} onChange={handleChange} />
                        </Form.Group>
                    </Form.Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHideModal3}>Close</Button>
                    <Button variant="primary" type="submit">{isLoading ? <Spinner animation="border" role="status"></Spinner> : "Save Changes"}</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    </Container>;
}
export default AdminProducts;