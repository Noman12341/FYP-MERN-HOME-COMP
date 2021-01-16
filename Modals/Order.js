const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    }, email: {
        type: String,
        required: true,
        trim: true
    }, phone: {
        type: Number,
        required: true,
        trim: true
    }, address: {
        city: String,
        country: String,
        line1: String,
    }, amount: {
        type: Number,
        required: true
    }, items: [],
    isDelivered: {
        type: Boolean,
        default: false
    }, isPayCompleted: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });
const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;