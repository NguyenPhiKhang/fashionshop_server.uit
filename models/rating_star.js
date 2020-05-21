const mongoose = require("mongoose");

const ratingSchema = mongoose.Schema({
    star1: Number,
    star2: Number,
    star3: Number,
    star4: Number,
    star5: Number
});

module.exports = mongoose.model("Rating", ratingSchema);