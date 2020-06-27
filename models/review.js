const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    person_id: {
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
    image:[{
        type: String
    }],
    star: Number
},
    { timestamps }
);

module.exports = mongoose.model("Review", reviewSchema);