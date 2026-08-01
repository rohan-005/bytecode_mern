const express = require('express');
const cors = require('cors');
const emailRoutes = require('./src/routes/email.routes');
const { errorHandler } = require('./src/middlewares/error.middleware');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/', emailRoutes);
app.use('/api/email', emailRoutes);

// Error Middleware
app.use(errorHandler);

module.exports = app;
