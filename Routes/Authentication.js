require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require("../Modals/User");
const auth = require("../Middlewares/auth");
const owasp = require('owasp-password-strength-test');
const nodemailer = require('nodemailer');

// check Authentication
router.get("/checkauth", auth, (req, res) => res.sendStatus(200));

router.post("/login", (req, res) => {
    const { email, password } = req.body;

    // check if user Exists
    User.findOne({ email }).then(user => {
        if (!user) return res.status(400).json({ msg: ["User does not exists."] });

        // Validate user password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (!isMatch) return res.status(400).json({ msg: ["Invalid Credentials."] });

            jwt.sign({ id: user._id },
                process.env.JWT_SECRET,
                { expiresIn: 3600 },
                (err, token) => {
                    if (err) return res.status(400).json({ msg: ["Error in creating token."] })

                    return res.status(200).json({ token, user: { userID: user._id, name: user.name, email: user.email } });
                });
        });
    });
});

// User Registration Route 
router.post("/registration", (req, res) => {
    const { name, email, password, password2 } = req.body;

    // Simple Validation
    if (password !== password2) {
        return res.status(400).json({ msg: ["Both Password fields does not match"] });
    }
    function validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
    // check if not valid email address format
    if (validateEmail(email) === false) {
        return res.status(400).json({ msg: ["Email is not valid"] });
    }
    // check remaining validations in 
    const result = owasp.test(password);
    if (result.errors.length > 0) {
        return res.status(400).json({ msg: result.errors });
    }

    // Check if user Already Exist
    User.findOne({ email }).then(user => {
        if (user) return res.status(400).json({ msg: ["User already exists"] });

        // If user not emist then register here
        const newUser = new User({
            name,
            email,
            password
        });

        // Hast and Salt password Process
        bcrypt.genSalt(10, (err, Salt) => {
            if (err) throw err;
            bcrypt.hash(newUser.password, Salt, (err, hash) => {
                if (err) throw err;

                newUser.password = hash;
                newUser.save().then(user => {

                    // sigining JWT token here
                    jwt.sign({ id: user._id },
                        process.env.JWT_SECRET,
                        { expiresIn: 3600 },
                        (err, token) => {
                            if (err) throw err;

                            return res.status(200).json({
                                token,
                                user: {
                                    userID: user._id,
                                    name: user.name,
                                    email: user.email
                                }
                            });
                        });
                });
            });
        });

    });
});

router.post("/login-admin", (req, res) => {
    const { email, password } = req.body;

    // check if user Exists
    User.findOne({ $and: [{ email }, { isAdmin: true }] }).then(user => {
        if (!user) return res.status(400).json({ msg: "Your role is not defiend as Admin." });

        // Validate user password
        bcrypt.compare(password, user.password).then(isMatch => {
            if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials." });

            jwt.sign({ id: user._id },
                process.env.ADMIN_JWT_SECRET,
                { expiresIn: 3600 },
                (err, token) => {
                    if (err) return res.status(400).json({ msg: "Error in creating token." })

                    return res.status(200).json({ token, user: { userID: user._id, name: user.name, email: user.email } });
                });
        });
    });
});

// Forgot password
router.put("/forgot-password", async (req, res) => {
    const { email, url } = req.body;
    await User.findOne({ email }, async (err, user) => {
        if (err || !user) return res.status(400).json({ msg: "Email dose not exist" });

        const token = jwt.sign({ _id: user._id }, process.env.PASS_RESECT_SECRET, { expiresIn: '30m' });
        // now ready to send getEmails
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'mytestingemail12341@gmail.com',
                pass: 'Arise123$'
            }
        });
        const path = url + "/" + token;
        const mailOptions = {
            from: 'mytestingemail12341@gmail.com',
            to: email,
            subject: 'Sending Email for password reset.',
            text: 'Click below link to reset the password',
            html: '<p>Click <a href="' + path + '">here</a> to reset your password</p>'
        };

        await user.updateOne({ token }, (err, success) => {
            if (err) return res.status(400).json({ msg: "Error in Updating token in database" });

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    return res.status(400).json({ msg: "Error in Sending email process!" })
                } else {
                    return res.status(200).json({ msg: "Email has been send now follow the instructions" });
                }
            });
        });


    });
});

// update forgot password
router.put("/reset-password", (req, res) => {
    const { token, password1, password2 } = req.body;

    if (token) {
        if (password1 !== password2) {
            return res.status(400).json({ msg: ["Password Fields are mismatched"] });
        }

        // check remaining validations in 
        const result = owasp.test(password1);
        if (result.errors.length > 0) {
            return res.status(400).json({ msg: result.errors });
        }

        jwt.verify(token, process.env.PASS_RESECT_SECRET, async (err, decode) => {
            if (err) return res.status(400).json({ msg: ["Token is expired go back and try again."] });

            await User.findOne({ token }, async (err, user) => {
                if (err || !user) return res.status(400).json({ msg: ["User with this token dose not exist"] });

                // Hast and Salt password Process
                bcrypt.genSalt(10, (err, Salt) => {
                    if (err) throw err;
                    bcrypt.hash(password1, Salt, async (err, hash) => {
                        if (err) throw err;
                        await user.updateOne({ password: hash, token: "" }, (err, success) => {
                            if (err) return res.status(400).json({ msg: ["Error in updating password!"] });

                            return res.status(200).json({ msg: ["Your password have been changed!"] });

                        });
                    });
                });

            });
        });
    } else { return res.status(400).json({ msg: ["Authentication error!!"] }); }
});
module.exports = router;