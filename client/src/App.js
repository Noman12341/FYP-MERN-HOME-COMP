import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import 'react-notifications/lib/notifications.css';
import { NotificationContainer } from 'react-notifications';
import ScrollToTop from './Components/ScollToTop';
import NavBar from './Components/NavBar';
import Footer from './Components/Footer';
import Home from './Pages/Home';
import ProductDetail from './Pages/ProductDetail';
import AuthPage from './Pages/AuthPage';
import AuctionDetail from './Pages/AuctionDetail';
import CheckoutForm from './Pages/CheckOut';
import OrderSuccess from './Pages/OrderSuccess';
import ProtectedRoute from './Components/ProtectedRoute';
import Admin from './Pages/Admin';
import AdminAuth from './Pages/AdminAuth';
import ErrorPage from './Pages/Error';
import Search from './Pages/Search';
import ScrapPDetail from './Pages/ScrapPDetail';
import BrandProducts from './Pages/BrandProd';
function App() {
  return <Router>
    <ScrollToTop />
    <NavBar />
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/product-details/:productID" exact component={ProductDetail} />
      <Route path="/product-brands/:brand" exact component={BrandProducts} />
      <Route path="/searched-products" exact component={Search} />
      <Route path="/scrap-product-detail" exact component={ScrapPDetail} />
      <Route path="/login" exact component={AuthPage} />
      <Route path="/register" exact component={AuthPage} />
      <Route path="/product-auction-detail/:auctionProductID" exact component={AuctionDetail} />
      <ProtectedRoute path="/checkout" exact component={CheckoutForm} />
      <Route path="/order-success" exact component={OrderSuccess} />
      <Route path="/adminAuth" exact component={AdminAuth} />
      <Route path="/admin" component={Admin} />
      <Route path="*" exact component={ErrorPage} />
    </Switch>
    <Footer />
    <NotificationContainer />
  </Router>
}

export default App;
