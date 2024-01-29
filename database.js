const mongoose = require("mongoose");
require('dotenv').config();


const connectdb = () => {
    mongoose.connect(process.env.MONGODB_URL)
        .then(() => {
            console.log("connected to db");
        })
        .catch((err) => {
            console.log(err);
            process.exit(1);
        });
};


module.exports = connectdb;