const Enquiry = require('../models/Enquiry');
const Listing = require('../models/Listing');

exports.createEnquiry = async (req, res, next) => {
  try {
    const { listingId, message, offerPrice } = req.body;

    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ success: false, message: 'Listing does not exist' });
    }

    if (listing.seller.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot send an enquiry on your own listing!' });
    }

    const enquiry = await Enquiry.create({
      listing: listingId,
      buyer: req.user._id,
      seller: listing.seller,
      message,
      offerPrice: offerPrice ? Number(offerPrice) : null,
      status: 'Pending',
      isReadByBuyer: true,
    });

    res.status(201).json({ success: true, enquiry });
  } catch (error) {
    next(error);
  }
};

exports.getReceivedEnquiries = async (req, res, next) => {
  try {
    const enquiries = await Enquiry.find({ seller: req.user._id })
      .populate('listing', 'title price images status')
      .populate('buyer', 'name email department year hostelOrLocation phoneOrHandle contactPreference')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: enquiries.length, enquiries });
  } catch (error) {
    next(error);
  }
};

exports.getSentEnquiries = async (req, res, next) => {
  try {
    const enquiries = await Enquiry.find({ buyer: req.user._id })
      .populate('listing', 'title price images status')
      .populate('seller', 'name hostelOrLocation contactPreference phoneOrHandle')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: enquiries.length, enquiries });
  } catch (error) {
    next(error);
  }
};

exports.respondToEnquiry = async (req, res, next) => {
  try {
    const { status, sellerReplyNote } = req.body;

    if (!['Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Response status must be Accepted or Rejected' });
    }

    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    if (enquiry.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Only the item seller can respond to this offer' });
    }

    enquiry.status = status;
    enquiry.sellerReplyNote = sellerReplyNote || '';
    enquiry.isReadByBuyer = false;
    await enquiry.save();

    if (status === 'Accepted') {
      await Listing.findByIdAndUpdate(enquiry.listing, { status: 'Reserved' });
    }

    res.json({
      success: true,
      message: `Offer marked as ${status}${status === 'Accepted' ? ' and listing marked Reserved' : ''}`,
      enquiry,
    });
  } catch (error) {
    next(error);
  }
};

exports.markEnquiriesRead = async (req, res, next) => {
  try {
    await Enquiry.updateMany({ buyer: req.user._id, isReadByBuyer: false }, { isReadByBuyer: true });
    res.json({ success: true, message: 'Notifications marked as read' });
  } catch (error) {
    next(error);
  }
};
