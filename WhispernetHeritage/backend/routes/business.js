const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Mock database
const businesses = [];
const subscriptions = new Map();

// Middleware to verify JWT token
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

// Get all businesses
router.get('/', async (req, res) => {
    try {
        const { category, approved, page = 1, limit = 10 } = req.query;
        let filteredBusinesses = [...businesses];

        if (category) {
            filteredBusinesses = filteredBusinesses.filter(b => b.category === category);
        }

        if (approved !== undefined) {
            filteredBusinesses = filteredBusinesses.filter(b => b.approved === (approved === 'true'));
        }

        // Implement pagination
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedBusinesses = filteredBusinesses.slice(startIndex, endIndex);

        res.json({
            businesses: paginatedBusinesses,
            totalBusinesses: filteredBusinesses.length,
            currentPage: parseInt(page),
            totalPages: Math.ceil(filteredBusinesses.length / limit)
        });
    } catch (error) {
        console.error('Error fetching businesses:', error);
        res.status(500).json({ error: 'Server error while fetching businesses' });
    }
});

// Register new business
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { name, description, category, location, contact } = req.body;

        if (!name || !description || !category || !location || !contact) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const business = {
            id: businesses.length + 1,
            name,
            description,
            category,
            location,
            contact,
            owner: {
                email: req.user.email,
                username: req.user.username
            },
            createdAt: new Date().toISOString(),
            approved: false,
            subscription: 'free',
            rating: 0,
            reviews: []
        };

        businesses.push(business);
        res.status(201).json(business);
    } catch (error) {
        console.error('Error registering business:', error);
        res.status(500).json({ error: 'Server error while registering business' });
    }
});

// Get business by ID
router.get('/:id', async (req, res) => {
    try {
        const business = businesses.find(b => b.id === parseInt(req.params.id));
        
        if (!business) {
            return res.status(404).json({ error: 'Business not found' });
        }

        res.json(business);
    } catch (error) {
        console.error('Error fetching business:', error);
        res.status(500).json({ error: 'Server error while fetching business' });
    }
});

// Update business
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const businessIndex = businesses.findIndex(b => b.id === parseInt(req.params.id));
        
        if (businessIndex === -1) {
            return res.status(404).json({ error: 'Business not found' });
        }

        // Check if user is the owner
        if (businesses[businessIndex].owner.email !== req.user.email) {
            return res.status(403).json({ error: 'Not authorized to update this business' });
        }

        const { name, description, category, location, contact } = req.body;
        const updatedBusiness = {
            ...businesses[businessIndex],
            name: name || businesses[businessIndex].name,
            description: description || businesses[businessIndex].description,
            category: category || businesses[businessIndex].category,
            location: location || businesses[businessIndex].location,
            contact: contact || businesses[businessIndex].contact,
            updatedAt: new Date().toISOString()
        };

        businesses[businessIndex] = updatedBusiness;
        res.json(updatedBusiness);
    } catch (error) {
        console.error('Error updating business:', error);
        res.status(500).json({ error: 'Server error while updating business' });
    }
});

// Subscribe to premium
router.post('/:id/subscribe', authenticateToken, async (req, res) => {
    try {
        const { plan, paymentDetails } = req.body;
        const business = businesses.find(b => b.id === parseInt(req.params.id));
        
        if (!business) {
            return res.status(404).json({ error: 'Business not found' });
        }

        // Check if user is the owner
        if (business.owner.email !== req.user.email) {
            return res.status(403).json({ error: 'Not authorized to subscribe this business' });
        }

        // Process subscription (mock)
        const subscription = {
            businessId: business.id,
            plan,
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
            status: 'active'
        };

        subscriptions.set(business.id, subscription);
        business.subscription = plan;

        res.json({ message: 'Subscription successful', subscription });
    } catch (error) {
        console.error('Error processing subscription:', error);
        res.status(500).json({ error: 'Server error while processing subscription' });
    }
});

// Add review
router.post('/:id/reviews', authenticateToken, async (req, res) => {
    try {
        const { rating, comment } = req.body;
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ error: 'Invalid rating' });
        }

        const business = businesses.find(b => b.id === parseInt(req.params.id));
        
        if (!business) {
            return res.status(404).json({ error: 'Business not found' });
        }

        const review = {
            id: business.reviews.length + 1,
            rating,
            comment,
            author: {
                email: req.user.email,
                username: req.user.username
            },
            createdAt: new Date().toISOString()
        };

        business.reviews.push(review);
        
        // Update overall rating
        const totalRating = business.reviews.reduce((sum, r) => sum + r.rating, 0);
        business.rating = totalRating / business.reviews.length;

        res.status(201).json(review);
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ error: 'Server error while adding review' });
    }
});

module.exports = router;
