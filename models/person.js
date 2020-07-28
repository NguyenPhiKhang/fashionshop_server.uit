const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const personSchema = new Schema({
    name: {
        type: String
    },
    avatar: {
        type: String
    },
    sex:{
        type: String,
    },
    number_phone:{
        type: String,
    },
    birthday:{
        type: Date
    },
    shipping_address:[{
        type: String,
    }],
    account_id:{
        type: Schema.Types.ObjectId,
        ref: "Account"
    },
    favorites: [{
        type: Schema.Types.ObjectId,
        ref: "Product"
    }],
    carts: [{
        type: Schema.Types.ObjectId,
        ref: "Cart"
    }],
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }],
    record_status: {
        type: Boolean,
        default: true
    }
},
    { timestamps: true }
);

module.exports = mongoose.model("Person", personSchema);