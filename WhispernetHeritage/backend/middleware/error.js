// Error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: 'Validation Error',
            details: err.message
        });
    }

    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            error: 'Invalid Token',
            details: 'Authentication failed'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            error: 'Token Expired',
            details: 'Please login again'
        });
    }

    // Default error
    res.status(500).json({
        error: 'Internal Server Error',
        details: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
};

// Not found middleware
const notFound = (req, res, next) => {
    res.status(404).json({
        error: 'Not Found',
        details: `Cannot ${req.method} ${req.originalUrl}`
    });
};

module.exports = {
    errorHandler,
    notFound
};
