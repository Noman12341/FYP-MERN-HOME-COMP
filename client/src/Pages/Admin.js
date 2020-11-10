import React from 'react';
import { Link, NavLink, Route, Switch, useHistory } from 'react-router-dom';
import { Navbar, Nav, Button } from 'react-bootstrap';
import AdminProducts from '../SubPages/AdminProducts';
import AdminUsers from '../SubPages/AdminUsers';
import AdminOrders from '../SubPages/AdminOrder';

function Admin() {
    const history = useHistory();
    const handleLogout = () => {
        localStorage.clear();
        history.push('/adminAuth');
    }
    return <div id="wrapper">
        {/* Side bar wrapper */}
        <div id="side-bar-wrapper">
            <div className="logo">
                <Link to="/admin" className="admin-logo">Multi Brand</Link>
            </div>
            <ul className="admin-menu-list">
                <li><NavLink to="/admin" exact activeClassName="selected"><i className="fas fa-user fa-2x mr-3"></i><p>Dash Board</p></NavLink></li>
                <li><NavLink to="/admin/users" exact activeClassName="selected"><i className="fas fa-users fa-2x mr-3"></i><p>Users</p></NavLink></li>
                <li><NavLink to="/admin/products" exact activeClassName="selected"><i className="fab fa-product-hunt fa-2x mr-2"></i><p>Products</p></NavLink></li>
                <li><NavLink to="/admin/orders" exact activeClassName="selected"><i className="fab fa-first-order-alt fa-2x mr-2"></i><p>Orders</p></NavLink></li>
            </ul>
        </div>
        {/* Main Admin Panel wrapper */}
        <div id="main-panel">
            <Navbar>
                <Link to="/admin" className="navbar-brand my-1">DashBoard</Link>
                <Nav className="ml-auto">
                    <Button type="button" onClick={handleLogout}>Logout</Button>
                </Nav>
            </Navbar>
            <div id="admin-content-box">
                <Switch>
                    <Route path="/admin/users" component={AdminUsers} />
                    <Route path="/admin/products" component={AdminProducts} />
                    <Route path="/admin/orders" component={AdminOrders} />
                </Switch>
            </div>

        </div>
    </div>;
}
export default Admin