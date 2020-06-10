const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const attributeOptionSchema = new Schema({
    attribute_id:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Attribute"
    },
    product_id:{
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'Product'
    },
    value:[
        {
            option_id: {
                type: Schema.Types.ObjectId,
                ref: 'Option_Amount'
            }
        }
    ]
});
module.exports = mongoose.model("Attribute_Option", attributeOptionSchema);