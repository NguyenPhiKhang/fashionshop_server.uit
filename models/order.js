const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema({
    person_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Person"
    },
    price_ship: {
        type: Number,
    },
    total_price: {
        type: Number,
        require: true
    },
    address: {
        type: String,
        require: true
    },
    method_payment: {
        type: String
    },
    carts: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Cart'
        }
    ],
    shipping_unit: {
        type: String
    },
    delivery_status: {
        type: String
    },
},
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);