const mongoose = require('mongoose');

const OrganizationSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  address: { type: String },
  logo: { type: String },
  primaryColor: { type: String },
  secondaryColor: { type: String },
  phoneNumber: { type: String },
  email: { type: String },
  website: { type: String },
  socialMediaLinks: { type: Map, of: String },
  description: { type: String },
  industry: { type: String },
  size: { type: Number },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  logoFormat: { type: String },
  brandingGuidelines: { type: String },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('Organization', OrganizationSchema);