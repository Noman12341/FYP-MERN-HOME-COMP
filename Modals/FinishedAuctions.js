const mongoose = require('mongoose');

const FinishedAuctionSchema = new mongoose.Schema({
    userName: { type: String, requrired: true, trim: true },
    userID: { type: Object, required: true, trim: true },
    isMyProduct: { type: Boolean, default: true },
    isPaid: { type: Boolean, default: false },
    productID: { type: Object, required: true, trim: true },
    productName: { type: String, requrired: true, trim: true },
    productBrand: { type: String, requrired: true, trim: true },
    productCatagory: { type: String, requrired: true, trim: true },
    productImg: { type: String, requrired: true, trim: true },
    productPrice: { type: Number, requrired: true },
    auctionEndingdate: { type: String, requrired: true, trim: true },
    date: { type: Date, default: Date.now }

});
const FinishedAuction = mongoose.model('Finished-Auctions', FinishedAuctionSchema);
module.exports = FinishedAuction;