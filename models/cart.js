const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const cartSchema = new Schema({
    person_id:{
        type: Schema.Types.ObjectId,
        ref: "Person",
        require: true
    },
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
    isOrder: {
        type: Boolean,
        require: true,
        default: false
    },
    isReview: {
        type: Boolean,
        default: false
    }
});

module.exports = mongoose.model("Cart", cartSchema);