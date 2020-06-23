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
    shipping_address:{
        type: String,
    },
    account_id:{
        type: Schema.Types.ObjectId,
        require: true,
        ref: "Account"
    }
},
    { timestamps: true }
);

module.exports = mongoose.model("Person", personSchema);