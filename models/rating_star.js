const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ratingStarSchema = new Schema({
    star1: Number,
    star2: Number,
    star3: Number,
    star4: Number,
    star5: Number,
    total_star: Number,
    product_id: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: "Product"
    }
});

module.exports = mongoose.model("RatingStar", ratingStarSchema);