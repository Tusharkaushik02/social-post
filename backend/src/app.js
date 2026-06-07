const express = require('express');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth.route');
const postRoutes = require('./routes/post.route');
const { applyMiddleware } = require('./index');
const errorHandler = require('./middleware/errorHandler');
const user = require('./routes/user.route');

dotenv.config();

const app = express();
 // Apply all middleware
applyMiddleware(app);

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
app.use('/api/users', user);
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
