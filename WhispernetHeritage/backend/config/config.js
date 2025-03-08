const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

module.exports = {
    // Server configuration
    server: {
        port: process.env.PORT || 5000,
        env: process.env.NODE_ENV || 'development'
    },

    // JWT configuration
    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: '24h'
    },

    // CORS configuration
    cors: {
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization']
    },

    // Socket.IO configuration
    socketIO: {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    },

    // Rate limiting
    rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100 // limit each IP to 100 requests per windowMs
    },

    // File upload configuration
    upload: {
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif']
    },

    // Pagination defaults
    pagination: {
        defaultLimit: 10,
        maxLimit: 50
    },

    // Cache configuration
    cache: {
        ttl: 60 * 60 * 1000 // 1 hour
    },

    // Logging configuration
    logging: {
        level: process.env.LOG_LEVEL || 'info',
        format: process.env.LOG_FORMAT || 'combined'
    }
};
