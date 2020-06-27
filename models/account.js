const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const accountSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  permission_id:{
    type: Schema.Types.ObjectId,
    require: true
  },
  person_id: {
    type: Schema.Types.ObjectId,
    require: true,
    ref: "Person"
  },
  record_status: {
    type: Boolean,
    require: true
  }
});

module.exports = mongoose.model('Account', accountSchema);