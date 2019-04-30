// //https://stackoverflow.com/questions/41461517/deploy-two-separate-heroku-apps-from-same-git-repo/41466169#41466169

const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("morgan");
const Data = require("./data");

// Create the server
const app = express()
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Mixing it up on port ${PORT}`)
})

const router = express.Router();
const path = require('path');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

//CORS
app.use(cors());
app.use("/api", router);

//DB
require('dotenv').config({path:'./.env'})


// this is our MongoDB database
const dbRoute = process.env.URI;

// // connects our back end code with the database
mongoose.connect(
  dbRoute,
  { useNewUrlParser: true, useFindAndModify: false }
);

let db = mongoose.connection;

db.once("open", () => console.log("[CONNECTED TO THE DATABASE]"));

// checks if connection with the database is successful
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// (optional) only made for logging and
// bodyParser, parses the request body to be a readable json format
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger("dev"));

// // this is our get method
// // this method fetches all available data in our database
router.get("/getData", (req, res) => {
  Data.find((err, data) => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true, data: data });
  });
});

// this is our update method
// this method overwrites existing data in our database
router.post("/updateData", (req, res) => {
  const { id, update } = req.body;
  Data.findOneAndUpdate(id, update, err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// this is our delete method
// this method removes existing data in our database
router.delete("/deleteData", (req, res) => {
  // console.log(req.body)
  const { id } = req.body;
  Data.findOneAndDelete(id, err => {
    if (err) return res.send(err);
    return res.json({ success: true });
  });
});

// this is our create methid
// this method adds new data in our database
router.post("/putData", (req, res) => {
  let data = new Data();

  const { id, name,city,loc,desc,lat,lon,lm1,lm2 } = req.body;

  if ((!id && id !== 0)) {
    return res.json({
      success: false,
      error: "INVALID INPUTS"
    });
  }

    data.id=    id,
    data.name=  name,
    data.city=  city,
    data.loc=   loc,
    data.desc=  desc,
    data.lat=   lat,
    data.lon=   lon,
    data.lm1=   lm1,
    data.lm2=   lm2
    
  data.save(err => {
    if (err) return res.json({ success: false, error: err });
    return res.json({ success: true });
  });
});

// // append /api for our http requests

// //Static file declaration
app.use(express.static(path.join(__dirname, '/client/build')));

//production mode
if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  } else {
  //
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/build/index.html'));
  })
}