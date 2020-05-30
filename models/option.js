const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const optionSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    image: {
        type: String
    },
    type_option : String
});

module.exports = mongoose.model("Option", optionSchema);