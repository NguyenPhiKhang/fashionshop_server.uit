const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    customer_id: {
        type: Schema.Types.ObjectId,
        require: true
    },
    product_id: {
        type: Schema.Types.ObjectId,
        required: true
    },
    data: {
        type: String
    },
},
    { timestamps }
);

module.exports = mongoose.model("Review", reviewSchema);