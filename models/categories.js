const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categoriesSchema = new Schema({
    category_level1_id: {
        type: Schema.Types.ObjectId,
        require: true
    },
    category_level2_id: {
        type: Schema.Types.ObjectId,
        require: true
    },
    category_level3_id: {
        type: Schema.Types.ObjectId,
        require: true
    },
    products: [
        {
            type: Schema.Types.ObjectId,
            ref: "Product"
        }
    ]
});

module.exports = mongoose.model("Categories", categoriesSchema);