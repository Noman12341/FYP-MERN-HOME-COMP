import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
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
import ForgotEmail from './Pages/ForgotEmail';
import ForgotPass from './Pages/ForgotPassword';
import ActiveEmail from './Pages/ActiveEmail';
import ViewBids from './Pages/ViewBids';
import VerifyPhone from './Pages/VerifyPhone';
import CatagoriesPage from './Pages/CatagoriesPage';
function App() {
  return <Router>
    <ReactNotification />
    <ScrollToTop />
    <NavBar />
    <Switch>
      <Route path="/" exact component={Home} />
      <Route path="/product-details/:productID" exact component={ProductDetail} />
      <Route path="/product-brands/:brand" exact component={BrandProducts} />
      <Route path="/searched-products" exact component={Search} />
      <Route path="/catagories/:catagory" exact component={CatagoriesPage} />
      <Route path="/scrap-product-detail" exact component={ScrapPDetail} />
      <Route path="/login" exact component={AuthPage} />
      <Route path="/register" exact component={AuthPage} />
      <Route path="/forgot-password" exact component={ForgotEmail} />
      <Route path="/forgot-password/:token" exact component={ForgotPass} />
      <Route path="/forgot-active-email/:token" exact component={ActiveEmail} />
      <Route path="/product-auction-detail/:auctionProductID" exact component={AuctionDetail} />
      <Route path="/view-bids/:pID" exact component={ViewBids} />
      <ProtectedRoute path="/checkout" exact component={CheckoutForm} />
      <Route path="/verify-number" exact component={VerifyPhone} />
      <Route path="/order-success" exact component={OrderSuccess} />
      <Route path="/adminAuth" exact component={AdminAuth} />
      <Route path="/admin" component={Admin} />
      <Route path="*" exact component={ErrorPage} />
    </Switch>
    <Footer />
  </Router>
}

export default App;
