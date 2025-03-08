// API Base URL
const API_BASE_URL = 'http://localhost:5000/api';

// API Utilities
const api = {
    // Authentication
    auth: {
        register: async (userData) => {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            return response.json();
        },

        login: async (credentials) => {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(credentials)
            });
            return response.json();
        },

        getCurrentUser: async () => {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/auth/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.json();
        }
    },

    // Stories
    stories: {
        getAll: async (page = 1, limit = 10) => {
            const response = await fetch(`${API_BASE_URL}/stories?page=${page}&limit=${limit}`);
            return response.json();
        },

        getById: async (id) => {
            const response = await fetch(`${API_BASE_URL}/stories/${id}`);
            return response.json();
        },

        create: async (storyData) => {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/stories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(storyData)
            });
            return response.json();
        },

        update: async (id, storyData) => {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/stories/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(storyData)
            });
            return response.json();
        },

        delete: async (id) => {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/stories/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.json();
        },

        like: async (id) => {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/stories/${id}/like`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.json();
        },

        comment: async (id, comment) => {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/stories/${id}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content: comment })
            });
            return response.json();
        }
    },

    // Businesses
    businesses: {
        getAll: async (page = 1, limit = 10) => {
            const response = await fetch(`${API_BASE_URL}/businesses?page=${page}&limit=${limit}`);
            return response.json();
        },

        getById: async (id) => {
            const response = await fetch(`${API_BASE_URL}/businesses/${id}`);
            return response.json();
        },

        register: async (businessData) => {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/businesses`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(businessData)
            });
            return response.json();
        },

        update: async (id, businessData) => {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/businesses/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(businessData)
            });
            return response.json();
        },

        subscribe: async (id, subscriptionData) => {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/businesses/${id}/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(subscriptionData)
            });
            return response.json();
        },

        review: async (id, reviewData) => {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/businesses/${id}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(reviewData)
            });
            return response.json();
        }
    },

    // Events
    events: {
        getAll: async (page = 1, limit = 10) => {
            const response = await fetch(`${API_BASE_URL}/events?page=${page}&limit=${limit}`);
            return response.json();
        },

        getById: async (id) => {
            const response = await fetch(`${API_BASE_URL}/events/${id}`);
            return response.json();
        },

        create: async (eventData) => {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(eventData)
            });
            return response.json();
        },

        update: async (id, eventData) => {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/events/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(eventData)
            });
            return response.json();
        },

        register: async (id) => {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/events/${id}/register`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.json();
        },

        cancelRegistration: async (id) => {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/events/${id}/register`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.json();
        },

        getAttendees: async (id) => {
            const token = localStorage.getItem('token');
            const response = await fetch(`${API_BASE_URL}/events/${id}/attendees`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            return response.json();
        }
    }
};

export default api;
