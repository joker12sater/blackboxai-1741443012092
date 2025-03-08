const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Mock database
const events = [];
const registrations = new Map();

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

// Get all events
router.get('/', async (req, res) => {
    try {
        const { type, date, page = 1, limit = 10 } = req.query;
        let filteredEvents = [...events];

        if (type) {
            filteredEvents = filteredEvents.filter(e => e.type === type);
        }

        if (date) {
            const queryDate = new Date(date).toISOString().split('T')[0];
            filteredEvents = filteredEvents.filter(e => {
                const eventDate = new Date(e.startDate).toISOString().split('T')[0];
                return eventDate === queryDate;
            });
        }

        // Implement pagination
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const paginatedEvents = filteredEvents.slice(startIndex, endIndex);

        res.json({
            events: paginatedEvents,
            totalEvents: filteredEvents.length,
            currentPage: parseInt(page),
            totalPages: Math.ceil(filteredEvents.length / limit)
        });
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ error: 'Server error while fetching events' });
    }
});

// Create new event
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { 
            title, 
            description, 
            type,
            startDate,
            endDate,
            location,
            capacity,
            ticketPrice,
            performers 
        } = req.body;

        if (!title || !description || !type || !startDate || !location) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const event = {
            id: events.length + 1,
            title,
            description,
            type,
            startDate,
            endDate: endDate || startDate,
            location,
            capacity: capacity || null,
            ticketPrice: ticketPrice || 0,
            performers: performers || [],
            organizer: {
                email: req.user.email,
                username: req.user.username
            },
            createdAt: new Date().toISOString(),
            attendees: [],
            status: 'upcoming'
        };

        events.push(event);
        res.status(201).json(event);
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).json({ error: 'Server error while creating event' });
    }
});

// Get event by ID
router.get('/:id', async (req, res) => {
    try {
        const event = events.find(e => e.id === parseInt(req.params.id));
        
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        res.json(event);
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ error: 'Server error while fetching event' });
    }
});

// Update event
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const eventIndex = events.findIndex(e => e.id === parseInt(req.params.id));
        
        if (eventIndex === -1) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Check if user is the organizer
        if (events[eventIndex].organizer.email !== req.user.email) {
            return res.status(403).json({ error: 'Not authorized to update this event' });
        }

        const updatedEvent = {
            ...events[eventIndex],
            ...req.body,
            updatedAt: new Date().toISOString()
        };

        events[eventIndex] = updatedEvent;
        res.json(updatedEvent);
    } catch (error) {
        console.error('Error updating event:', error);
        res.status(500).json({ error: 'Server error while updating event' });
    }
});

// Register for event
router.post('/:id/register', authenticateToken, async (req, res) => {
    try {
        const event = events.find(e => e.id === parseInt(req.params.id));
        
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Check capacity
        if (event.capacity && event.attendees.length >= event.capacity) {
            return res.status(400).json({ error: 'Event is at full capacity' });
        }

        // Check if already registered
        if (event.attendees.some(a => a.email === req.user.email)) {
            return res.status(400).json({ error: 'Already registered for this event' });
        }

        const registration = {
            eventId: event.id,
            attendee: {
                email: req.user.email,
                username: req.user.username
            },
            registeredAt: new Date().toISOString(),
            status: 'confirmed'
        };

        event.attendees.push({
            email: req.user.email,
            username: req.user.username
        });

        registrations.set(`${event.id}-${req.user.email}`, registration);
        res.status(201).json(registration);
    } catch (error) {
        console.error('Error registering for event:', error);
        res.status(500).json({ error: 'Server error while registering for event' });
    }
});

// Cancel registration
router.delete('/:id/register', authenticateToken, async (req, res) => {
    try {
        const event = events.find(e => e.id === parseInt(req.params.id));
        
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        const attendeeIndex = event.attendees.findIndex(a => a.email === req.user.email);
        if (attendeeIndex === -1) {
            return res.status(400).json({ error: 'Not registered for this event' });
        }

        event.attendees.splice(attendeeIndex, 1);
        registrations.delete(`${event.id}-${req.user.email}`);

        res.json({ message: 'Registration cancelled successfully' });
    } catch (error) {
        console.error('Error cancelling registration:', error);
        res.status(500).json({ error: 'Server error while cancelling registration' });
    }
});

// Get event attendees (organizer only)
router.get('/:id/attendees', authenticateToken, async (req, res) => {
    try {
        const event = events.find(e => e.id === parseInt(req.params.id));
        
        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Check if user is the organizer
        if (event.organizer.email !== req.user.email) {
            return res.status(403).json({ error: 'Not authorized to view attendees' });
        }

        res.json(event.attendees);
    } catch (error) {
        console.error('Error fetching attendees:', error);
        res.status(500).json({ error: 'Server error while fetching attendees' });
    }
});

module.exports = router;
