const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: '',
    },
    sellingPrice: {
        type: Number,
        required: true,
    },
    costPrice: {
        type: Number,
        default: 0,
    },
    quantity: {
        type: Number,
        default: 0, // 0 can mean out of stock, null/empty could mean unlimited
    },
    category: {
        type: String,
        required: true,
    },
    stockTracking: {
        type: Boolean,
        default: true,
    },
    purpose: {
        type: String,
        enum: ['sale', 'store'],
        default: 'sale',
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
