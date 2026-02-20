const express = require('express');
const router = express.Router();
const {
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
    .get(protect, getProducts)
    .post(protect, upload.single('image'), createProduct);

router.route('/:id')
    .put(protect, upload.single('image'), updateProduct)
    .delete(protect, deleteProduct);

module.exports = router;
