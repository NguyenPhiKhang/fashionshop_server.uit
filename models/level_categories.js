const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const levelCategoriesSchema = new Schema({
    category_level1_id: {
        type: Number,
        require: true
    },
    category_level2_id: {
        type: Number,
        require: true
    },
    category_level3_id: {
        type: Number,
        require: true
    },
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: "Product"
        }
    ]
});

module.exports = mongoose.model("LevelCategories", levelCategoriesSchema);