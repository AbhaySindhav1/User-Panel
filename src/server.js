const express = require("express");
const hbs = require("hbs");
const path = require("path");
require("../DATABASE/dbConnect");
const User = require("../MODELS/UserModel");
const userRoute = require("../ROUTERS/userRoute");
var bodyParser = require("body-parser");
var cors = require('cors')

const app = express();
app.use(cors())
app.use(express.json());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
app.use(userRoute);



const pat = path.join(__dirname, "../public");

app.use(express.static(pat));
app.set("view engine", "hbs");

app.listen(3000, () => {
  console.log(`server is started at port : 3000`);
});
