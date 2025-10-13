const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars FIRST - this is crucial
dotenv.config();

// Debug: Check if env vars are loaded
console.log('🔍 Environment Check:');
console.log('MONGO_URI:', process.env.MONGO_URI ? '✅ Loaded' : '❌ NOT LOADED');
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);

const app = express();  

// Import connectdb AFTER dotenv.config()
const connectdb = require('./config/connectdb'); // Adjust path as needed

// Connect to database
connectdb();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));

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
    console.log(`🚀 Server running on port ${PORT}`);
});