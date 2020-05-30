const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ratingStarSchema = new Schema({
    star1: Number,
    star2: Number,
    star3: Number,
    star4: Number,
    star5: Number
});

module.exports = mongoose.model("RatingStar", ratingStarSchema);