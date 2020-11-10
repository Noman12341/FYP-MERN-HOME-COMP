const mongoose = require('mongoose');

const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
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
    }, price: {
        type: Number,
        required: true
    }, isAvailable: {
        type: Boolean,
        default: true
    }, isMyProduct: {
        type: Boolean,
        default: false
    }, rating: {
        type: Number,
        default: 0
    }, totalReviews: {
        type: Number,
        default: 0
    }, date: {
        type: Date,
        default: Date.now
    }
});

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;