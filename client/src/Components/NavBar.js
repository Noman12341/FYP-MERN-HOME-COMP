import React, { useState } from 'react';
import { Button, Nav, Navbar, Badge, Image, Dropdown, NavDropdown, Form, FormControl, Container, Row, Col } from 'react-bootstrap';
import Cart from './Cart';
import logo from '../Images/logo.png';
import { useLocation, useHistory, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { storeSearchedWord, searchOn } from '../Actions/MyScrapedProducts';

function NavBar() {
    const history = useHistory();
    const location = useLocation();
    const currLocation = location.pathname;
    const countItems = useSelector(state => state.MyCart.totalItems);
    const [searchWord, setSearchWord] = useState("");
    const dispatch = useDispatch();
    const handleSubmit = async (event) => {
        event.preventDefault();
        dispatch(storeSearchedWord(searchWord));
        dispatch(searchOn());
        history.push("/searched-products");
    }

    function handleLogout() {
        localStorage.clear();
        history.push("/");
    }
    if (currLocation.includes("/login") || currLocation.includes("/register") || currLocation.includes("/checkout") || currLocation.includes("/order-success") || currLocation.includes("/admin")) return null;

    return <Container fluid className="px-0">
        <Navbar id="Nav" bg="light" expand="lg" className="px-5" >
            <Link to="/" className="navbar-brand"><Image src={logo} alt="" height="70" width="135" /></Link>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Form onSubmit={handleSubmit} inline className="search-field">
                    <FormControl type="search" placeholder="Search" onChange={(event) => setSearchWord(event.target.value)} value={searchWord} className="mr-sm-2" />
                    <Button bsPrefix="search-btn" type="submit"><i className="fas fa-search"></i></Button>
                </Form>
                <Nav className="ml-auto">
                    <Link to="/" className="nav-link"><i className="fas fa-home"></i></Link>
                    <Link to="#" className="nav-link cart-dropdown"><Badge className="cart-badge">{countItems}</Badge><i className="fas fa-cart-arrow-down"></i>
                        <Cart />
                    </Link>
                    {localStorage.getItem("userName") ? <NavDropdown alignRight title={<i className="fas fa-user-circle"></i>} id="basic-nav-dropdown">
                        <NavDropdown.Item href="#action/3.1">{localStorage.getItem("userName")}</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <Button varient="primary" onClick={handleLogout} className="ml-4">LogOut</Button>
                    </NavDropdown> : <NavDropdown alignRight title={<i className="fas fa-user-circle"></i>} id="basic-nav-dropdown">
                            <Link to="/login" className="dropdown-item">SigIn</Link>
                            <Link to="/register" className="dropdown-item">Register</Link>
                        </NavDropdown>}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
        <Container fluid className="py-2" style={{ backgroundColor: "#f8f9fa" }}>
            <Row>
                <Col lg={3} md={4} sm={4} className="text-center px-0">
                    <Dropdown>
                        <Dropdown.Toggle bsPrefix="catagory-btn" id="dropdown-basic">
                            Catagories
                                </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item href="#/action-1">Men</Dropdown.Item>
                            <Dropdown.Item href="#/action-2">Women</Dropdown.Item>
                            <Dropdown.Item href="#/action-3">Electronics</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Col>
                <Col lg={9} md={8} sm={8} className="px-0">
                    <div className="brands-name">
                        <Link to="/product-brands/Almirah">
                            Almirah
                         </Link>
                        <Link to="/product-brands/Sana Safinaz">
                            Sana Safinaz
                        </Link>
                        <Link to="/product-brands/Gul Ahmed">
                            Gul Ahmed
                            </Link>
                        <Link to="/product-brands/Diners">
                            Diners
                        </Link>
                        {/* <Link to="/product-brands/">
                            Junaid Jamshed.
                        </Link> */}
                    </div>
                </Col>
            </Row>
        </Container>
    </Container>
}
export default NavBar;