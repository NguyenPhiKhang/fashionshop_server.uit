const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    product_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Product"
    },
    option_amount_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "OptionAmount"
    },
    amount: {
        type: Number,
        require: true
    },
    price_order: {
        type: Number
    },
});

module.exports = mongoose.model("Order", orderSchema);