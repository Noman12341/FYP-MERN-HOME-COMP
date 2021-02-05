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
const QRCode = require('../Modals/QRCode');

// fetch owned products
router.get("/fetchOwnProducts", async (req, res) => {
    await Product.find({ isMyProduct: true }, (err, items) => {
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
// get brand products
router.get("/fetchBrand/:brandName", async (req, res) => {
    await Product.find({ brand: req.params.brandName }, (err, items) => {
        if (!err) {
            if (items.length) {
                return res.status(200).json({ items });
            } else { return res.status(400).json({ msg: "No product of this brand is present." }); }
        } else { return res.status(400).json({ msg: "Error! in finding the product." }); }
    })
})
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
    if (currentPrice + 400 > bidPrice) {
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
// Post Comment for Auction products
router.post("/postComment-auction-product/:ID", async (req, res) => {
    const { userName, comment, rating } = req.body;
    const productID = req.params.ID;
    const newComment = new Comment({
        productID,
        userName,
        comment,
        rating
    });
    await newComment.save();

    await Comment.find({ productID }, async (err, comments) => {
        if (!err) {
            const sumOfRating = comments.reduce((a, c) => a + c.rating, 0);
            const totalRating = sumOfRating / comments.length;
            const newRating = Math.round(totalRating);
            await AuctionProduct.findOneAndUpdate({ _id: productID }, { rating: newRating, totalReviews: comments.length }, (err, updatedDoc) => {
                if (!err) {
                    return res.sendStatus(200);
                } else return res.status(400);
            });
        } else throw err;
    });
});

// fetch qrcode for user in check out page
router.post("/fetchqrcode", async (req, res) => {
    const { userEmail } = req.body;
    await QRCode.findOne({ userEmail }, (err, found) => {
        if (!err) {
            if (found) {
                return res.status(200).json({ img: found.qrCodeImg });
            } else return res.status(400).json({ msg: "No QRCode found on this user" });
        } else return res.status(400).json({ msg: "Error In finding the Qode" });
    });
});

// fetch auction products when user loged in
router.get("/fetchFinishedAuction/:userID", async (req, res) => {
    await FinishedAuction.find({ $and: [{ userID: req.params.userID }, { isPaid: false }] }, (err, obj) => {
        if (!err) {
            if (obj) {
                return res.status(200).json({ finishedAuction: obj });
            } else return res.sendStatus(400);
        } else return res.sendStatus(400);
    });
});
// fetch catagories product page items
router.get("/catagory-items/:catagory", async (req, res) => {
    const { catagory } = req.params;
    await Product.find({ catagory }, async (err, products) => {
        if (err) return res.status(400).json({ msg: "Error in finding the products using catagory param." });

        await AuctionProduct.find({ catagory }, (err, auctionP) => {
            if (err) return res.status(400).json({ msg: "Error in finding the auction products using catagory param." });

            return res.status(200).json({ products, auctionP });
        });
    });
});
// fetch Auction Products
router.get("/fetchFinishedAuctions", async (req, res) => {
    await FinishedAuction.find({}, (err, products) => {
        if (!err) {
            return res.status(200).json({ products });
        } else return res.status(400).json({ msg: "No Product Found" });
    });
})

// router.get('/addDumyAuction', (req, res) => {
//     const newFinisedAuction = new FinishedAuction({
//         userName: "Noman Faisal",
//         userID: "5f7eb8096fa6d217ac65150a",
//         productID: "5fbcb37e2076512c6816beeb",
//         productName: "Nintendo Switch",
//         productBrand: "Nintendo",
//         productCatagory: "Electronincs",
//         productImg: "1606202237910-nintendo-switch.png",
//         productPrice: 124000,
//         auctionEndingdate: "2020-12-31",
//     });
//     newFinisedAuction.save(err => {
//         if (!err) return res.status(200).json({ msg: "Saved" });
//         else return res.status(400).json({ msg: "Product not save" });
//     });
// });

router.post("/scrap-product-detail", async (req, res) => {
    const { link } = req.body;
    if (link.includes('almirah')) {
        // excecute this
        const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
        try {
            const page = await browser.newPage();
            await page.goto(link);
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
            await browser.close();
            return res.status(400).json({ msg: "Error!!" });
        }
    } else if (link.includes('gulahmed')) {
        const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
        try {
            const page = await browser.newPage();
            await page.goto(link);
            await page.waitForSelector('#maincontent');
            const data = await page.evaluate(() => {
                const img = document.querySelector('.no-sirv-lazy-load').getAttribute('src');
                const itemName = document.querySelector('.page-title > span').innerText;
                const price = document.querySelector('.price-container').innerText;
                let description = "";
                if (document.querySelector('.description')) {
                    description = document.querySelector('.description > div').innerText.trim();
                } else { description = "No Description Provided."; }
                const editPrice = price.replace(/[PKR,]/gi, "");
                const priceFixed = Number(editPrice);
                return { _id: 1, name: itemName, brand: "Gul Ahmed", price: priceFixed, image: img, description, isMyProduct: false };
            });
            await browser.close();
            return res.status(200).json({ productDetail: data });
        } catch (e) {
            await browser.close();
            return res.status(400).json({ msg: "Error!!" });
        }
    } else if (link.includes('alkaram')) {
        const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
        try {
            const page = await browser.newPage();
            await page.goto(link);
            await page.waitForSelector('.main');
            const scrapedObj = await page.evaluate(() => {
                const pName = document.querySelector('.product-name > h1').innerText;
                const price = document.querySelector('.price-box .price').innerText;
                const image = document.querySelector('.product-img-box a').getAttribute('href');
                const description = document.querySelector('.std').innerText;
                // below code is used to remove PKR from price string
                const editPrice = price.replace(/[PKR,Rs]/gi, "").trim();
                const PriceNum = Number(editPrice);
                const fixedPrice = parseInt(PriceNum.toString().slice(0, 4));
                return { _id: 1, name: pName, brand: "Alkaram", price: fixedPrice, image, description, isMyProduct: false };
            });
            await browser.close();
            return res.status(200).json({ productDetail: scrapedObj });
        } catch (e) {
            await browser.close();
            return res.status(400).json({ msg: e });
        }
    } else if (link.includes('diners')) {
        const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
        try {
            const page = await browser.newPage();
            await page.goto(link);
            await page.waitForSelector('.product-default');
            const scrapedObj = await page.evaluate(() => {
                const pName = document.querySelector('.product-title > span').innerText;
                const price = document.querySelector('.price > span').innerText;
                const image = document.querySelector('.fancybox > img').getAttribute('src');
                let description = null;
                if (document.querySelector('.tab-content').innerText === "") {
                    description = "no description provided";
                } else { description = document.querySelector('.tab-content').innerText.trim(); }
                // below code is used to remove PKR from price string
                const editPrice = price.replace(/[PKR,.Rs]/gi, "");
                const PriceNum = Number(editPrice);
                const fixedPrice = parseInt(PriceNum.toString().slice(0, 4));
                return { _id: 1, name: pName, brand: "Diners", price: fixedPrice, image, description, isMyProduct: false };
            });
            await browser.close();
            return res.status(200).json({ productDetail: scrapedObj });
        } catch (e) {
            await browser.close();
            return res.status(400).json({ msg: "Error!!" });
        }
    } else {
        // no match found
        return res.status(400).json({ msg: "No match found" });
    }
});

router.post("/live-scrape", async (req, res) => {
    const { word } = req.body;
    let Almirah = [];
    let GulAhmed = [];
    let Alkaram = [];
    let Diners = [];
    let loopLimit = 0;
    let lis = null;
    // Code Started From here
    const browser = await puppeteer.launch({ headless: false });
    try {
        const page = await browser.newPage();
        // below is a search button
        await page.goto("https://www.almirah.com.pk");
        await page.waitForSelector('.site-nav');
        await page.click('.site-nav');
        await page.keyboard.type(word);
        await page.click(".text-link");
        await page.waitForSelector("#gf-products");
        if (await page.$(".grid-product__content")) {
            // await page.waitForSelector("#gf-products");
            // check if products are visible
            await autoScroll(page);
            lis = await page.$$('.grid-product__content');
            lis.length > 8 ? loopLimit = 8 : loopLimit = lis.length;
            for (let i = 0; i < loopLimit; i++) {
                const detailPage = await lis[i].$eval('a', link => "https://www.almirah.com.pk" + link.getAttribute('href'));
                const name = await lis[i].$eval('.grid-product__title', name => name.innerText);
                // const image = await lis[i].$eval('.grid-product__image-mask > div', el => el.getAttribute('data-bgset').trim() === "" ? "" : window.getComputedStyle(el).backgroundImage.match(/url\("(.*)"/)[1]);
                const image = await lis[i].$eval('.grid-product__image', img => img.getAttribute('data-srcset').trim());
                const price = await lis[i].$eval('span.money', pric => Number(pric.innerText.replace(/[Rs,.]/gi, "").slice(0, 4)));
                Almirah.push({ _id: uuidv4(), name, image, price, brand: "Almirah", detailPage, isMyProduct: false });
            }
        }
        // if Ends here

        // Scraping Gul ahmed products
        await page.goto("https://www.gulahmedshop.com/");
        await page.waitForSelector('.minisearch');
        await page.click('#search');
        await page.keyboard.type(word);
        await page.waitForSelector('.actions > button');
        await page.click('.actions > button');
        await page.waitForSelector(".product-list-container")

        if (await page.$('.results')) {
            lis = await page.$$('ol.products > li');
            lis.length > 8 ? loopLimit = 8 : loopLimit = lis.length;
            for (let i = 0; i < loopLimit; i++) {
                const detailPage = await lis[i].$eval(".cdz-product-top > a", link => link.getAttribute('href'));
                const name = await lis[i].$eval('strong > a', name => name.innerText.trim());
                const image = await lis[i].$eval('.product-image-photo', image => image.getAttribute('src'));
                const price = await lis[i].$eval('.price-box .price', itemPrice => Number(itemPrice.innerText.replace(/[PKR,]/gi, "").trim()));
                GulAhmed.push({ _id: uuidv4(), name, image, price, brand: "Gul Ahmed", detailPage, isMyProduct: false });
            }
        }
        // if Ends here

        // below code is going to page alkarm and scrap it
        await page.goto("https://www.alkaramstudio.com/");
        // await page.click('#close_pop_up');
        await page.waitForSelector('#search_mini_form');
        await page.focus('#search');
        await page.keyboard.type(word);
        await page.click('.button');
        await page.waitForSelector('.col-main');

        if (await page.$(".note-msg") === null) {
            lis = await page.$$('.products-grid > li');
            lis.length > 8 ? loopLimit = 8 : loopLimit = lis.length;
            for (let i = 0; i < loopLimit; i++) {
                const name = await lis[i].$eval('.product-name', name => name.innerText);
                const image = await lis[i].$eval('.product-image > img', img => img.getAttribute('src'));
                const price = await lis[i].$eval('.price-box .price', price => Number(price.innerText.replace(/[PKR,]/gi, "").trim()));
                const detailPage = await lis[i].$eval('.item-img > a', link => link.getAttribute('href'));
                Alkaram.push({ _id: uuidv4(), name, image, price, brand: "Alkaram", detailPage, isMyProduct: false });
            }
        }
        // if Ends here

        // scrap diners
        await page.goto('https://diners.com.pk/');
        await page.waitForSelector('.search-form');
        await page.click('.icon-search');
        await page.waitForSelector('.header-search__input');
        // fill the input
        await page.focus('.header-search__input');
        await page.keyboard.type(word);
        await page.click('button.icon-search');
        await page.waitForNavigation({ waitUntil: 'domcontentloaded' });
        if (await page.$('.products-grid')) {
            // await page.waitForSelector('.products-grid');
            lis = await page.$$('.products-grid > .grid-item');
            lis.length > 8 ? loopLimit = 8 : loopLimit = lis.length;
            for (let i = 0; i < loopLimit; i++) {
                const name = await lis[i].$eval('.product-title > span', name => name.innerText);
                const image = await lis[i].$eval('a.product-grid-image > img', img => img.getAttribute('src'));
                let price = null;
                await lis[i].$('.price-sale') ? price = await lis[i].$eval('.special-price > span', p => Number(p.innerText.replace(/[Rs,.]/gi, "").slice(0, 4))) :
                    price = await lis[i].$eval('.money', p => Number(p.innerText.replace(/[Rs,.]/gi, "").slice(0, 4)));
                const detailPage = await lis[i].$eval('.product-image > a', l => "https://diners.com.pk/" + l.getAttribute('href'));
                Diners.push({ _id: uuidv4(), name, image, price, brand: "Diners", detailPage, isMyProduct: false });
            }
        }
        // if ends here
        await browser.close();
        return res.status(200).json({ Almirah, GulAhmed, Alkaram, Diners });
    } catch (e) {
        await browser.close();
        console.log(e);
        return res.status(400).json({ msg: "Error!! : Products not found with this search or " + e, Almirah, GulAhmed, Alkaram, Diners });
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
            }, 80);
        });
    });
}

// fetch Bids for user to see
router.get("/view-bids/:id", async (req, res) => {
    const { id } = req.params;
    await Bid.find({ productID: id }, async (err, bids) => {
        if (!err) {
            await AuctionProduct.findOne({ _id: id }, (err, product) => {
                if (!err) {
                    return res.status(200).json({ product, bids });
                } else { return res.status(400).json({ msg: "Error in finding Auction Product!" }); }
            })
        } else { return res.status(400).json({ msg: "Error in finding bids!" }); }
    });
})
module.exports = router;