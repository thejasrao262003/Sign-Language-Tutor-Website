const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/Registration").then(()=>{
    console.log("Connection succesful")
}).catch((e)=>{
    console.log("Connection Unsuccessful");
})