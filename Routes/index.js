const express = require('express');
const router = express.Router();
const Product = require('../Modals/Product');
const AuctionProduct = require('../Modals/AuctionProduct');
const Bid = require("../Modals/Bid");
const Comment = require('../Modals/Comment');
const FinishedAuction = require("../Modals/FinishedAuctions");
const auth = require("../Middlewares/auth");
const puppeteer = require('puppeteer');
let { v4: uuidv4 } = require('uuid');
router.get("/fetchproducts", async (req, res) => {
    await Product.find({}, (err, items) => {
        if (!err) {
            return res.status(200).json({ products: items });
        } else return res.status(400).json({ msg: "Your cluster is empty" });
    });

});

router.get("/fetchAuctionProducts", async (req, res) => {
    await AuctionProduct.find({}, (err, products) => {
        if (!err) {
            return res.status(200).json({ auctionProducts: products });
        } else return res.status(400).json({ msg: "Your Auction products is empty" });
    });
});

router.get("/fetchAuctionDetail/:ID", async (req, res) => {
    await AuctionProduct.findOne({ _id: req.params.ID }, (err, item) => {
        if (!err) {
            return res.status(200).json({ auctionProduct: item });
        } else return res.status(400).json({ msg: "No product found with this ID." });
    })
});

router.get("/fetchProductDetails/:id", async (req, res) => {
    await Product.findOne({ _id: req.params.id }, (err, product) => {
        if (!err) {
            return res.status(200).json({ product });
        } else return res.status(400).json({ msg: "No product found with id:" + req.params.id });
    });
});

// Biding Routes
router.post("/postBid", auth, async (req, res) => {
    const { userName, userID, productID, bidPrice, currentPrice } = req.body;
    if (currentPrice > bidPrice) {
        return res.status(406).json({ msg: "Bid price must me larger than currentPrice." })
    }
    await AuctionProduct.findOneAndUpdate({ _id: productID }, { currentPrice: bidPrice, userName: userName, userID: userID }, (err, obj) => {
        if (!err) {
            const newBid = new Bid({
                userName,
                userID,
                productID,
                bidPrice
            });
            newBid.save(err => {
                if (!err) {
                    return res.sendStatus(200);
                } else return res.sendStatus(400);
            });
        }
    });

});
// Fetch Comments
router.get("/fetchComments/:id", async (req, res) => {
    await Comment.find({ productID: req.params.id }, (err, comments) => {
        if (!err) {
            return res.status(200).json({ comments });
        } else return res.status(400).json({ msg: "some thing wronge happend i think no comments found." });
    });
});
// Post Comment here
router.post("/postComment/:ID", async (req, res) => {
    const { userName, comment, rating } = req.body;
    const productID = req.params.ID;
    const newComment = new Comment({
        productID,
        userName,
        comment,
        rating
    });
    await newComment.save();

    await Comment.find({ productID }, (err, comments) => {
        if (!err) {
            const sumOfRating = comments.reduce((a, c) => a + c.rating, 0);
            const totalRating = sumOfRating / comments.length;
            const newRating = Math.round(totalRating);
            Product.findOneAndUpdate({ _id: productID }, { rating: newRating, totalReviews: comments.length }, (err, updatedDoc) => {
                if (!err) {
                    return res.sendStatus(200);
                } else return res.status(400);
            });
        } else throw err;
    });
});

// set Action ending routes
router.post("/fetchFinishedAuction", async (req, res) => {
    await FinishedAuction.findOne({ userID: req.body.userID }, (err, obj) => {
        if (!err) {
            if (obj) {
                return res.status(200).json({ finishedAuction: obj });
            } else return res.sendStatus(400);
        } else return res.sendStatus(400);
    });
});

router.post("/scrap-product-detail", async (req, res) => {
    try {
        const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
        const page = await browser.newPage();
        await page.goto(req.body.link);
        const data = await page.evaluate(async () => {
            const title = document.querySelector('h1[class="h2 product-single__title"]').innerText;
            const productPrice = document.querySelector('.money').innerText;
            const productDiscription = document.querySelector('.product-single__description > p');
            let discription = "";
            if (!productDiscription) {
                discription = "No Description is Provided";
            } else {
                discription = productDiscription.innerText;
            }
            // await document.querySelector('button[class="btn btn--body btn--circle js-photoswipe__zoom product__photo-zoom"]').click();
            // const imgURL = document.querySelector('div[class="pswp__zoom-wrap"] > img').getAttribute('src');
            const imgURL = document.querySelector('img.lazyloaded').getAttribute('srcset');

            // fixing price here
            const editPrice = productPrice.replace(/[Rs,.]/gi, "");
            const PriceNum = Number(editPrice);
            const acttualPrice = parseInt(PriceNum.toString().slice(0, 4));
            return { _id: 1, name: title, brand: "Almirah", price: acttualPrice, image: imgURL, description: discription, isMyProduct: false };
        });
        await browser.close();
        return res.status(200).json({ productDetail: data });

    } catch (e) {
        console.log(e);
    }
});

router.post("/live-scrape", async (req, res) => {
    const { word } = req.body;
    // below array stores all the products
    // const word = "3pc";
    let CollectProducts = [];
    try {
        const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
        const page = await browser.newPage();
        // below is a search button
        await page.goto("https://www.almirah.com.pk");
        await page.waitForSelector('.site-nav');
        await page.click('.site-nav');
        // await page.focus('#search');
        await page.keyboard.type(word);
        await page.click(".text-link");
        await page.waitForSelector("#gf-products");

        await autoScroll(page);

        const cards = await page.$$('.grid-product__content');
        for (let i = 0; i < cards.length; i++) {
            const detailPage = await cards[i].$eval('a', link => "https://www.almirah.com.pk" + link.getAttribute('href'));
            const name = await cards[i].$eval('.grid-product__title', name => name.innerText);
            const image = await cards[i].$eval('.grid-product__image-mask > div', el => el.getAttribute('data-bgset').trim() === "" ? "" : window.getComputedStyle(el).backgroundImage.match(/url\("(.*)"/)[1]);
            const price = await cards[i].$eval('span.money', pric => Number(pric.innerText.replace(/[Rs,.]/gi, "").slice(0, 4)));
            CollectProducts.push({ _id: uuidv4(), name, image, price, detailPage, isMyProduct: false });
        }
        await browser.close();
        return res.status(200).json({ products: CollectProducts });
    } catch (e) {
        return res.status(400).json({ msg: e });
    }
});
// below function used to scroll down while webscraping
async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 300);
        });
    });
}
// live scrap Sanasafinaz
router.get("/live-scrap-sana", async (req, res) => {
    try {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto("https://www.sanasafinaz.com");
        await page.waitForSelector('.search-open');
        await page.click('.search-open');
        await page.focus('#search');
        await page.keyboard.type("unstitched");
        await page.click(".actions > button");
        await page.waitForSelector('.products-grid');
        const lis = await page.$$('.product-items > li');
        let data = [];
        for (let li of lis) {
            const detailPage = await li.$eval(".product-item-link", link => link.getAttribute('href'));
            const name = await li.$eval('.product-item-link', name => name.innerText.trim());
            const image = await li.$eval('.product-image-photo', image => image.getAttribute('src'));
            const price = await li.$eval('.price-wrapper > span', itemPrice => Number(itemPrice.innerText.replace(/[PKR,.]/gi, "").trim().slice(0, 4)));
            data.push({ detailPage, name, image, price });
        }
        console.log("Done");
        console.log(data.length);
        // await browser.close();
        return res.status(200).json({ data });
    } catch (e) {
        console.log(e);
        await browser.close();
        return res.status(400).json({ msg: "An error have been occured" });
    }


})

module.exports = router;