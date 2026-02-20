const Product = require('../models/Product');

// @desc    Get all products
// @route   GET /api/products
// @access  Private
const getProducts = async (req, res) => {
    const products = await Product.find({});
    res.json(products);
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private
const createProduct = async (req, res) => {
    const { name, sellingPrice, costPrice, quantity, category, stockTracking, purpose } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : '';

    const product = new Product({
        name,
        sellingPrice: sellingPrice || 0,
        costPrice: costPrice || 0,
        quantity: quantity || 0,
        category,
        stockTracking: stockTracking === undefined ? true : stockTracking,
        image,
        purpose: purpose || 'sale'
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = async (req, res) => {
    const { name, sellingPrice, costPrice, quantity, category, stockTracking, purpose } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name || product.name;
        product.sellingPrice = sellingPrice !== undefined ? sellingPrice : product.sellingPrice;
        product.costPrice = costPrice !== undefined ? costPrice : product.costPrice;
        product.quantity = quantity !== undefined ? quantity : product.quantity;
        product.category = category || product.category;
        product.stockTracking = stockTracking !== undefined ? stockTracking : product.stockTracking;
        product.purpose = purpose || product.purpose;
        if (image) product.image = image;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private
const deleteProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } else {
        res.status(404).json({ message: 'Product not found' });
    }
};

module.exports = {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
};
