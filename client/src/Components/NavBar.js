import React, { useState } from 'react';
import { Button, Nav, Navbar, Badge, Image, NavDropdown, Form, FormControl } from 'react-bootstrap';
import Cart from './Cart';
import logo from '../Images/logo.png';
import { useLocation, useHistory, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import BrandDropDown from './BrandsDropDown';
import { storeSearchedWord, searchOn } from '../Actions/MyScrapedProducts';
import { SiBrandfolder } from 'react-icons/si';
import { AiFillHome } from 'react-icons/ai';
import { FaShoppingBasket } from 'react-icons/fa';
function NavBar() {
    const history = useHistory();
    const location = useLocation();
    const currLocation = location.pathname;
    const countItems = useSelector(state => state.MyCart.totalItems);
    // const [searchWord, setSearchWord] = useState("");
    const [gender, setGender] = useState("");
    const [color, setColor] = useState("");
    const dispatch = useDispatch();
    const handleSubmit = async (event) => {
        event.preventDefault();
        const saveWord = gender + "" + color;
        // dispatch(storeSearchedWord(searchWord));
        dispatch(storeSearchedWord(saveWord));
        dispatch(searchOn());
        history.push("/searched-products");
    }

    function handleLogout() {
        localStorage.clear();
        history.push("/");
    }
    if (currLocation.includes("/login") || currLocation.includes("/register") || currLocation.includes("/admin") || currLocation.includes("/forgot") || currLocation.includes("/verify")) return null;

    return <Navbar id="Nav" sticky="top" expand="lg" bg="light" className="px-5" >
        <Link to="/" className="navbar-brand"><Image src={logo} alt="" height="70" width="135" /></Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="text-right">
            <Form onSubmit={handleSubmit} inline className="search-field">
                <FormControl type="search" className="main-search-field" placeholder="Search" value={gender + "" + color} required />
                {/* Below div is the search inpute dropdown */}
                <div className="search-dropdown-content">
                    <div>
                        <h6>Men</h6>
                        <div>
                            <Button bsPrefix="search-sm-btns" onClick={() => setGender("Kurta ")}>Kurta</Button>
                            <Button bsPrefix="search-sm-btns" onClick={() => setGender("Suit ")}>Suit</Button>
                            <Button bsPrefix="search-sm-btns" onClick={() => setGender("Dress Shirt ")}>Dress Shirt</Button>
                            <Button bsPrefix="search-sm-btns" onClick={() => setGender("Jackets ")}>Jackets</Button>
                            <Button bsPrefix="search-sm-btns" onClick={() => setGender("Jeans ")}>Jeans</Button>
                            <Button bsPrefix="search-sm-btns" onClick={() => setGender("Westren ")}>Westren</Button>
                            <Button bsPrefix="search-sm-btns" onClick={() => setGender("Eastren ")}>Eastren</Button>
                            <Button bsPrefix="search-sm-btns" onClick={() => setGender("Unstitched ")}>Unstitched</Button>
                        </div>
                    </div>
                    <div>
                        <h6>Women</h6>
                        <div>
                            <Button bsPrefix="search-sm-btns" onClick={() => setGender("Solid ")}>Solid</Button>
                            <Button bsPrefix="search-sm-btns" onClick={() => setGender("Digital ")}>Digital</Button>
                            <Button bsPrefix="search-sm-btns" onClick={() => setGender("Suits ")}>Suits</Button>
                            <Button bsPrefix="search-sm-btns" onClick={() => setGender("Formal ")}>Formal</Button>
                            <Button bsPrefix="search-sm-btns" onClick={() => setGender("Semi Formal ")}>Semi formal</Button>
                            <Button bsPrefix="search-sm-btns" onClick={() => setGender("Unstitched ")}>Unstitched</Button>
                            <Button bsPrefix="search-sm-btns" onClick={() => setGender("Trousers ")}>Trousers</Button>
                        </div>
                    </div>
                    <div>
                        <h6>Colors</h6>
                        <div>
                            <Button bsPrefix="search-sm-btns" onClick={() => setColor("Red ")}>Red</Button>
                            <Button bsPrefix="search-sm-btns" onClick={() => setColor("Blue ")}>Blue</Button>
                            <Button bsPrefix="search-sm-btns" onClick={() => setColor("Yellow ")}>Yellow</Button>
                            <Button bsPrefix="search-sm-btns" onClick={() => setColor("Green ")}>Green</Button>
                        </div>
                    </div>
                </div>
                <Button bsPrefix="search-btn" type="submit"><i className="fas fa-search"></i></Button>
            </Form>
            <Nav className="ml-auto">
                <Link to="/" className="nav-link"><AiFillHome /></Link>
                <div className="nav-link brand-dropdown" style={{ position: "relative" }}><SiBrandfolder /><BrandDropDown /></div>
                <Link to="#" className="nav-link cart-dropdown" style={{ position: "relative" }}><FaShoppingBasket />
                    <Badge className="cart-badge">{countItems}</Badge>
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
}
export default NavBar;