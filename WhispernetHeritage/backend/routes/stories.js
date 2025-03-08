const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Mock database
const stories = [];

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

// Get all stories
router.get('/', async (req, res) => {
    try {
        const { category, page = 1, limit = 10 } = req.query;
        let filteredStories = [...stories];

        if (category) {
            filteredStories = filteredStories.filter(story => story.category === category);
        }

        // Implement pagination
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedStories = filteredStories.slice(startIndex, endIndex);

        res.json({
            stories: paginatedStories,
            totalStories: filteredStories.length,
            currentPage: parseInt(page),
            totalPages: Math.ceil(filteredStories.length / limit)
        });
    } catch (error) {
        console.error('Error fetching stories:', error);
        res.status(500).json({ error: 'Server error while fetching stories' });
    }
});

// Create new story
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { title, content, category, media } = req.body;

        if (!title || !content || !category) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const story = {
            id: stories.length + 1,
            title,
            content,
            category,
            media: media || [],
            author: {
                email: req.user.email,
                username: req.user.username
            },
            createdAt: new Date().toISOString(),
            likes: 0,
            comments: [],
            views: 0
        };

        stories.push(story);
        res.status(201).json(story);
    } catch (error) {
        console.error('Error creating story:', error);
        res.status(500).json({ error: 'Server error while creating story' });
    }
});

// Get story by ID
router.get('/:id', async (req, res) => {
    try {
        const story = stories.find(s => s.id === parseInt(req.params.id));
        
        if (!story) {
            return res.status(404).json({ error: 'Story not found' });
        }

        // Increment views
        story.views += 1;
        res.json(story);
    } catch (error) {
        console.error('Error fetching story:', error);
        res.status(500).json({ error: 'Server error while fetching story' });
    }
});

// Update story
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const storyIndex = stories.findIndex(s => s.id === parseInt(req.params.id));
        
        if (storyIndex === -1) {
            return res.status(404).json({ error: 'Story not found' });
        }

        // Check if user is the author
        if (stories[storyIndex].author.email !== req.user.email) {
            return res.status(403).json({ error: 'Not authorized to update this story' });
        }

        const { title, content, category, media } = req.body;
        const updatedStory = {
            ...stories[storyIndex],
            title: title || stories[storyIndex].title,
            content: content || stories[storyIndex].content,
            category: category || stories[storyIndex].category,
            media: media || stories[storyIndex].media,
            updatedAt: new Date().toISOString()
        };

        stories[storyIndex] = updatedStory;
        res.json(updatedStory);
    } catch (error) {
        console.error('Error updating story:', error);
        res.status(500).json({ error: 'Server error while updating story' });
    }
});

// Delete story
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const storyIndex = stories.findIndex(s => s.id === parseInt(req.params.id));
        
        if (storyIndex === -1) {
            return res.status(404).json({ error: 'Story not found' });
        }

        // Check if user is the author
        if (stories[storyIndex].author.email !== req.user.email) {
            return res.status(403).json({ error: 'Not authorized to delete this story' });
        }

        stories.splice(storyIndex, 1);
        res.json({ message: 'Story deleted successfully' });
    } catch (error) {
        console.error('Error deleting story:', error);
        res.status(500).json({ error: 'Server error while deleting story' });
    }
});

// Like story
router.post('/:id/like', authenticateToken, async (req, res) => {
    try {
        const story = stories.find(s => s.id === parseInt(req.params.id));
        
        if (!story) {
            return res.status(404).json({ error: 'Story not found' });
        }

        story.likes += 1;
        res.json({ likes: story.likes });
    } catch (error) {
        console.error('Error liking story:', error);
        res.status(500).json({ error: 'Server error while liking story' });
    }
});

// Add comment to story
router.post('/:id/comments', authenticateToken, async (req, res) => {
    try {
        const { content } = req.body;
        if (!content) {
            return res.status(400).json({ error: 'Comment content is required' });
        }

        const story = stories.find(s => s.id === parseInt(req.params.id));
        
        if (!story) {
            return res.status(404).json({ error: 'Story not found' });
        }

        const comment = {
            id: story.comments.length + 1,
            content,
            author: {
                email: req.user.email,
                username: req.user.username
            },
            createdAt: new Date().toISOString()
        };

        story.comments.push(comment);
        res.status(201).json(comment);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({ error: 'Server error while adding comment' });
    }
});

module.exports = router;
