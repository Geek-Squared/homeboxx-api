const mongoose = require('mongoose');

const InvitationSchema = new mongoose.Schema({
  email: { type: String, required: true },
  organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

module.exports = mongoose.model('Invitation', InvitationSchema);