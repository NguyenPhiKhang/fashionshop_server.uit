const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const attributeSchema = new Schema({
    name:{
        type: String,
        require: true
    }
});

module.exports = mongoose.model("Attribute", attributeSchema);