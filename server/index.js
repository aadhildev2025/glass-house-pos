const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');
const User = require('./models/User');

// Load environment variables
dotenv.config();

// Connect to Database and Setup Default User
const initializeApp = async () => {
    try {
        await connectDB();

        // Create default admin user if not exists
        const userCount = await User.countDocuments();
        console.log(`Checking for admin user... Current count: ${userCount}`);

        if (userCount === 0) {
            const defaultPin = process.env.DEFAULT_PIN || '1234';
            await User.create({
                pin: defaultPin,
                role: 'admin'
            });
            console.log(`Default admin user created successfully with PIN: ${defaultPin}`);
        } else {
            const admin = await User.findOne({ role: 'admin' });
            if (admin) {
                console.log('Admin user found in database.');
            } else {
                console.log('No user with "admin" role found. Creating one...');
                const defaultPin = process.env.DEFAULT_PIN || '1234';
                await User.create({
                    pin: defaultPin,
                    role: 'admin'
                });
                console.log(`Default admin user created successfully with PIN: ${defaultPin}`);
            }
        }
    } catch (err) {
        console.error('Initialization error:', err.message);
    }
};

initializeApp();

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
