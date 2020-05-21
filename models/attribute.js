const mongoose = require("mongoose");

const attributeSchema = new mongoose.Schema({
    name:{
        type: String,
        require: true
    },
    value:[
        
    ]
})