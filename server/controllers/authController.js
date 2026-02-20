const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { pin } = req.body;

    const user = await User.findOne({ role: 'admin' });

    if (user && (await user.matchPin(pin))) {
        res.json({
            _id: user._id,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: 'Invalid PIN' });
    }
};

// @desc    Update User PIN
// @route   PUT /api/auth/update-pin
// @access  Private
const updatePin = async (req, res) => {
    const { newPin } = req.body;
    const user = await User.findById(req.user._id);

    if (user) {
        user.pin = newPin;
        await user.save();
        res.json({ message: 'PIN updated successfully' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = { loginUser, updatePin };
