const mongoose = require('mongoose');
const { ISODate } = require('../GlobalFuntions');

const CommentSchema = mongoose.Schema({
    productID: {
        type: Object,
        required: true
    }, userName: {
        type: String,
        required: true,
        trim: true
    },
    comment: {
        type: String,
        required: true,
        trim: true
    }, rating: {
        type: Number,
        required: true
    }, date: {
        type: String,
        default: ISODate
    }
});
const Comment = mongoose.model('Comment', CommentSchema);
module.exports = Comment;