const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const fs = require('fs').promises;
const path = require('path');

// Load env vars
dotenv.config();

const app = express();

// Import routes
const authRoutes = require('./routes/auth');
const otpRoutes = require('./routes/otp');
const courseRoutes = require('./routes/courses'); // Add this

// Connect to database (for user data only)
const connectdb = require('./config/connectdb');
connectdb();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/courses', courseRoutes); // Add this

// Test route
app.get('/api/health', (req, res) => {
    res.json({
        message: 'Server is running!',
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
        timestamp: new Date().toISOString()
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});