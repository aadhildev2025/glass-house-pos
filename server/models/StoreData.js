const mongoose = require('mongoose');

const storeDataSchema = new mongoose.Schema({
    storeName: {
        type: String,
        required: true,
    },
    branchName: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    contactNumber: {
        type: String,
        required: true,
    },
    taxNumber: {
        type: String,
    },
    currency: {
        type: String,
        default: 'USD',
    },
    taxPercentage: {
        type: Number,
        default: 0,
    },
    image: {
        type: String,
        default: '',
    }
}, { timestamps: true });

module.exports = mongoose.model('StoreData', storeDataSchema);
