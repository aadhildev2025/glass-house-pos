const mongoose = require('mongoose');

const saleSchema = new mongoose.Schema({
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        name: String,
        quantity: Number,
        price: Number,
        subtotal: Number,
    }],
    subtotal: {
        type: Number,
        required: true,
    },
    tax: {
        type: Number,
        default: 0,
    },
    discount: {
        type: Number,
        default: 0,
    },
    total: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String,
        default: 'Cash',
    },
    cashReceived: {
        type: Number,
        default: 0,
    },
    balance: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

module.exports = mongoose.model('Sale', saleSchema);
