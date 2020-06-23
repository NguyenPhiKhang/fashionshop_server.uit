const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categorySchema = new Schema(
    {
        category_code:{
            type: Number
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
    }
);

module.exports = mongoose.model("Category", categorySchema);