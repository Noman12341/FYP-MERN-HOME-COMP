const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const Order = require("../Modals/Order");
const QRCode = require('../Modals/QRCode');
const fs = require('fs');
const stripe = new Stripe('sk_test_47o8MwrffpGMbg37bIhrfvQn00WuHuxISx');
router.post("/checkout", async (req, res) => {
    const { id, amount, address, name, email, phone } = req.body;

    try {
        const session = await stripe.paymentIntents.create({
            amount,
            currency: "PKR",
            description: "Products detail stored inside the Admin Panel.",
            payment_method: id,
            confirm: true
        });
        // saving the orders detail in Database
        const newOrder = new Order({
            name,
            email,
            phone,
            address,
            amount: amount / 100
        });
        newOrder.save((err, obj) => {
            if (!err) {
                return res.status(200).json({ orderID: obj._id, name: obj.name, email: obj.email, phone: obj.phone, amountPayed: obj.amount });
            } else {
                return res.status(400).json({ msg: "Unable to save the order in Database" });
            }
        });
    } catch (error) {
        return res.status(400).json({ msg: error.raw.message });
    }

});

// order confirm on cash on delivery
router.post("/payment-cash-on-delivery", async (req, res) => {
    const { amount, address, name, email, phone, items } = req.body;
    // saving the orders detail in Database
    const newOrder = new Order({
        name,
        email,
        phone,
        address,
        amount,
        items
    });
    await newOrder.save((err, obj) => {
        if (!err) {
            return res.status(200).json({ orderID: obj._id, name: obj.name, email: obj.email, phone: obj.phone, amountPayed: obj.amount });
        } else {
            return res.status(400).json({ msg: "Unable to save the order in Database" });
        }
    });
});

router.post("/check-discount", async (req, res) => {
    const { disCode } = req.body;
    await QRCode.findOne({ disCode }, async (err, found) => {
        if (!err) {
            if (found) {
                await QRCode.deleteOne({ disCode }, async (err) => {
                    if (!err) {
                        if (found.qrCodeImg) {
                            fs.unlink("Public/QRCodes/" + found.qrCodeImg, err => {
                                if (!err) {
                                    return res.status(200).json({ obj: found });
                                } else { return res.status(400).json({ msg: "" }); }
                            });
                        } else { return res.status(200).json({ obj: found }) }

                    } else { return res.status(400).json({ msg: "Error in deleteing the document." }) }
                })
            } else { return res.status(400).json({ msg: "No Code found!" }); }
        } else { return res.status(400).json({ msg: "No match found!" }); }
    });
});

module.exports = router;