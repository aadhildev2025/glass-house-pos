const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    pin: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'admin',
    }
}, { timestamps: true });

// Hash PIN before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('pin')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.pin = await bcrypt.hash(this.pin, salt);
});

// Match PIN
userSchema.methods.matchPin = async function (enteredPin) {
    return await bcrypt.compare(enteredPin, this.pin);
};

module.exports = mongoose.model('User', userSchema);
