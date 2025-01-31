const mongoose = require("mongoose");
require('dotenv').config();

const URL = process.env.DB_URL;

mongoose.connect(URL).then (()=> {console.log("Connection successful")});

module.exports = mongoose;