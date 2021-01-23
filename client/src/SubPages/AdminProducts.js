import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Alert, Table, Card, Image, Button, Modal, Form, Spinner } from 'react-bootstrap';
import { GrDocumentUpdate } from 'react-icons/gr';
import axios from 'axios';
import { store } from 'react-notifications-component';
import { useHistory } from 'react-router-dom';

function AdminProducts() {
    const history = useHistory();
    const [products, setProducts] = useState([]);
    const [auctionProducts, setAuctionProducts] = useState([]);
    const [filterPEmail, setFilterP] = useState([]);
    const [update, setUpDate] = useState({
        _id: "",
        name: "",
        brand: "",
        catagory: "Men",
        price: "",
        description: "",
        date: "",
    });
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
    const [showModal4, setModal4] = useState(false);
    const [showModal5, setModal5] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [run, setRun] = useState(false);

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
    }, [history, run]);

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
        await axios.post("/api/admin/ScrapProducts", { searchingBrand: form.searchingBrand, url: form.link, catagory: form.catagory })
            .then(res => {
                setIsLoading(false);
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
                setModal3(false);
            }).catch(error => {
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
                setIsLoading(false)
            });
    }

    // function for send products arr for email marketing to node js
    const handleEmailMarSubmit = async e => {
        e.preventDefault();
        setIsLoading(true);
        const tempArr = filterPEmail.filter(p => p.isChecked === true);
        await axios.post('/api/admin/email-marketing', { items: tempArr })
            .then(res => {
                setAlert("");
                setModal4(false);
                setIsLoading(false);
            }).catch(error => {
                setAlert("Error, check console for more detail.");
                console.log(error);
                setIsLoading(false);
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
    let onHideModal4 = () => {
        setAlert("");
        setModal4(false);
    }
    let onHideModal5 = () => {
        setAlert("");
        setModal5(false);
    }
    const showEmailMarModal = () => {
        const newItems = products.filter(p => p.isMyProduct === true);
        const checkItems = newItems.map(i => {
            return { isChecked: false, ...i }
        });
        if (auctionProducts.length > 0) {
            const checkedAuc = auctionProducts.map(i => {
                return { isChecked: false, ...i }
            })
            setFilterP([...checkItems, ...checkedAuc]);
        }
        setModal4(true);
    }
    const handleChangeUpdate = e => {
        setUpDate({ ...update, [e.target.name]: e.target.value });
    }
    const showUpdateModal = (p) => {
        const { _id, name, brand, catagory, description, initialPrice, auctionEndingDate } = p;
        setUpDate({ _id, name, brand, catagory, description, price: initialPrice, date: auctionEndingDate });
        setModal5(true);
    }
    const handleSubmitUpdate = async e => {
        e.preventDefault();
        setIsLoading(true);
        await axios.post("/api/admin/update-auction", { ...update })
            .then(res => {
                setIsLoading(false);
                setModal5(false);
                setRun(!run);
            }).catch(error => {
                setAlert(error.response.data.msg);
                setIsLoading(false);
            });
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
                                {products.filter(p => p.isMyProduct).map((p, i) => {
                                    return <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{p.name}</td>
                                        <td>{p.brand}</td>
                                        <td><Image src={"/static/images/" + p.image} className="table-image" /></td>
                                        <td>{p.price}</td>
                                        <td><Button bsPrefix="delete-btn" type="button" onClick={() => deleteProduct(p._id, p.image)}><i className="far fa-trash-alt"></i></Button></td>
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
                        <Button type="button" className="ml-4" onClick={showEmailMarModal}>Email Marketing</Button>
                    </Card.Body>
                </Card>

            </Col>
            <Col lg={12}>
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
                                        <td> <Button bsPrefix="delete-btn" type="button" onClick={() => deleteAuctionProduct(product._id, product.image)}><i className="far fa-trash-alt"></i></Button>
                                            <Button bsPrefix="delete-btn" className="ml-1" type="button" onClick={() => showUpdateModal(product)}><GrDocumentUpdate /></Button>
                                        </td>
                                    </tr>
                                })}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </Col>
            <Col lg={12} className="mt-5">
                <Card>
                    <Card.Header>
                        <h4 className="card-title">Brands Products table</h4>
                        <p className="card-para">It contains all the other Brands Products that u scraped on the website.</p>
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
                                {products.filter(p => p.isMyProduct === false).map((p, i) => {
                                    return <tr key={i}>
                                        <td>{i + 1}</td>
                                        <td>{p.name}</td>
                                        <td>{p.brand}</td>
                                        <td><Image src={p.image} className="table-image" /></td>
                                        <td>{p.price}</td>
                                        <td><Button bsPrefix="delete-btn" type="button" onClick={() => deleteScrapedProduct(p._id)}><i className="far fa-trash-alt"></i></Button></td>
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
                            <Form.Control className="mr-sm-2" type="datetime-local" name="date" onChange={handleChange} required />
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
        {/* Modal for adding updating Auction Products */}
        <Modal size="lg" show={showModal5} onHide={onHideModal5} animation={false}>
            <Modal.Header>
                <Modal.Title>Update Auction Product</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmitUpdate}>
                <Modal.Body>
                    {alert && <Alert variant="warning">{alert}</Alert>}
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" name="name" value={update.name} onChange={handleChangeUpdate} required />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Brand</Form.Label>
                            <Form.Control type="text" name="brand" value={update.brand} onChange={handleChangeUpdate} required />
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Catagory</Form.Label>
                            <Form.Control as="select" className="mr-sm-2" name="catagory" onChange={handleChangeUpdate} custom>
                                <option value="Men">Men</option>
                                <option value="Women">Women</option>
                                <option value="Electronics">Electronics</option>
                            </Form.Control>
                        </Form.Group>
                        <Form.Group as={Col}>
                            <Form.Label>Date</Form.Label>
                            <Form.Control className="mr-sm-2" type="datetime-local" name="date" value={update.date} onChange={handleChangeUpdate} required />
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>Price</Form.Label>
                            <Form.Control type="number" name="price" value={update.price} onChange={handleChangeUpdate} required />
                        </Form.Group>
                    </Form.Row>
                    <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <Form.Control as="textarea" rows={4} name="description" value={update.description} onChange={handleChangeUpdate} required />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHideModal5}>Close</Button>
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
                            <Form.Control as="select" name="searchingBrand" onChange={handleChange} custom>
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
                        <Form.Group as={Col}>
                            <Form.Label>Choose Catagory</Form.Label>
                            <Form.Control as="select" name="catagory" onChange={handleChange}>
                                <option value="Men">Men</option>
                                <option value="Women">Women</option>
                            </Form.Control>
                        </Form.Group>
                    </Form.Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHideModal3}>Close</Button>
                    <Button variant="primary" type="submit">{isLoading ? <Spinner animation="border" role="status"></Spinner> : "Save Changes"}</Button>
                </Modal.Footer>
            </Form>
        </Modal>
        {/* Email Marketing */}
        <Modal size="lg" show={showModal4} onHide={onHideModal4} animation={false}>
            <Modal.Header>
                <Modal.Title>Email Marketing</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleEmailMarSubmit}>
                <Modal.Body>
                    {alert && <Alert variant="warning" onClose={() => setAlert("")} dismissible>{alert}</Alert>}
                    <Card>
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
                                        <th>Check</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filterPEmail.map((product, index) => {
                                        return <tr key={index}>
                                            <td>{index + 1}</td>
                                            <td>{product.name}</td>
                                            <td>{product.brand}</td>
                                            <td><Image src={product.isMyProduct ? "/static/images/" + product.image : product.image} className="table-image" /></td>
                                            <td>{product.price || product.initialPrice}</td>
                                            <td><input type="checkbox" onChange={e => {
                                                let check = e.target.checked;
                                                setFilterP(filterPEmail.map(p => {
                                                    if (p._id === product._id) {
                                                        p.isChecked = check;
                                                    }
                                                    return p;
                                                }));
                                            }
                                            } checked={product.isChecked} /></td>
                                        </tr>
                                    })}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={onHideModal4}>Close</Button>
                    <Button variant="primary" type="submit">{isLoading ? <Spinner animation="border" role="status"></Spinner> : "Save"}</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    </Container>;
}
export default AdminProducts;