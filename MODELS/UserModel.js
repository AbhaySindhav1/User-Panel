const mongoose = require("mongoose");
const validator = require("validator");

// mongoose.set("strictQuery",true)

const userSchema = mongoose.Schema({
  profile: {
    type: String,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Please Enter Valid Email Address");
      }
    },
  },
  country: {
    type: String,
    required: true,
    trim: true,
  },

  phone: {
    type: String,
    required: true,
    validate(value) {
      if (validator.isMobilePhone(value)) {
        throw new Error("enter valid phone");
      }
      // const number =value.split(" ")
      // const rightNumber = number.join("")
      // return rightNumber
    },
  },
});

const User = mongoose.model("user", userSchema);

module.exports = User;
