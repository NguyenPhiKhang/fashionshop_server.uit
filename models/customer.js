const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const customerSchema = new Schema({
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
    shipping_address:{
        type: String,
    },
    user_id:{
        type: Schema.Types.ObjectId
    }
},
    { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema);