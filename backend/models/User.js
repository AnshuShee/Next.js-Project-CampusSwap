const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide student name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'College email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    department: {
      type: String,
      required: true,
      default: 'B.Tech General',
    },
    year: {
      type: String,
      enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgrad'],
      default: '2nd Year',
    },
    hostelOrLocation: {
      type: String,
      required: true,
      default: 'Main Campus',
    },
    contactPreference: {
      type: String,
      enum: ['WhatsApp', 'Email', 'In-App'],
      default: 'WhatsApp',
    },
    phoneOrHandle: {
      type: String,
      default: '',
    },
    savedListings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
      },
    ],
  },
  { timestamps: true }
);

// Hash password before saving to DB
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password helper method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
