const moongoose = require('moongoose');

const ReviewSchema = new moongoose.Schema({
    productID: {
        type: Object,
        required: true,
        trim: true
    }, userName: {
        type: String,
        required: true,
        trim: true
    }, msg: {
        type: String,
        required: true,
        trim: true
    }, date: {
        type: Date,
        default: Date.now
    }
});

const Review = mongoose.model('Reviews', ReviewSchema);

module.exports = Review;