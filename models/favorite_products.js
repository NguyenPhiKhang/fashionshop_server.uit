const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const favoriteProductSchema = new Schema({
    product_id:{
        type: Schema.Types.ObjectId,
        require: true,
        ref: "Product"
    },
    person_id:{
        type: Schema.Types.ObjectId,
        require: true,
        ref: "Person"
    }
});

module.exports = mongoose.model("FavoriteProduct", favoriteProductSchema);