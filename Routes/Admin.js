const express = require('express');
const router = express.Router();
const Product = require('../Modals/Product');
const AuctionProduct = require('../Modals/AuctionProduct');
const Bid = require('../Modals/Bid');
const Comment = require('../Modals/Comment');
const upload = require("../Middlewares/multer");
const fs = require('fs');
const User = require('../Modals/User');
const Order = require('../Modals/Order');
const QRCode = require('../Modals/QRCode');
const AdminAuth = require('../Middlewares/adminAuth');
const { nanoid } = require("nanoid");
const QR = require('qrcode');
const nodemailer = require("nodemailer");
const ejs = require("ejs");
const { handleEmailMarketing, scrapAlmirah, scrapGulAhmed, scrapSanaSafinaz, scrapDiners } = require('../GlobalFuntions');
const FinishedAuction = require("../Modals/FinishedAuctions");

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
    const { searchingBrand, url, catagory } = req.body;
    switch (searchingBrand) {
        case "Almirah":
            if (url.includes("almirah")) {
                await scrapAlmirah(url, catagory);
            } else { return res.status(400).json({ msg: "Url does not contains the brand name you enterd" }); }
            break;
        case "Sana Safinaz":
            if (url.includes("sanasafinaz")) {
                await scrapSanaSafinaz(url, catagory);
            } else { return res.status(400).json({ msg: "Url does not contains the brand name you enterd" }); }
        case "Gul Ahmed":
            if (url.includes("gulahmed")) {
                await scrapGulAhmed(url, catagory);
            } else { return res.status(400).json({ msg: "Url does not contains the brand name you enterd" }); }
            break;
        case "Diners":
            if (url.includes("diners")) {
                await scrapDiners(url, catagory);
            } else { return res.status(400).json({ msg: "Url does not contains the brand name you enterd" }); }
            break;
        default:
            return res.sendStatus(400).json({ msg: "No Brand Name matched!" });
    }
    return res.sendStatus(200);

});
// delete Simple Product which are not scraped
router.get("/deleteProduct/:ID/:imageName", async (req, res) => {
    await Product.deleteOne({ _id: req.params.ID }, async err => {
        if (!err) {
            await Comment.deleteMany({ productID: req.params.ID }, err => {
                if (err) return res.status(400).json({ msg: "Error, in deleting Comments." });
                // if not error
                fs.unlink("Public/images/" + req.params.imageName, (err) => {
                    if (!err) return res.sendStatus(200);
                    else return res.sendStatus(400);
                });
            });
        } else return res.sendStatus(400);
    });
});
// delete Scraped products
router.get("/deleteScrapedProduct/:id", async (req, res) => {
    await Product.deleteOne({ _id: req.params.id }, async err => {
        if (err) return res.status(400).json({ msg: "Error in deleting the scrap Product" });
        await Comment.deleteMany({ productID: req.params.id }, err => {
            if (err) return res.status(400).json({ msg: "Error in deleting the comments." });
            return res.status(200).json({ msg: "Product is deleted" });
        });
    });
});

// delete auction product
router.get("/deleteAuctionProduct/:ID/:imageName", async (req, res) => {
    const { ID, imageName } = req.params;
    await AuctionProduct.deleteOne({ _id: ID }, async err => {
        if (!err) {
            await Comment.deleteMany({ productID: ID }, async err => {
                if (!err) {
                    await Bid.deleteMany({ productID: ID }, err => {
                        if (!err) {
                            fs.unlink("Public/images/" + imageName, (err) => {
                                if (!err) {
                                    return res.status(200).json({ msg: "Image also delted" });
                                } else { return res.status(400).json({ msg: "Image is not deleted err" }); }
                            });
                        } else return res.status(400).json({ msg: "Error in deleteing the bids." });
                    });
                } else return res.status(400).json({ msg: "Error, in deleteing the comments" });
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
// Send multiple items in email marketing
router.post("/email-marketing", async (req, res) => {
    const { items } = req.body;
    // spliting items array into 2 halfs
    const half = Math.ceil(items.length / 2);
    const leSiItems = items.splice(0, half)
    const riSiItems = items.splice(-half)
    const users = await User.find({}, (err, array) => {
        if (!err) return array;
        else throw err;
    });
    // userEmails from users overall data
    const userEmails = users.map(obj => {
        return obj.email;
    });
    // now ready to send getEmails
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'mytestingemail12341@gmail.com',
            pass: 'hkzrrzlublcbhclj'
        }
    });
    // now render email Template using EJS template engine
    await ejs.renderFile(`${__dirname}/../Public/html/sendEmail.ejs`, { imgLogo: req.hostname + "/static/images/logo.png", homeUrl: req.hostname, baseUrl: req.hostname + "/static/images/", leSiItems, riSiItems }, async (err, data) => {
        if (!err) {
            var mailOptions = {
                from: 'mytestingemail12341@gmail.com',
                to: userEmails,
                subject: 'Just i need to send email with template remaining.',
                text: 'We just need to send a template inside the  email!',
                html: data
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    throw error;
                } else {
                    return res.status(200).json({ msg: "Product is added." });
                }
            });
        } else { throw err }
    });
});
// route for check if auction ends than put the auction product in finished auction table
router.put("/check-is-auction-finish", async (req, res) => {
    const { pID } = req.body;
    await AuctionProduct.findOne({ _id: pID }, async (err, obj) => {
        if (err) return res.status(400).json({ msg: "Error! in finding the auction product." });
        if (obj) {
            if (obj.userID) {
                const newFinishedAuction = new FinishedAuction({
                    userName: obj.userName,
                    userID: obj.userID,
                    productID: obj._id,
                    productName: obj.name,
                    productBrand: obj.brand,
                    productCatagory: obj.catagory,
                    productImg: obj.image,
                    productPrice: obj.currentPrice,
                    auctionEndingdate: obj.auctionEndingDate
                });
                await newFinishedAuction.save();
                await AuctionProduct.findOneAndDelete({ _id: pID }, (err) => {
                    if (err) return res.status(400).json({ msg: "Error! in deleteing the auction product" });

                    return res.status(200).json({ msg: "Product is Deleted and Auction is Finished" });
                });
            } else {
                await AuctionProduct.findOneAndDelete({ _id: pID }, (err) => {
                    if (err) return res.status(400).json({ msg: "Error! in deleteing the auction product" });
                    fs.unlink("Public/images/" + obj.image, err => {
                        if (!err) {
                            return res.status(200).json({ msg: "Product is Deleted and Auction is Finished" });
                        } else res.status(400).json({ msg: "Image is not deleted when deleting QRCode from database." });
                    });
                });
            }
        } else return res.status(400).json({ msg: "No product is found with this Auction p id" });

    });
});
// fetch Users for admin
router.get("/fetchUsers", AdminAuth, async (req, res) => {
    await User.find({}, (err, users) => {
        if (!err) { return res.status(200).json({ users }) }
        else { return res.status(400).json({ msg: "error! Users not found" }) }
    })
})
// fetch Orders for admin
router.get("/fetchOrders", AdminAuth, async (req, res) => {
    await Order.find({}, (err, orders) => {
        if (!err) { return res.status(200).json({ orders }) }
        else { return res.status(400).json({ msg: "Orders donot found." }) }
    });
});
// put required to compelete the orders
router.put('/deliver-order/:id', async (req, res) => {
    const { id } = req.params;
    await Order.updateOne({ _id: id }, { isDelivered: true }, (err) => {
        if (err) return res.status(400).json({ msg: "Error, error in updating process" + err });
        // if not error
        return res.sendStatus(200);
    });
});
// update Auction Product Data
router.post("/update-auction", async (req, res) => {
    const { _id, name, brand, catagory, price, description, date } = req.body;
    await AuctionProduct.updateOne({ _id }, { name, brand, catagory, initialPrice: price, description, auctionEndingDate: date }, err => {
        if (err) return res.status(400).json({ msg: "Error in updating." });

        return res.sendStatus(200);
    });
});
// fetch all the qrcodes
router.get("/fetchqrcodes", AdminAuth, async (req, res) => {
    await QRCode.find({}, (err, codes) => {
        if (!err) {
            return res.status(200).json({ codes });
        } else { return res.status(400).json({ codes }); }
    })
});
// store QRCodes on user Emails with qrcode image
router.post("/post-qrcodes-users", async (req, res) => {
    let { disPrice, qrcodeNo } = req.body;
    await User.find({ isAdmin: false }, async (err, users) => {
        if (err) return res.status(400).json({ msg: "error In finding the users" });
        if (users) {
            const usersEmail = users.map(i => i.email);
            usersEmail.length < qrcodeNo ? qrcodeNo = usersEmail.length : null;
            const newArray = getRandomSubarray(usersEmail, qrcodeNo);
            for (let i = 0; i < newArray.length; i++) {
                await QRCode.findOne({ userEmail: newArray[i] }, async (err, found) => {
                    if (err) { console.log(err); }
                    if (!found) {
                        const disCode = nanoid(11);
                        await QR.toFile("Public/QRCodes/" + disCode + ".png", disCode, { width: 400 });
                        const newCode = new QRCode({
                            userEmail: newArray[i],
                            disCode,
                            disPrice,
                            qrCodeImg: disCode + ".png"
                        });
                        await newCode.save();
                    }
                });
            }
            // below line return response after loop ends
            return res.status(200).json({ msg: "Codes added successfully" });
        } else { return res.status(400).json({ msg: "No users found." }); }

    });
});
// generate QRCodes for specific user
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
// generate qrcode without qr code and emails of users its free for any one to apply
router.post("/gen-qrcodes", async (req, res) => {
    const { disPrice, qrcodeNo } = req.body;
    try {
        for (let i = 0; i < qrcodeNo; i++) {
            const disCode = nanoid(11);
            const newQRCode = new QRCode({
                disCode,
                disPrice
            });
            await newQRCode.save();
        }
    } catch (e) {
        return res.status(400).json({ msg: "Error! : " + e });
    }
    return res.status(200).json({ msg: "QRCodes is added success fully." });
});

// Suffle inside array function is below
function getRandomSubarray(arr, size) {
    var shuffled = arr.slice(0), i = arr.length, temp, index;
    while (i--) {
        index = Math.floor((i + 1) * Math.random());
        temp = shuffled[index];
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
    }
    return shuffled.slice(0, size);
}
// count from all the documents from database
router.get("/admin-count-modals", AdminAuth, async (req, res) => {
    try {
        const users = await User.estimatedDocumentCount();
        const auctions = await AuctionProduct.estimatedDocumentCount();
        const orders = await Order.estimatedDocumentCount();
        const items = await Product.estimatedDocumentCount();
        return res.status(200).json({ users, auctions, orders, items });
    } catch (e) {
        return res.status(200).json({ msg: "Error !!" + e });
    }
});

// delete users form database
router.delete("/delete-user/:userID", async (req, res) => {
    const { userID } = req.params;
    if (userID) {
        await User.findOneAndDelete({ _id: userID }, async (err, obj) => {
            if (!err) {
                await QRCode.findOneAndDelete({ userEmail: obj.email }, async (err, codeData) => {
                    if (!err) {
                        fs.unlink("Public/QRCodes/" + codeData.qrCodeImg, err => {
                            if (!err) {
                                return res.status(200).json({ msg: "Deleted Successfully!" });
                            } else res.status(400).json({ msg: "Image is not deleted when deleting QRCode from database." });
                        });
                    } else { return res.status(400).json({ msg: "Error in finding and deleting the QRCode." }) }
                });
            } else { return res.status(400).json({ msg: "Error in finding and delteing the User" }); }
        });
    } else { return res.status(400).json({ msg: "No value recieved!" }); }
});

// delete order from database
router.delete("/delete-order/:orderID", async (req, res) => {
    const { orderID } = req.params;
    if (orderID) {
        await Order.deleteOne({ _id: orderID }, err => {
            if (!err) { return res.status(200).json({ msg: "Deleted Successfully!" }); }
            else { return res.status(400).json({ msg: "Not Deleted !" }); }
        });
    } else { return res.status(400).json({ msg: "Order ID didnot found!" }); }
});

// delete QRCode without Images from database
router.delete("/delete-qrcode-no-image/:qrcodeID", async (req, res) => {
    const { qrcodeID } = req.params;
    if (qrcodeID) {
        await QRCode.deleteOne({ _id: qrcodeID }, err => {
            if (!err) { return res.status(200).json({ msg: "Deleted Successfully!" }); }
            else { return res.status(400).json({ msg: "Not Deleted !" }); }
        });
    } else { return res.status(400).json({ msg: "QRCode id donot not recived." }); }
});
// delete QRCodes with images from database
router.delete("/delete-qrcode-with-image/:qrcodeID/:imgName", async (req, res) => {
    const { qrcodeID, imgName } = req.params;
    if (qrcodeID) {
        await QRCode.deleteOne({ _id: qrcodeID }, err => {
            if (!err) {
                fs.unlink("Public/QRCodes/" + imgName, err => {
                    if (!err) {
                        return res.status(200).json({ msg: "Deleted Successfully!" });
                    } else res.status(400).json({ msg: "Image is not deleted when deleting QRCode from database." });
                });
            }
            else { return res.status(400).json({ msg: "Not Deleted !" }); }
        });
    } else { return res.status(400).json({ msg: "QRCode id donot not recived." }); }
});


module.exports = router;