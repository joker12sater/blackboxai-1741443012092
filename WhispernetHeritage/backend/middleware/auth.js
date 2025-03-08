const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Auth verification error:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
};

const isAdmin = (req, res, next) => {
    try {
        if (!req.user.isAdmin) {
            return res.status(403).json({ error: 'Admin access required' });
        }
        next();
    } catch (error) {
        console.error('Admin verification error:', error);
        res.status(403).json({ error: 'Admin access required' });
    }
};

module.exports = {
    authenticateToken,
    isAdmin
};
