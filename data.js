//backend/data.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure 
const DataSchema = new Schema(
  {
    id: Number,
    name: String,
    city: String,
    loc: String,
    desc: String,
    lat: Number,
    lon: Number,
    lm1: String,
    lm2: String
  }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Data", DataSchema);