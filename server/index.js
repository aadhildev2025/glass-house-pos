const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');
const User = require('./models/User');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
}));
app.use(express.json());

// Set up static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/store', require('./routes/storeRoutes'));
app.use('/api/sales', require('./routes/saleRoutes'));

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is reachable' });
});

app.get('/', (req, res) => {
    res.send('POS API is running...');
});

// Create default admin user if not exists
const setupDefaultUser = async () => {
    try {
        const userCount = await User.countDocuments();
        if (userCount === 0) {
            const defaultPin = process.env.DEFAULT_PIN || '1234';
            await User.create({
                pin: defaultPin,
                role: 'admin'
            });
            console.log(`Default admin user created with PIN: ${defaultPin}`);
        }
    } catch (err) {
        console.error('Error creating default user:', err.message);
    }
};

setupDefaultUser();

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
