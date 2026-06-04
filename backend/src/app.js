const express = require('express');
const dotenv = require('dotenv');
const corsMiddleware = require('./middleware/cors');
const errorHandler = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requestLogger');
const authRoutes = require('./routes/auth.route');
const postRoutes = require('./routes/post.route');

dotenv.config();

const app = express();

// Middleware
app.use(requestLogger);
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

// Welcome endpoint
app.get('/', (req, res) => {
    res.status(200).json({ 
        success: true,
        message: "Welcome to Social Post API",
        version: "1.0.0"
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found'
    });
});

// Error handling middleware (must be last)
app.use(errorHandler);

console.log("App initialized successfully");

module.exports = app;