const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    // person_id: {
    //     type: Schema.Types.ObjectId,
    //     require: true
    // },
    // product_id: {
    //     type: Schema.Types.ObjectId,
    //     required: true
    // },
    cartItem_id: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: "Cart"
    },
    data: {
        type: String
    },
    images:[{
        type: String
    }],
    star: Number
},
    { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);