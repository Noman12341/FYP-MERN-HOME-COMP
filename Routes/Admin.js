const express = require('express');
const router = express.Router();
const Product = require('../Modals/Product');
const AuctionProduct = require('../Modals/AuctionProduct');
const Bid = require('../Modals/Bid');
const upload = require("../Middlewares/multer");
const fs = require('fs');
const User = require('../Modals/User');
const Order = require('../Modals/Order');
const QRCode = require('../Modals/QRCode');
const AdminAuth = require('../Middlewares/adminAuth');
const { nanoid } = require("nanoid");
const QR = require('qrcode');
const { handleEmailMarketing, scrapAlmirah, scrapGulAhmed, scrapSanaSafinaz, scrapDiners } = require('../GlobalFuntions');


router.get("/fetchAllProducts", AdminAuth, async (req, res) => {
    await Product.find({}, async (err, productsArr) => {
        if (!err) {
            await AuctionProduct.find({}, (err, AuctionProductsArr) => {
                if (!err) {
                    return res.status(200).json({ simpleProducts: productsArr, auctionProducts: AuctionProductsArr });
                } else return res.status(400).json({ msg: "No Auction Product found!" });
            })
        } else return res.status(400).json({ msg: "No Product found!" });
    });
});

router.post("/ScrapProducts", async (req, res) => {
    const { searchingBrand, url } = req.body;
    switch (searchingBrand) {
        case "Almirah":
            if (url.includes("almirah")) {
                await scrapAlmirah(url);
            } else { return res.status(400).json({ msg: "Url does not contains the brand name you enterd" }); }
            break;
        case "Sana Safinaz":
            if (url.includes("sanasafinaz")) {
                await scrapSanaSafinaz(url);
            } else { return res.status(400).json({ msg: "Url does not contains the brand name you enterd" }); }
        case "Gul Ahmed":
            if (url.includes("gulahmed")) {
                await scrapGulAhmed(url);
            } else { return res.status(400).json({ msg: "Url does not contains the brand name you enterd" }); }
            break;
        case "Diners":
            if (url.includes("diners")) {
                await scrapDiners(url);
            } else { return res.status(400).json({ msg: "Url does not contains the brand name you enterd" }); }
            break;
        default:
            return res.sendStatus(400).json({ msg: "No Brand Name matched!" });
    }
    return res.sendStatus(200);

});
// delete Simple Product which are not scraped
router.get("/deleteProduct/:ID/:imageName", async (req, res) => {
    await Product.deleteOne({ _id: req.params.ID }, err => {
        if (!err) {
            fs.unlink("Public/images/" + req.params.imageName, (err) => {
                if (!err) return res.sendStatus(200);
                else return res.sendStatus(400);
            });
        } else return res.sendStatus(400);
    });
});
// delete Scraped products
router.get("/deleteScrapedProduct/:id", async (req, res) => {
    await Product.deleteOne({ _id: req.params.id }, err => {
        if (!err) return res.status(200).json({ msg: "product is delted" })
        else return res.status(400).json({ msg: "Product is not delted" })
    })
})

// delete auction product
router.get("/deleteAuctionProduct/:ID/:imageName", async (req, res) => {
    const { ID, imageName } = req.params;
    await AuctionProduct.findByIdAndDelete(ID, async err => {
        if (!err) {
            await Bid.findOne({ productID: ID }, async (err, bid) => {
                if (!err) {
                    if (bid) {
                        await Bid.deleteMany({ productID: ID }, (err) => {
                            if (!err) {
                                fs.unlink("Public/images/" + imageName, (err) => {
                                    if (!err) res.status(200).json({ msg: "Image also delted" });
                                    else res.status(400).json({ msg: "Image is not deleted err" });
                                });
                            } else res.status(400).json({ msg: "err in deleting the bid" });
                        })
                    } else {
                        fs.unlink("Public/images/" + imageName, (err) => {
                            if (!err) res.status(200).json({ msg: "Image also delted" });
                            else res.status(400).json({ msg: "Image is not deleted err" });
                        });
                    }
                } else res.status(400).json({ msg: "error in finding the Bid" });
            });
        } else res.status(400).json({ msg: "Error in deleteing the Auction Product." })
    });
});


// Add a Simple Product
router.post("/addSimpleProduct", upload.single('image'), async (req, res) => {
    let { name, brand, catagory, description, price, emailMarketing } = req.body;

    await Product.findOne({ $or: [{ name: name }, { image: req.file.filename }] }, async (err, found) => {
        if (!err) {
            if (found) {
                fs.unlink("Public/images/" + req.file.filename, (err) => {
                    if (err) throw err;
                });
                return res.status(400).json({ msg: "This Product already Exists." });
            }
            // if not found
            const newProduct = new Product({
                name,
                brand,
                catagory,
                description,
                price,
                image: req.file.filename,
                isMyProduct: true
            });

            await newProduct.save(err => {
                if (!err) {
                    if (emailMarketing === "true") {
                        handleEmailMarketing(req.file.filename, name, brand, description, price);
                    }
                    return res.status(200).json({ msg: "Product is added." });
                } else { return res.status(400).json({ msg: "Error in saveing the Product" }); }
            });
        } else return res.status(400).json({ msg: "Error in Founding the product." });
    });
});

// post Auction Products
router.post("/addAuctionProduct", upload.single('image'), async (req, res) => {
    const { name, brand, catagory, description, price, emailMarketing, date } = req.body;
    await AuctionProduct.findOne({ $or: [{ name }, { image: req.file.filename }] }, (err, obj) => {
        if (!err) {
            if (obj) {
                fs.unlink("Public/images/" + req.file.filename, (err) => {
                    if (err) throw err;
                });
                return res.status(400).json({ msg: "Product Already exists." });
            }
            // If Not product Present
            const newAuctionProduct = new AuctionProduct({
                name,
                brand,
                catagory,
                description,
                image: req.file.filename,
                initialPrice: price,
                currentPrice: price,
                auctionEndingDate: date
            });
            newAuctionProduct.save(err => {
                if (!err) { return res.status(200).json({ msg: "Product is added." }); }
                else { return res.status(200).json({ msg: "Product is not added." }); }
            });
        } else return res.status(400).json({ msg: "Error in Finding the Product." })
    });
});

// fetch Users for admin
router.get("/fetchUsers", async (req, res) => {
    await User.find({}, (err, users) => {
        if (!err) { return res.status(200).json({ users }) }
        else { return res.status(400).json({ msg: "error! Users not found" }) }
    })
})
// fetch Orders for admin
router.get("/fetchOrders", async (req, res) => {
    await Order.find({}, (err, orders) => {
        if (!err) { return res.status(200).json({ orders }) }
        else { return res.status(400).json({ msg: "Orders donot found." }) }
    });
});

// fetch all the qrcodes
router.get("/fetchqrcodes", async (req, res) => {
    await QRCode.find({}, (err, codes) => {
        if (!err) {
            return res.status(200).json({ codes });
        } else { return res.status(400).json({ codes }); }
    })
});
// generate QRCodes from specific users
router.post("/get-qrcode-users", async (req, res) => {
    const { userEmail, disPrice } = req.body;
    await User.findOne({ email: userEmail }, async (err, found) => {
        if (!err) {
            if (found) { return res.status(400).json({ msg: "This user already have discount code." }); }
            // if not found
            const disCode = nanoid(11);
            await QR.toFile("Public/QRCodes/" + disCode + ".png", disCode, { width: 400 });
            const newCode = new QRCode({
                userEmail,
                disCode,
                disPrice,
                qrCodeImg: disCode + ".png"
            });
            await newCode.save();
            return res.status(200).json({ msg: "Code is saved Successfully!" });
        } else { return res.status(400).json({ msg: "Error in finding the error." }); }
    });
});
// generate qrcode 
router.post("/gen-qrcodes", async (req, res) => {
    const { disPrice, numOfCodes } = req.body;
    try {
        for (let i = 0; i < numOfCodes; i++) {
            const disCode = nanoid(11);
            // await QR.toFile("Public/QRCodes/" + disCode + ".png", disCode, { width: 400 });
            const newQRCode = new QRCode({
                disCode,
                disPrice
                // qrCodeImg: disCode + ".png",
            });
            await newQRCode.save();
        }
    } catch (e) {
        return res.status(400).json({ msg: "Error! : " + e });
    }
    return res.status(200).json({ msg: "QRCodes is added success fully." });
});
module.exports = router;