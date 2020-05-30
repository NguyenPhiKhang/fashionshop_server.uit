const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sysGenIdSchema = new Schema({
    name_schema:{
        type: String
    },
    value:{
        type: Number
    }
});

module.exports = mongoose.model("SysGenId", sysGenIdSchema);