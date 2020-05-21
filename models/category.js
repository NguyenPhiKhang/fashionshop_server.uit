const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categorySchema = new Schema(
    {
        name: {
            type: String,
            require: true
        },
        icon: { type: String },
        parent_id: {
            type: String
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);