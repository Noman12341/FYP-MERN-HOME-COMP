const mongoose = require('mongoose');
const { ISODate } = require('../GlobalFuntions');

const BidSchema = new mongoose.Schema({

    userName: {
        type: String,
        required: true,
        trim: true
    },
    productID: {
        type: Object,
        required: true
    },
    userID: {
        type: Object,
        required: true
    },
    date: {
        type: Date,
        default: ISODate
    },
    bidPrice: {
        type: Number,
        required: true
    }
});

const Bid = mongoose.model('Bid', BidSchema);
module.exports = Bid;