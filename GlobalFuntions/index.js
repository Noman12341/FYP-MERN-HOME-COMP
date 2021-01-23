const AuctionProduct = require("../Modals/AuctionProduct");
const FinishedAuction = require("../Modals/FinishedAuctions");
const Users = require("../Modals/User");
const nodemailer = require("nodemailer");
const Product = require('../Modals/Product');
const ejs = require("ejs");
const puppeteer = require('puppeteer');


const ISODate = () => {
    const date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() + "  " + strTime;
}
const CheckAution = async () => {
    const currentDate = new Date().getDate();
    await AuctionProduct.find({}, (err, products) => {
        if (!err) {
            if (products) {
                products.forEach(async (element) => {
                    const auctionDate = new Date(element.auctionEndingDate).getDate();
                    if (currentDate === auctionDate || currentDate > auctionDate) {
                        const newFinishedAuction = new FinishedAuction({
                            userName: element.userName,
                            userID: element.userID,
                            productID: element._id,
                            productName: element.name,
                            productBrand: element.brand,
                            productCatagory: element.catagory,
                            productImg: element.image,
                            productPrice: element.currentPrice,
                            auctionEndingdate: element.auctionEndingDate
                        });
                        await newFinishedAuction.save();
                        await AuctionProduct.findOneAndDelete({ _id: element._id }, (err) => {
                            if (err) throw err;
                        });
                    }
                });
            }
        } else throw err;
    });
}

let handleEmailMarketing = async (image, name, brand, description, price) => {
    const users = await Users.find({}, (err, array) => {
        if (!err) return array;
        else throw err;
    });

    const userEmails = users.map(obj => {
        return obj.email;
    })

    // now ready to send getEmails
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'mytestingemail12341@gmail.com',
            pass: 'hkzrrzlublcbhclj'
        }
    });

    await ejs.renderFile(`${__dirname}/../Public/html/emailMarketing.ejs`, { imgSrc: req.hostname + "/static/images/" + image, pName: name, pBrand: brand, pDescription: description, pPrice: price }, async (err, data) => {
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
}

let scrapAlmirah = async (url, catagory) => {
    const URL = "https://www.almirah.com.pk";
    const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
    const page = await browser.newPage();
    await page.goto(url);

    let links = await page.evaluate(() => {
        let data = [];
        let clickableLinks = document.querySelector('#gf-products').querySelectorAll('.grid-product__content > a');
        clickableLinks.forEach(item => {
            data.push(item.getAttribute('href'));
        });
        return data;
    });

    let scrapedProducts = [];
    for (let i = 0; i < links.length; i++) {
        const fullURL = URL + links[i];
        await page.goto(fullURL);
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
            return { title, acttualPrice, imgURL, discription };
        });
        scrapedProducts.push(data);
    }
    await browser.close();

    for (let i = 0; i < scrapedProducts.length; i++) {
        const product = scrapedProducts[i];
        await Product.findOne({ name: product.title }, async (err, obj) => {
            if (!err) {
                if (!obj) {
                    const newProduct = new Product({
                        name: product.title,
                        brand: "Almirah",
                        catagory,
                        description: product.discription,
                        image: product.imgURL,
                        price: product.acttualPrice
                    });
                    await newProduct.save();
                } else { console.log("Product already exiost") }
            } else throw err;
        });
    }// loop ends here

    // Now return null so the program moves on
    return;
}

let scrapGulAhmed = async (url, catagory) => {
    const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    const links = await page.evaluate(async () => {
        let data = [];
        const productLinks = document.querySelectorAll('.cdz-product-top > a');
        productLinks.forEach(pLink => {
            data.push(pLink.getAttribute('href'))
        });
        return data;
    });

    let scrapedData = [];
    for (let i = 0; i < links.length; i++) {
        await page.goto(links[i], { waitUntil: 'domcontentloaded' });
        const data = await page.evaluate(() => {
            const img = document.querySelector('.no-sirv-lazy-load').getAttribute('src');
            const itemName = document.querySelector('.page-title > span').innerText;
            const price = document.querySelector('.price-container').innerText;
            // const description = "No description Provided.";
            const editPrice = price.replace(/[PKR,]/gi, "");
            const priceFixed = Number(editPrice);
            return {
                img,
                itemName,
                priceFixed
            }
        });
        scrapedData.push(data);
    }

    await browser.close();

    for (let i = 0; i < scrapedData.length; i++) {
        const productObj = scrapedData[i];
        await Product.findOne({ name: productObj.itemName }, async (err, found) => {
            if (!err) {
                if (!found) {
                    const newProduct = new Product({
                        name: productObj.itemName,
                        brand: "Gul Ahmed",
                        catagory,
                        description: "No Description Provided",
                        image: productObj.img,
                        price: productObj.priceFixed
                    });
                    await newProduct.save()
                }
            } else throw err;
        });
    }

    return;
}

let scrapSanaSafinaz = async (url, catagory) => {
    const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    const links = await page.evaluate(async () => {
        const tempArray = [];
        const ancherElements = document.querySelectorAll('.product-item-image > a');
        ancherElements.forEach(pLink => {
            tempArray.push(pLink.getAttribute('href'));
        });
        return tempArray;
    });

    let scrapedData = [];
    for (let i = 0; i < links.length; i++) {
        await page.goto(links[i], { waitUntil: 'domcontentloaded' });
        const scrapedObj = await page.evaluate(() => {
            const pName = document.querySelector('.page-title > span').innerText;
            const price = document.querySelector('.price-container').querySelector('.price').innerText;
            const image = document.querySelector('.no-sirv-lazy-load').getAttribute('src');
            let desElement = document.querySelector('.value > p');
            let description = desElement ? desElement.innerText : "No Description Provided.";
            // below code is used to remove PKR from price string
            const editPrice = price.replace(/[PKR,.]/gi, "");
            const PriceNum = Number(editPrice);
            const fixedPrice = parseInt(PriceNum.toString().slice(0, 4));
            return { pName, image, description, fixedPrice }
        });
        scrapedData.push(scrapedObj);
    }
    // browser closed here
    await browser.close();

    // now checkk if product alredy exist in the database.
    for (let i = 0; i < scrapedData.length; i++) {
        const productObj = scrapedData[i];
        await Product.findOne({ name: productObj.pName }, async (err, found) => {
            if (!err) {
                if (!found) {
                    const newProduct = new Product({
                        name: productObj.pName,
                        brand: "Sana Safinaz",
                        catagory,
                        description: productObj.description,
                        image: productObj.image,
                        price: productObj.fixedPrice
                    });
                    await newProduct.save();
                }
            } else throw err;
        });
    }
    return;
}

// still need to work on this
let scrapDiners = async (url, catagory) => {
    let baseUrl = "https://diners.com.pk"
    const browser = await puppeteer.launch({ headless: true, args: ["--no-sandbox"] });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    const links = await page.evaluate(() => {
        let data = [];
        const productLinks = document.querySelectorAll('.product-image > a');
        productLinks.forEach(pLink => {
            data.push(pLink.getAttribute('href'))
        });
        return data;
    });

    let scrapedData = [];
    for (let i = 0; i < links.length; i++) {
        await page.goto(baseUrl + links[i], { waitUntil: 'domcontentloaded' });
        const scrapedObj = await page.evaluate(() => {
            const pName = document.querySelector('.product-title > span').innerText;
            const price = document.querySelector('.price > span').innerText;
            const image = document.querySelector('.fancybox > img').getAttribute('src');

            let description = document.querySelector('.tab-content').innerText;
            // below code is used to remove PKR from price string
            const editPrice = price.replace(/[PKR,.Rs]/gi, "");
            const PriceNum = Number(editPrice);
            const fixedPrice = parseInt(PriceNum.toString().slice(0, 4));
            return { pName, image, description, fixedPrice }
        });
        scrapedData.push(scrapedObj);
    }
    // browser closed here
    await browser.close();

    // now checkk if product alredy exist in the database.
    for (let i = 0; i < scrapedData.length; i++) {
        const productObj = scrapedData[i];
        await Product.findOne({ name: productObj.pName }, async (err, found) => {
            if (!err) {
                if (!found) {
                    const newProduct = new Product({
                        name: productObj.pName,
                        brand: "Diners",
                        catagory,
                        description: productObj.description,
                        image: productObj.image,
                        price: productObj.fixedPrice
                    });
                    await newProduct.save();
                }
            } else throw err;
        });
    }
    return;

}
module.exports = { CheckAution, ISODate, handleEmailMarketing, scrapAlmirah, scrapGulAhmed, scrapSanaSafinaz, scrapDiners };