const Listing = require('../models/ListingsModel');
const User = require('../models/UserModel');

exports.getAllListings = async (req, res) => {
    const listings = await Listing.find();
    res.json(listings);
};

exports.getListing = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    res.json(listing);
};

exports.createListing = async (req, res) => {
    try {
        const user = await User.findById(req.userId).populate('organization');
        const owner = user.organization ? user.organization._id : user._id;
        const imageUrls = req.files.map(file => file.location);
        const listingData = {
            ...req.body,
            owner: owner,
            imageUrl: imageUrls
        };
        // Remove empty enum fields
        if (!listingData.listingType) delete listingData.listingType;
        if (!listingData.priceFrequency) delete listingData.priceFrequency;
        if (!listingData.propertyAreaUnit) delete listingData.propertyAreaUnit;

        const listing = new Listing(listingData);
        await listing.save();
        res.json(listing);
    } catch (err) {
        console.log('Error in createListing: ', err);
        return res.status(500).json({ error: 'An error occurred while creating the listing.' });
    }
};

exports.updateListing = async (req, res) => {
    const listingData = { ...req.body };

    // Remove empty enum fields
    if (!listingData.listingType) delete listingData.listingType;
    if (!listingData.priceFrequency) delete listingData.priceFrequency;
    if (!listingData.propertyAreaUnit) delete listingData.propertyAreaUnit;

    const listing = await Listing.findByIdAndUpdate(req.params.id, listingData, { new: true });
    res.json(listing);
};

exports.deleteListing = async (req, res) => {
    await Listing.findByIdAndDelete(req.params.id);
    res.json({ message: 'Listing deleted' });
};