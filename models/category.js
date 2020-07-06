const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categorySchema = new Schema(
    {
        category_code:{
            type: Number,
            require: true
        },
        name: {
            type: String,
            require: true
        },
        icon: { type: String },
        level_cat:{type: Number},
        parent_id: {
            type: Schema.Types.ObjectId
        },
        image: String,
        type_size: String
    }
);

module.exports = mongoose.model("Category", categorySchema);