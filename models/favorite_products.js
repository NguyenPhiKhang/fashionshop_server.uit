const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const favoriteProductSchema = new Schema({
    product_id:{
        type: Schema.Types.ObjectId,
        require: true,
    },
    person_id:{
        type: Schema.Types.ObjectId,
        require: true,
    }
});

module.exports = mongoose.model("FavoriteProduct", favoriteProductSchema);