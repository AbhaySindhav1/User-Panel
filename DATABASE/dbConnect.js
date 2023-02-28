const mongoose = require("mongoose");

mongoose.set('strictQuery', true);

mongoose.connect("mongodb://localhost:27017/User_Data" , ()=>{
    console.log("connected successfully");
});
 
