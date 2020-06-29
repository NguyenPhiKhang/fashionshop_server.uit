const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const attributeOptionSchema = new Schema({
    attr_opt_code: {
        type: Number,
        required: true
    },
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
            ref: 'Option_Amount'
        }
    ]
});
module.exports = mongoose.model("Attribute_Option", attributeOptionSchema);