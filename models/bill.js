const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const billSchema = new Schema({
    person_id:{
        type: Schema.Types.ObjectId,
        require: true
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
    orders: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Order'
        }
    ],
    delivery_status_: {
        type: String
    },
    isDone: Boolean
},
    { timestamps: true }
);

module.exports = mongoose.model("Bill", billSchema);