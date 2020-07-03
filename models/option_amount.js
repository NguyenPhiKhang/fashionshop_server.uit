const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const optionAmount = new Schema({
    option_color: {
        type: Schema.Types.ObjectId,
        ref: "Option"
    },
    option_size: {
        type: Schema.Types.ObjectId,
        ref: "Option"
    },
    product_code: {
        type: Number,
        require: true,
    },
    amount: {
        type: Number
    }
});

module.exports = mongoose.model("OptionAmount", optionAmount);