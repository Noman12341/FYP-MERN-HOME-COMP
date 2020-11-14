const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const Order = require("../Modals/Order");

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

module.exports = router;