const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categoriesSchema = new Schema({
    category_level1_id: Number,
    category_level1_name: String,
    category_level2_id: Number,
    category_level2_name: String,
    category_level3_id: Number,
    category_level3_name: String,
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: "Product"
        }
    ]
});

module.exports = mongoose.model("Categories", categoriesSchema);