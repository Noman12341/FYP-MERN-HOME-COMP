require('dotenv').config();
const jwt = require("jsonwebtoken");

function AdminAuth(req, res, next) {
    const token = req.header("x-admin-token");
    if (!token) return res.status(401).json({ msg: "No token, authorization denied" });

    try {
        const decode = jwt.verify(token, process.env.ADMIN_JWT_SECRET);
        req.user = decode;
        next();
    } catch (e) {
        return res.status(400).json({ msg: "Token is not valid." });
    }

}
module.exports = AdminAuth;