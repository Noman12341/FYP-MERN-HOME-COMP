const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    }, email: {
        type: String,
        required: true,
        trim: true
    }, password: {
        type: String,
        required: true,
        trim: true
    }, isActive: {
        type: Boolean,
        default: false
    }, isAdmin: {
        type: Boolean,
        default: false
    }, token: {
        type: String,
        default: ""
    }, date: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;