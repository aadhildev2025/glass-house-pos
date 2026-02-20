const StoreData = require('../models/StoreData');

// @desc    Get store data
// @route   GET /api/store
// @access  Private
const getStoreData = async (req, res) => {
    const storeData = await StoreData.findOne({});
    if (storeData) {
        res.json(storeData);
    } else {
        // Return empty object or default
        res.json({});
    }
};

// @desc    Update store data
// @route   PUT /api/store
// @access  Private
const updateStoreData = async (req, res) => {
    const { storeName, branchName, address, contactNumber, taxNumber, currency, taxPercentage } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    let storeData = await StoreData.findOne({});

    if (storeData) {
        storeData.storeName = storeName || storeData.storeName;
        storeData.branchName = branchName || storeData.branchName;
        storeData.address = address || storeData.address;
        storeData.contactNumber = contactNumber || storeData.contactNumber;
        storeData.taxNumber = taxNumber || storeData.taxNumber;
        storeData.currency = currency || storeData.currency;
        storeData.taxPercentage = taxPercentage !== undefined ? taxPercentage : storeData.taxPercentage;
        if (image) storeData.image = image;

        const updatedStoreData = await storeData.save();
        res.json(updatedStoreData);
    } else {
        storeData = new StoreData({
            storeName,
            branchName,
            address,
            contactNumber,
            taxNumber,
            currency,
            taxPercentage,
            image: image || '',
        });
        const createdStoreData = await storeData.save();
        res.status(201).json(createdStoreData);
    }
};

module.exports = { getStoreData, updateStoreData };
