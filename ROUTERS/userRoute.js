const express = require("express");
const fs = require("fs");
const path = require("path");
const Handlebars = require("handlebars");
const app = express();
const User = require("../MODELS/UserModel");
const router = new express.Router();
var bodyParser = require("body-parser");

// Handlebars.registerHelper('times', function(n, block) {
//   var accum = '';
//   for(var i = 0; i < n; ++i)
//       accum += block.fn(i);
//   return accum;
// });

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/UploadedImages/");
  },
  filename: function (req, file, cb) {
    if (file) cb(null, Date.now() + file.originalname);
  },
});
const upload = multer({ storage: storage });

//                                                              //      Create A User    //                                                                  //
router.post("/user", upload.single("profile"), async (req, res) => {
  // console.log("1");
  // console.log(req.body.phone);
  if (req.file) {
    req.body.profile = req.file.filename;
  } else {
    req.body.profile = "";
  }

  const user = new User(req.body);

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
  const usersPerPage = 5;
  const currentPage = req.query.page || 1;

  const totalUsers = await User.countDocuments({});
  const totalPages = Math.ceil(totalUsers / usersPerPage);

  const hasPreviousPage = currentPage > 1;
  const previousPage = currentPage - 1;

  const hasNextPage = currentPage < totalPages;
  const nextPage = currentPage + 1;

  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;

  const users = await User.find().skip(startIndex).limit(usersPerPage);

  // console.log(totalUsers);

  res.render("index", {
    users,
    totalPages,
    currentPage,
    hasPreviousPage,
    previousPage,
    hasNextPage,
    nextPage,
  });
});

//                                                         Get  Users   //                                                                  //

router.get("/userAll", async (req, res) => {
  // console.log(req.query);

  const usersPerPage = 5;
  const currentPage = req.query.page || 1;
  // console.log(currentPage);

  const totalUsers = await User.countDocuments({});
  const totalPages = Math.ceil(totalUsers / usersPerPage);

  const hasPreviousPage = currentPage > 1;
  const previousPage = currentPage - 1;

  const hasNextPage = currentPage < totalPages;
  const nextPage = currentPage + 1;

  const startIndex = (currentPage - 1) * usersPerPage;
  const endIndex = startIndex + usersPerPage;

  const users = await User.find().skip(startIndex).limit(usersPerPage);

  res.send({ users, totalPages });
});

//                                                         Get  User    //                                                                  //

router.get("/users", async (req, res) => {
  const searchQuery = req.body.data;

  const usersPerPage = 5;
  const currentPage = req.query.page || 1;
  const startIndex = (currentPage - 1) * usersPerPage;

// console.log(startIndex);
//   console.log(req.query.searchValue);
//   console.log(currentPage);

  const regext = new RegExp(req.query.searchValue, "i");
  try {
    const users = await User.find({
      $or: [
        { name: regext },
        { email: regext },
        { phone: regext },
        { country: regext },
      ],
    }).skip(startIndex).limit(usersPerPage);

    const totalUsers = await User.find({
      $or: [
        { name: regext },
        { email: regext },
        { phone: regext },
        { country: regext },
      ],
    }).countDocuments({});


    
    // console.log(totalUsers);
    // console.log(users.length);
    const totalPages = Math.ceil(totalUsers / usersPerPage);

    res.send({users,totalPages});

    if (!users) {
      return res.send("No User Found");
    }
  } catch (error) {
    res.send(error);
  }
});

//                                                              //      Update A User    //                                                                  //

router.put("/user/update",upload.single("profile"), async (req, res) => {
  if (req.file) {
    req.body.profile = req.file.filename;
  } else {
    req.body.profile = "";
  }
  
  const reqid = req.body._id;
  const trimedId = reqid.trim();
  const FieldForUpdate = Object.keys(req.body);
  try {
    const user = await User.findById(trimedId);
    FieldForUpdate.forEach((Propertie) => {
      user[Propertie] = req.body[Propertie];
    });
    await user.save();
    res.status(200).send(user);
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

//                                                              //      Delete A User    //                                                                  //

router.delete("/user/delete", async (req, res) => {
  try {
    // console.log(req.body._id);
    const user = await User.findByIdAndDelete(req.body._id);
    const image = `public/UploadedImages/${user.profile}`

    // console.log(image);
    fs.unlink(image, (err) => {
      if (err) {
        console.error(`Error deleting image file ${image}: ${err}`);
      } else {
        console.log(`Deleted image file ${image}`);
      }
    });
    res.status(200).send(user);
  } catch (error) {
    res.status(400).send("user not found");
  }
});

//                                                              //      Export Module    //                                                                  //

module.exports = router;
