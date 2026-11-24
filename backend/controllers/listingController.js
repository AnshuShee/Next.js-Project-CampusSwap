const Listing = require('../models/Listing');

exports.getListings = async (req, res, next) => {
  try {
    const { search, category, condition, listingType, location, minPrice, maxPrice, sort } = req.query;

    const filter = {
      status: { $in: ['Available', 'Reserved'] },
    };

    if (category && category !== 'All') filter.category = category;
    if (condition && condition !== 'All') filter.condition = condition;
    if (listingType && listingType !== 'All') filter.listingType = listingType;
    if (location && location.trim() !== '') filter.location = { $regex: location.trim(), $options: 'i' };

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    let query;

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [{ title: searchRegex }, { description: searchRegex }];
    }

    query = Listing.find(filter).populate('seller', 'name department year hostelOrLocation');

    if (sort === 'price_asc') {
      query = query.sort({ price: 1 });
    } else if (sort === 'price_desc') {
      query = query.sort({ price: -1 });
    } else if (sort === 'relevance' && search) {
      const results = await query;
      const term = search.trim().toLowerCase();
      results.sort((a, b) => {
        const aTitle = a.title.toLowerCase().includes(term);
        const bTitle = b.title.toLowerCase().includes(term);
        if (aTitle && !bTitle) return -1;
        if (!aTitle && bTitle) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      return res.json({ success: true, count: results.length, listings: results });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const listings = await query;
    res.json({ success: true, count: listings.length, listings });
  } catch (error) {
    next(error);
  }
};

exports.getListingById = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id).populate(
      'seller',
      'name email department year hostelOrLocation contactPreference phoneOrHandle createdAt'
    );

    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    const similarListings = await Listing.find({
      category: listing.category,
      _id: { $ne: listing._id },
      status: 'Available',
    })
      .limit(4)
      .populate('seller', 'name hostelOrLocation');

    res.json({
      success: true,
      listing,
      similarListings,
    });
  } catch (error) {
    next(error);
  }
};

exports.createListing = async (req, res, next) => {
  try {
    const { title, description, price, category, condition, listingType, exchangePreference, location, images } =
      req.body;

    const listing = await Listing.create({
      title,
      description,
      price: listingType === 'For Sale' ? Number(price) : 0,
      category,
      condition,
      listingType,
      exchangePreference: listingType === 'Exchange' ? exchangePreference : '',
      location: location || req.user.hostelOrLocation,
      images: images || [],
      seller: req.user._id,
      status: 'Available',
    });

    res.status(201).json({ success: true, listing });
  } catch (error) {
    next(error);
  }
};

exports.updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    if (listing.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this listing' });
    }

    const { title, description, price, category, condition, listingType, exchangePreference, location, images, status } =
      req.body;

    listing.title = title || listing.title;
    listing.description = description || listing.description;
    listing.price = listingType === 'For Sale' ? Number(price) : 0;
    listing.category = category || listing.category;
    listing.condition = condition || listing.condition;
    listing.listingType = listingType || listing.listingType;
    listing.exchangePreference = listingType === 'Exchange' ? exchangePreference : '';
    listing.location = location || listing.location;
    if (images) listing.images = images;
    if (status) listing.status = status;

    const updated = await listing.save();
    res.json({ success: true, listing: updated });
  } catch (error) {
    next(error);
  }
};

exports.updateListingStatus = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    if (listing.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to modify this listing' });
    }

    const { status } = req.body;
    if (!['Available', 'Reserved', 'Sold', 'Inactive'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid listing status' });
    }

    listing.status = status;
    await listing.save();

    res.json({ success: true, listing });
  } catch (error) {
    next(error);
  }
};

exports.deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing not found' });
    }

    if (listing.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this listing' });
    }

    await listing.deleteOne();
    res.json({ success: true, message: 'Listing successfully deleted' });
  } catch (error) {
    next(error);
  }
};

exports.getMyListings = async (req, res, next) => {
  try {
    const listings = await Listing.find({ seller: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: listings.length, listings });
  } catch (error) {
    next(error);
  }
};
