const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const permissionSchema = new Schema({
    name:{
        type: String
    },
    desc: {
        type: String,
    }
});

module.exports = mongoose.model('User', userSchema);