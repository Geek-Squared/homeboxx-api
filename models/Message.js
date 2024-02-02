const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  from: String,
  to: String,
  subject: String,
  text: String,
});

module.exports = mongoose.model('Message', messageSchema);