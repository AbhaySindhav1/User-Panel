const express = require("express");
const { listIndexes } = require("../MODELS/UserModel");
const app = express();
const User = require("../MODELS/UserModel");
const router = new express.Router();
var bodyParser = require("body-parser");


const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/UploadedImages/");
  },
  filename: function (req, file, cb) {
    if (file) cb(null,  Date.now()+file.originalname);
  },
});
const upload = multer({ storage: storage });

//                                                              //      Create A User    //                                                                  //
router.post("/user", upload.single("profile"), async (req, res) => {
  const user = new User({
    profile: req.file.filename,
    name: req.body.name,
    email: req.body.email,
    country: req.body.country,
    phone: req.body.phone,
  });
  try {
    await user.save();
    return res.status(201).json(user);
  } catch (error) {
    if (error.errors && error.errors.email) {
      res.status(400).send(error.errors.email.message);
    } else if (error.errors && error.errors.phone.message) {
      res.status(400).send(error.errors.phone.message);
    } else if (error.keyValue && error.keyValue.email) {
      res.status(400).send("Email is already registered");
    } else if (error.keyValue && error.keyValue.phone) {
      res.status(400).send("phone number is already registered");
    }
  }
});

//                                                              //      render  User    //                                                                  //

router.get("/userShow", async (req, res) => {
  const users = await User.find({});
  res.render("index", { users });
});


//                                                         Get  User    //                                                                  //

router.get("/users", async (req, res) => {
  const searchQuery = req.body.data;
 
  console.log(req.query.searchValue)
  const regext = new RegExp(req.query.searchValue,"i");
  try {
    const users = await User.find({
      $or: [
        { name: regext },
        { email: regext },
        { phone: regext },
        { country: regext },
      ],
    });

    res.send(users);

    if (!users) {
      return res.send("No User Found");
    }
  } catch (error) {
    res.send(error);
  }
});

//                                                              //      Update A User    //                                                                  //

router.put("/user/update", async (req, res) => {

  const FieldForUpdate = Object.keys(req.body);
 
  const reqid =req.body.id
  const trimedId = reqid.trim();
  try {
    
    const user = await User.findById(trimedId);
    FieldForUpdate.forEach((Propertie) => {
      user[Propertie] = req.body[Propertie];
    });
    await user.save();
    res.status(200).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

//                                                              //      Delete A User    //                                                                  //

router.delete("/user/delete", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.body._id);

    res.status(200).send(user);
  } catch (error) {
    res.status(400).send("user not found");
  }+ encodeURIComponent($("#nameSearch").val())+ "&page=" + page
});

//                                                              //      Export Module    //                                                                  //

module.exports = router;
