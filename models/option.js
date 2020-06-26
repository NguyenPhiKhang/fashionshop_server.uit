const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const optionSchema = new Schema({
    option_code: {
        type: Number,
        require: true
    },
    name: {
        type: String,
        require: true
    },
    attribute_id:{
        type: Schema.Types.ObjectId,
        ref: 'Attribute'
    },
    type_option: String
});

module.exports = mongoose.model("Option", optionSchema);