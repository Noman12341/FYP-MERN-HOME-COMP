const mongoose = require('mongoose');

const AuctionProductSchema = mongoose.Schema({

    userName: {
        type: String,
        trim: true
    },
    userID: {
        type: Object,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    }, isMyProduct: {
        type: Boolean,
        default: true
    }, brand: {
        type: String,
        required: true,
        trim: true
    }, catagory: {
        type: String,
        required: true,
        trim: true
    }, description: {
        type: String,
        required: true,
        trim: true
    }, image: {
        type: String,
        required: true,
        trim: true
    }, initialPrice: {
        type: Number,
        required: true,
    }, currentPrice: {
        type: Number,
        required: true,
    }, rating: {
        type: Number,
        default: 0,
    }, totalReviews: {
        type: Number,
        default: 0,
    }, auctionEndingDate: {
        type: String,
        required: true,
        trim: true
    }
});

const AuctionProduct = mongoose.model('Auction-Products', AuctionProductSchema);
module.exports = AuctionProduct;