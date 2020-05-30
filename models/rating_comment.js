const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ratingCommentSchema = new Schema({
    customer_id:{
        type: Schema.Types.ObjectId,
        require: true
    },
    
});

module.exports = mongoose.model("RatingComment", ratingCommentSchema);