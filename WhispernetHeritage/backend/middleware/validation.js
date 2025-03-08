const { isValidEmail, isStrongPassword } = require('../utils/helpers');

// Validate registration input
const validateRegistration = (req, res, next) => {
    const { username, email, password } = req.body;

    const errors = [];

    if (!username || username.length < 3) {
        errors.push('Username must be at least 3 characters long');
    }

    if (!email || !isValidEmail(email)) {
        errors.push('Please provide a valid email address');
    }

    if (!password || !isStrongPassword(password)) {
        errors.push('Password must be at least 8 characters long and contain uppercase, lowercase, number and special character');
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};

// Validate login input
const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    const errors = [];

    if (!email || !isValidEmail(email)) {
        errors.push('Please provide a valid email address');
    }

    if (!password) {
        errors.push('Password is required');
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};

// Validate story input
const validateStory = (req, res, next) => {
    const { title, content, category } = req.body;

    const errors = [];

    if (!title || title.length < 3) {
        errors.push('Title must be at least 3 characters long');
    }

    if (!content || content.length < 10) {
        errors.push('Content must be at least 10 characters long');
    }

    if (!category) {
        errors.push('Category is required');
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};

// Validate business input
const validateBusiness = (req, res, next) => {
    const { name, description, category, location, contact } = req.body;

    const errors = [];

    if (!name || name.length < 3) {
        errors.push('Business name must be at least 3 characters long');
    }

    if (!description || description.length < 10) {
        errors.push('Description must be at least 10 characters long');
    }

    if (!category) {
        errors.push('Category is required');
    }

    if (!location) {
        errors.push('Location is required');
    }

    if (!contact || !isValidEmail(contact.email)) {
        errors.push('Valid contact email is required');
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};

// Validate event input
const validateEvent = (req, res, next) => {
    const { title, description, type, startDate, location } = req.body;

    const errors = [];

    if (!title || title.length < 3) {
        errors.push('Event title must be at least 3 characters long');
    }

    if (!description || description.length < 10) {
        errors.push('Description must be at least 10 characters long');
    }

    if (!type) {
        errors.push('Event type is required');
    }

    if (!startDate || new Date(startDate) < new Date()) {
        errors.push('Valid future start date is required');
    }

    if (!location) {
        errors.push('Location is required');
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};

// Validate comment input
const validateComment = (req, res, next) => {
    const { content } = req.body;

    if (!content || content.length < 1) {
        return res.status(400).json({
            errors: ['Comment content is required']
        });
    }

    next();
};

// Validate review input
const validateReview = (req, res, next) => {
    const { rating, comment } = req.body;

    const errors = [];

    if (!rating || rating < 1 || rating > 5) {
        errors.push('Rating must be between 1 and 5');
    }

    if (!comment || comment.length < 5) {
        errors.push('Review comment must be at least 5 characters long');
    }

    if (errors.length > 0) {
        return res.status(400).json({ errors });
    }

    next();
};

// Validate pagination parameters
const validatePagination = (req, res, next) => {
    const { page, limit } = req.query;

    if (page && (!Number.isInteger(Number(page)) || Number(page) < 1)) {
        return res.status(400).json({
            error: 'Page number must be a positive integer'
        });
    }

    if (limit && (!Number.isInteger(Number(limit)) || Number(limit) < 1 || Number(limit) > 50)) {
        return res.status(400).json({
            error: 'Limit must be a positive integer between 1 and 50'
        });
    }

    next();
};

module.exports = {
    validateRegistration,
    validateLogin,
    validateStory,
    validateBusiness,
    validateEvent,
    validateComment,
    validateReview,
    validatePagination
};
