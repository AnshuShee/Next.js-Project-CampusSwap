const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Listing title is required'],
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      required: [true, 'Listing description is required'],
    },
    price: {
      type: Number,
      default: 0,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: ['Books', 'Electronics', 'Furniture', 'Stationery', 'Other'],
    },
    condition: {
      type: String,
      required: true,
      enum: ['New', 'Like New', 'Good', 'Fair'],
    },
    listingType: {
      type: String,
      required: true,
      enum: ['For Sale', 'Free', 'Exchange'],
      default: 'For Sale',
    },
    exchangePreference: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['Available', 'Reserved', 'Sold', 'Inactive'],
      default: 'Available',
    },
    location: {
      type: String,
      required: true,
      default: 'Hostel Block A',
    },
    images: {
      type: [String],
      default: [],
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Business validation: Price must be 0 if Free or Exchange
listingSchema.pre('save', function (next) {
  if (this.listingType === 'Free' || this.listingType === 'Exchange') {
    this.price = 0;
  }
  next();
});

module.exports = mongoose.model('Listing', listingSchema);
