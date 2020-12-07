require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
// const schedule = require('node-schedule');
// const { CheckAution } = require("./GlobalFuntions/index");

// inittiozing express server
const app = express();

// App middlewares
app.use(cors());
app.use(express.json());

// connecting with mongodb Atlus
mongoose.connect("mongodb+srv://Noman12341:" + process.env.DB_PASS + "@fyp-mern-cluster.ibv25.mongodb.net/<dbname>?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false })
    .then(() => {
        console.log("MongoDB is connected.");
    }).catch(err => {
        throw err;
    });

app.use("/api/products", require("./Routes"));
app.use("/api/auth", require("./Routes/Authentication"));
app.use("/api/payment", require("./Routes/Paymen"));
app.use("/api/admin", require("./Routes/Admin"));
app.use("/static", express.static(path.join(__dirname + '/Public')));


// Assiging port number
const PORT = process.env.PORT || 4000;

// product Build
if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'staging') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname + '/client/build/index.html'));
    });
}
// below Function runs every day midnight
// var job = schedule.scheduleJob('0 0 * * *', CheckAution());

app.listen(PORT, () => {
    console.log("server is running at port " + PORT);
});