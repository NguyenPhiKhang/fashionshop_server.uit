const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const attributeProductSchema = new Schema({
    attribute_code: {
        type: Number,
        required: true
    },
    product_code: {
        type: Number,
        require: true
    },
    value: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Option'
        }
    ]
});
module.exports = mongoose.model("AttributeProduct", attributeProductSchema);