const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Listing = require('../models/Listing');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'super_secret_college_marketplace_key_2026', {
    expiresIn: '7d',
  });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, department, year, hostelOrLocation, contactPreference, phoneOrHandle } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Student with this email already registered' });
    }

    const user = await User.create({
      name,
      email,
      password,
      department: department || 'B.Tech CSE',
      year: year || '2nd Year',
      hostelOrLocation: hostelOrLocation || 'Hostel Block A',
      contactPreference: contactPreference || 'WhatsApp',
      phoneOrHandle: phoneOrHandle || '',
    });

    res.status(201).json({
      success: true,
      token: generateToken(user._id),
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        department: user.department,
        year: user.year,
        hostelOrLocation: user.hostelOrLocation,
        contactPreference: user.contactPreference,
        phoneOrHandle: user.phoneOrHandle,
        savedListings: user.savedListings,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        token: generateToken(user._id),
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          department: user.department,
          year: user.year,
          hostelOrLocation: user.hostelOrLocation,
          contactPreference: user.contactPreference,
          phoneOrHandle: user.phoneOrHandle,
          savedListings: user.savedListings,
        },
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid college email or password' });
    }
  } catch (error) {
    next(error);
  }
};

exports.getDemoUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password').limit(5);
    res.json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
};

exports.demoLogin = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'Demo user not found' });
    }

    res.json({
      success: true,
      token: generateToken(user._id),
      user,
    });
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'Student profile not found' });
    }

    const activeListings = await Listing.find({
      seller: req.params.id,
      status: { $in: ['Available', 'Reserved'] },
    }).sort({ createdAt: -1 });

    const soldListings = await Listing.find({
      seller: req.params.id,
      status: 'Sold',
    }).sort({ updatedAt: -1 });

    res.json({
      success: true,
      profile: user,
      activeListings,
      soldListings,
    });
  } catch (error) {
    next(error);
  }
};

exports.toggleFavorite = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const listingId = req.params.listingId;

    const isFav = user.savedListings.some((id) => id.toString() === listingId);

    if (isFav) {
      user.savedListings = user.savedListings.filter((id) => id.toString() !== listingId);
    } else {
      user.savedListings.push(listingId);
    }

    await user.save();
    res.json({
      success: true,
      isFavorite: !isFav,
      savedListings: user.savedListings,
    });
  } catch (error) {
    next(error);
  }
};

exports.getFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: 'savedListings',
      populate: { path: 'seller', select: 'name hostelOrLocation department' },
    });

    res.json({
      success: true,
      favorites: user.savedListings,
    });
  } catch (error) {
    next(error);
  }
};
