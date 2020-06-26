const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const attributeSchema = new Schema({
    attribute_code:{
        type: Number,
        require: true
    },
    name:{
        type: String,
        require: true
    },
    value:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Option'
        }
    ]
});

module.exports = mongoose.model("Attribute", attributeSchema);