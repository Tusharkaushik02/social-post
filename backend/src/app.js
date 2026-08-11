const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const authRoutes = require('./routes/auth.route');
const postRoutes = require('./routes/post.route');
const { applyMiddleware } = require('./index');
const errorHandler = require('./middleware/errorHandler');
const user = require('./routes/user.route');
const commentRoutes = require('./routes/comment.route');
const searchRoutes = require('./routes/search.route');
const conversationRoutes = require('./routes/conversation.route');
const messageRoutes = require('./routes/message.route');

const app = express();
app.set('trust proxy', 1); // Trust the reverse proxy (Render) to allow Secure cookies
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
app.use('/api/comments', commentRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);
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
