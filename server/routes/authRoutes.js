const express = require('express');
const router = express.Router();
const { loginUser, updatePin } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', loginUser);
router.put('/update-pin', protect, updatePin);

module.exports = router;
