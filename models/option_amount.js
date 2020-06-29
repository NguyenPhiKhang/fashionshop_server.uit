const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const optionAmount = new Schema({
    option_code: {
        type: Number,
        required: true,
    },
    attribute_option_code: {
        type: Number,
        require: true,
    },
    amount: {
        type: Number
    }
});

module.exports = mongoose.model("Option_Amount", optionAmount);