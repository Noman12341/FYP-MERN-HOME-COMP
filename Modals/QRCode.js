const mongoose = require('mongoose');

const codeSchema = new mongoose.Schema({
    disCode: {
        type: String,
        required: true,
        trim: true
    }, disPrice: {
        type: Number,
        required: true
    }, isReserved: {
        type: Boolean,
        default: false
    }, isExpired: {
        type: Boolean,
        default: false
    }
});

const QRCode = mongoose.model('QRCode', codeSchema);
module.exports = QRCode;