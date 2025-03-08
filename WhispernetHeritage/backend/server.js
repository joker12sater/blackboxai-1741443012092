const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const storiesRoutes = require('./routes/stories');
const businessRoutes = require('./routes/business');
const eventsRoutes = require('./routes/events');

// Import middleware
const { errorHandler, notFound } = require('./middleware/error');
const { validatePagination } = require('./middleware/validation');

// Import config and chat handler
const config = require('./config/config');
const ChatHandler = require('./socket/chatHandler');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, config.socketIO);

// Initialize chat handler
new ChatHandler(io);

// Middleware
app.use(cors(config.cors));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Global pagination middleware
app.use(validatePagination);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/stories', storiesRoutes);
app.use('/api/businesses', businessRoutes);
app.use('/api/events', eventsRoutes);

// API Health Check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config.server.env
    });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = config.server.port;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${config.server.env}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    // In production, you might want to crash the process
    // server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    // In production, you might want to crash the process
    // server.close(() => process.exit(1));
});
