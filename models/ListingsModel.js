const mongoose = require('mongoose');

const ListingSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  listingType: {
    type: String,
    enum: ['Rent', 'Sale'],
    required: false
  },
  propertyArea: Number,
  priceFrequency: {
    type: String,
    enum: ['Week', 'Month', 'Year'],
    required: false,
    get: function(value) {
      return this.listingType === 'Sale' ? value : undefined;
    }
  },
  propertyType: {
    type: String,
    enum: ['House', 'Flat', 'Townhouse', 'Cottage', 'Stand', 'Land', 'Farm', 'Commercial Property', 'Industrial Property'],
    required: false
  },
  propertyAreaUnit: {
    type: String,
    enum: ['sqm', 'acres', 'hectares'],
    required: false,
    get: function(value) {
      return this.listingType === 'Sale' ? value : undefined;
    }
  },
  location: String,
  bedrooms: Number,
  bathrooms: Number,
  lounges: Number,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  imageUrl: [String],
  additionalFeatures: [
    {
      name: String,
      description: String,
    }
  ],
  amenities: [String],
});

module.exports = mongoose.model('Listing', ListingSchema);