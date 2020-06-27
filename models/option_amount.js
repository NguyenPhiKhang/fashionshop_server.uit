const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const optionAmount = new Schema({
    option_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Option"
    },
    attribute_option_id: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: "Attribute_Option"
    },
    amount: {
        type: Number
    }
});

module.exports = mongoose.model("Option_Amount", optionAmount);