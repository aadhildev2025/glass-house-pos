const Sale = require('../models/Sale');
const Product = require('../models/Product');

// @desc    Create new sale
// @route   POST /api/sales
// @access  Private
const createSale = async (req, res) => {
    const { items, subtotal, tax, discount, total, paymentMethod, cashReceived, balance } = req.body;

    if (items && items.length === 0) {
        res.status(400).json({ message: 'No sale items' });
        return;
    }

    const sale = new Sale({
        items,
        subtotal,
        tax,
        discount,
        total,
        paymentMethod,
        cashReceived,
        balance,
    });

    const createdSale = await sale.save();

    // Update product quantities if stock tracking is enabled
    for (const item of items) {
        const product = await Product.findById(item.productId);
        if (product && product.stockTracking) {
            product.quantity -= item.quantity;
            await product.save();
        }
    }

    res.status(201).json(createdSale);
};

// @desc    Get all sales
// @route   GET /api/sales
// @access  Private
const getSales = async (req, res) => {
    const sales = await Sale.find({}).sort({ createdAt: -1 });
    res.json(sales);
};

module.exports = { createSale, getSales };
