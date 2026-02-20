const express = require('express');
const router = express.Router();
const { getStoreData, updateStoreData } = require('../controllers/storeController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
    .get(protect, getStoreData)
    .put(protect, upload.single('image'), updateStoreData);

module.exports = router;
