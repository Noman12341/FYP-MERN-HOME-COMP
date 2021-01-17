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
    // let [searchWord, setSearchWord] = useState("");
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

    //  handle Search input
    const handleChange = e => {
        const { name, value } = e.target;
        if (name === "gender") {
            setGender(value);
        } else if (name === "color") {
            setColor(value);
        } else if (name === "typeWord") {
            console.log("typing Disabled");
        } else {
            console.log(name, value);
        }
    }


    function handleLogout() {
        localStorage.clear();
        history.push("/");
    }
    // things to hide navbar for these following routes
    // || currLocation.includes("/forgot") || currLocation.includes("/verify")currLocation.includes("/login") || currLocation.includes("/register") || 
    if (currLocation.includes("/admin")) return null;

    return <Navbar id="Nav" sticky="top" expand="lg" bg="light" className="px-5" >
        <Link to="/" className="navbar-brand"><Image src={logo} alt="" height="70" width="135" /></Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="text-right">
            <Form onSubmit={handleSubmit} inline className="search-field">
                <FormControl type="text" className="main-search-field" placeholder="Search" name="typeWord" value={gender + "" + color || ""} onChange={handleChange} required />
                {/* Below div is the search inpute dropdown */}
                <div className="search-dropdown-content">
                    <div>
                        <h6>Men</h6>
                        <div>
                            <Button bsPrefix="search-sm-btns" className={gender === "Kurta" && "active-class"} name="gender" value="Kurta" onClick={handleChange}>Kurta</Button>
                            <Button bsPrefix="search-sm-btns" className={gender === "Suit" && "active-class"} name="gender" value="Suit" onClick={handleChange}>Suit</Button>
                            <Button bsPrefix="search-sm-btns" className={gender === "Dress Shirt" && "active-class"} name="gender" value="Dress Shirt" onClick={handleChange}>Dress Shirt</Button>
                            <Button bsPrefix="search-sm-btns" className={gender === "Jackets" && "active-class"} name="gender" value="Jackets" onClick={handleChange}>Jackets</Button>
                            <Button bsPrefix="search-sm-btns" className={gender === "Jeans" && "active-class"} name="gender" value="Jeans" onClick={handleChange}>Jeans</Button>
                            <Button bsPrefix="search-sm-btns" className={gender === "Westren" && "active-class"} name="gender" value="Westren" onClick={handleChange}>Westren</Button>
                            <Button bsPrefix="search-sm-btns" className={gender === "Eastren" && "active-class"} name="gender" value="Eastren" onClick={handleChange}>Eastren</Button>
                            <Button bsPrefix="search-sm-btns" className={gender === "Unsitched" && "active-class"} name="gender" value="Unsitched" onClick={handleChange}>Unstitched</Button>
                        </div>
                    </div>
                    <div>
                        <h6>Women</h6>
                        <div>
                            <Button bsPrefix="search-sm-btns" className={gender === "Solid" && "active-class"} name="gender" value="Solid" onClick={handleChange}>Solid</Button>
                            <Button bsPrefix="search-sm-btns" className={gender === "Digital" && "active-class"} name="gender" value="Digital" onClick={handleChange}>Digital</Button>
                            <Button bsPrefix="search-sm-btns" className={gender === "Suits" && "active-class"} name="gender" value="Suits" onClick={handleChange}>Suits</Button>
                            <Button bsPrefix="search-sm-btns" className={gender === "Formal" && "active-class"} name="gender" value="Formal" onClick={handleChange}>Formal</Button>
                            <Button bsPrefix="search-sm-btns" className={gender === "Semi formal" && "active-class"} name="gender" value="Semi formal" onClick={handleChange}>Semi formal</Button>
                            <Button bsPrefix="search-sm-btns" className={gender === "Unstitched" && "active-class"} name="gender" value="Unstitched" onClick={handleChange}>Unstitched</Button>
                            <Button bsPrefix="search-sm-btns" className={gender === "Trousers" && "active-class"} name="gender" value="Trousers" onClick={handleChange}>Trousers</Button>
                        </div>
                    </div>
                    <div>
                        <h6>Colors</h6>
                        <div>
                            <Button bsPrefix="search-sm-btns" className={color === " Red" && "active-class"} name="color" value=" Red" onClick={handleChange}>Red</Button>
                            <Button bsPrefix="search-sm-btns" className={color === " Blue" && "active-class"} name="color" value=" Blue" onClick={handleChange}>Blue</Button>
                            <Button bsPrefix="search-sm-btns" className={color === " Yellow" && "active-class"} name="color" value=" Yellow" onClick={handleChange}>Yellow</Button>
                            <Button bsPrefix="search-sm-btns" className={color === " Green" && "active-class"} name="color" value=" Green" onClick={handleChange}>Green</Button>
                        </div>
                    </div>
                    <div className="my-2 text-center">
                        <Button bsPrefix="clear-btn" onClick={() => {
                            setGender("");
                            setColor("");
                        }}><h6>Clear Input Field</h6></Button>
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