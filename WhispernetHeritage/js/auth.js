import api from './api.js';

class AuthManager {
    constructor() {
        this.token = localStorage.getItem('token');
        this.user = null;
        this.listeners = [];
    }

    // Initialize auth state
    async init() {
        if (this.token) {
            try {
                const user = await api.auth.getCurrentUser();
                if (user.error) {
                    this.logout();
                    return false;
                }
                this.user = user;
                this.notifyListeners();
                return true;
            } catch (error) {
                console.error('Auth initialization error:', error);
                this.logout();
                return false;
            }
        }
        return false;
    }

    // Register new user
    async register(userData) {
        try {
            const response = await api.auth.register(userData);
            if (response.token) {
                this.token = response.token;
                localStorage.setItem('token', this.token);
                await this.init();
                return { success: true };
            }
            return { success: false, error: response.error };
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, error: 'Registration failed' };
        }
    }

    // Login user
    async login(credentials) {
        try {
            const response = await api.auth.login(credentials);
            if (response.token) {
                this.token = response.token;
                localStorage.setItem('token', this.token);
                await this.init();
                return { success: true };
            }
            return { success: false, error: response.error };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: 'Login failed' };
        }
    }

    // Logout user
    logout() {
        this.token = null;
        this.user = null;
        localStorage.removeItem('token');
        this.notifyListeners();
    }

    // Check if user is authenticated
    isAuthenticated() {
        return !!this.token && !!this.user;
    }

    // Get current user
    getCurrentUser() {
        return this.user;
    }

    // Add auth state change listener
    addListener(listener) {
        this.listeners.push(listener);
    }

    // Remove auth state change listener
    removeListener(listener) {
        this.listeners = this.listeners.filter(l => l !== listener);
    }

    // Notify all listeners of auth state change
    notifyListeners() {
        this.listeners.forEach(listener => {
            listener({
                isAuthenticated: this.isAuthenticated(),
                user: this.user
            });
        });
    }

    // Update user profile
    async updateProfile(userData) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/auth/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(userData)
            });
            const data = await response.json();
            
            if (data.error) {
                return { success: false, error: data.error };
            }

            this.user = { ...this.user, ...userData };
            this.notifyListeners();
            return { success: true };
        } catch (error) {
            console.error('Profile update error:', error);
            return { success: false, error: 'Profile update failed' };
        }
    }

    // Change password
    async changePassword(passwordData) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/auth/password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(passwordData)
            });
            const data = await response.json();
            
            if (data.error) {
                return { success: false, error: data.error };
            }
            return { success: true };
        } catch (error) {
            console.error('Password change error:', error);
            return { success: false, error: 'Password change failed' };
        }
    }

    // Request password reset
    async requestPasswordReset(email) {
        try {
            const response = await fetch('http://localhost:5000/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            });
            const data = await response.json();
            
            if (data.error) {
                return { success: false, error: data.error };
            }
            return { success: true };
        } catch (error) {
            console.error('Password reset request error:', error);
            return { success: false, error: 'Password reset request failed' };
        }
    }
}

// Create and export singleton instance
const authManager = new AuthManager();
export default authManager;
