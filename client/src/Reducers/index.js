import { MyCartReducer } from './MyCartReducer';
import { OrderReducer } from './OrderReducer';
import { combineReducers } from 'redux';
import { scraperReducer } from './ScrapedProducts';
const allReducers = combineReducers({ MyCart: MyCartReducer, Order: OrderReducer, customizedInfo: scraperReducer });
export default allReducers;