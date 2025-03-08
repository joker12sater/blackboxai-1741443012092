const crypto = require('crypto');

// Generate random string
const generateRandomString = (length = 32) => {
    return crypto.randomBytes(length).toString('hex');
};

// Validate email format
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Format date to ISO string
const formatDate = (date) => {
    return new Date(date).toISOString();
};

// Sanitize user input
const sanitizeInput = (input) => {
    if (typeof input !== 'string') return input;
    return input.trim().replace(/[<>]/g, '');
};

// Generate slug from string
const generateSlug = (text) => {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')     // Replace spaces with -
        .replace(/[^\w-]+/g, '')  // Remove all non-word chars
        .replace(/--+/g, '-')     // Replace multiple - with single -
        .replace(/^-+/, '')       // Trim - from start of text
        .replace(/-+$/, '');      // Trim - from end of text
};

// Paginate array
const paginateArray = (array, page = 1, limit = 10) => {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const results = {};

    if (endIndex < array.length) {
        results.next = {
            page: page + 1,
            limit: limit
        };
    }

    if (startIndex > 0) {
        results.previous = {
            page: page - 1,
            limit: limit
        };
    }

    results.results = array.slice(startIndex, endIndex);
    results.total = array.length;
    results.totalPages = Math.ceil(array.length / limit);
    results.currentPage = page;

    return results;
};

// Format file size
const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Generate random color
const generateRandomColor = () => {
    return '#' + Math.floor(Math.random()*16777215).toString(16);
};

// Calculate time difference
const getTimeDifference = (date1, date2 = new Date()) => {
    const diff = Math.abs(new Date(date2) - new Date(date1));
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
};

// Validate password strength
const isStrongPassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
        password.length >= minLength &&
        hasUpperCase &&
        hasLowerCase &&
        hasNumbers &&
        hasSpecialChar
    );
};

// Remove sensitive data from user object
const sanitizeUser = (user) => {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
};

// Generate pagination links
const generatePaginationLinks = (baseUrl, currentPage, totalPages) => {
    const links = {};
    
    if (currentPage > 1) {
        links.prev = `${baseUrl}?page=${currentPage - 1}`;
    }
    
    if (currentPage < totalPages) {
        links.next = `${baseUrl}?page=${currentPage + 1}`;
    }
    
    links.first = `${baseUrl}?page=1`;
    links.last = `${baseUrl}?page=${totalPages}`;
    
    return links;
};

module.exports = {
    generateRandomString,
    isValidEmail,
    formatDate,
    sanitizeInput,
    generateSlug,
    paginateArray,
    formatFileSize,
    generateRandomColor,
    getTimeDifference,
    isStrongPassword,
    sanitizeUser,
    generatePaginationLinks
};
