const mongoose = require('mongoose');

const codeSchema = new mongoose.Schema({
    userEmail: {
        type: String,
        trim: true
    }, disCode: {
        type: String,
        required: true,
        trim: true
    }, disPrice: {
        type: Number,
        required: true
    }, qrCodeImg: {
        type: String,
        trim: true
    }
});

const QRCode = mongoose.model('QRCode', codeSchema);
module.exports = QRCode;