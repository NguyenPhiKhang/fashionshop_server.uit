const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const optionAmount = new Schema({
    option_id:{
        type: Schema.Types.ObjectId,
        required: true,
        ref:"Option"
    },
    amount:{
        type: Number
    }
});

module.exports = mongoose.model("Option_Amount", optionAmount);