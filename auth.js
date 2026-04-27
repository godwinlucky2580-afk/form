/**
 * HYPREP Livelihood Portal - Authentication Module
 * Handles user registration, login, logout, and session management
 */

const Auth = {
    /**
     * Storage keys for localStorage
     */
    KEYS: {
        USERS: 'hyprep_users',
        SESSION: 'hyprep_session',
        REGISTERED_USER: 'hyprep_registered_user',
        CURRENT_USER: 'hyprep_current_user',
        RESET_OTP: 'hyprep_reset_otp',
        RESET_EMAIL: 'hyprep_reset_email'
    },

    /**
     * Register a new user
     * @param {Object} userData - User data object
     * @param {string} userData.firstName - First name
     * @param {string} userData.lastName - Last name
     * @param {string} userData.email - Email address
     * @param {string} userData.phone - Phone number
     * @param {string} userData.password - Password
     * @returns {Object} - { success: boolean, message: string, user: Object|null }
     */
    register: function(userData) {
        const users = this.getAllUsers();

        // Check if email already exists
        if (users.find(u => u.email === userData.email)) {
            return {
                success: false,
                message: 'An account with this email already exists. Please login or use a different email.',
                user: null
            };
        }

        // Check if phone already exists
        if (users.find(u => u.phone === userData.phone)) {
            return {
                success: false,
                message: 'An account with this phone number already exists.',
                user: null
            };
        }

        // Create user object with hashed password (demo)
        const newUser = {
            id: this._generateId(),
            firstName: userData.firstName.trim(),
            lastName: userData.lastName.trim(),
            email: userData.email.trim().toLowerCase(),
            phone: userData.phone.trim(),
            password: this._hashPassword(userData.password),
            createdAt: new Date().toISOString(),
            isActive: true
        };

        // Save to users array
        users.push(newUser);
        localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));

        // Save as registered user for confirmation page
        localStorage.setItem(this.KEYS.REGISTERED_USER, JSON.stringify({
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            phone: newUser.phone
        }));

        // Auto-login after registration
        this._createSession(newUser);

        return {
            success: true,
            message: 'Account created successfully!',
            user: newUser
        };
    },

    /**
     * Login a user
     * @param {string} email - Email address
     * @param {string} password - Password
     * @returns {Object} - { success: boolean, message: string, user: Object|null }
     */
    login: function(email, password) {
        const users = this.getAllUsers();
        const normalizedEmail = email.trim().toLowerCase();

        // Find user by email
        const user = users.find(u => u.email === normalizedEmail);

        if (!user) {
            return {
                success: false,
                message: 'No account found with this email. Please check your email or create an account.',
                user: null
            };
        }

        // Verify password
        if (user.password !== this._hashPassword(password)) {
            return {
                success: false,
                message: 'Incorrect password. Please try again or reset your password.',
                user: null
            };
        }

        // Check if account is active
        if (!user.isActive) {
            return {
                success: false,
                message: 'This account has been deactivated. Please contact support.',
                user: null
            };
        }

        // Create session
        this._createSession(user);

        return {
            success: true,
            message: 'Login successful!',
            user: user
        };
    },

    /**
     * Logout current user
     */
    logout: function() {
        localStorage.removeItem(this.KEYS.SESSION);
        localStorage.removeItem(this.KEYS.CURRENT_USER);
        localStorage.removeItem(this.KEYS.REGISTERED_USER);
    },

    /**
     * Get current authenticated user
     * @returns {Object|null}
     */
    getCurrentUser: function() {
        const session = localStorage.getItem(this.KEYS.SESSION);
        if (!session) return null;

        try {
            const sessionData = JSON.parse(session);

            // Check if session is expired (24 hours)
            const loginTime = new Date(sessionData.loginTime);
            const now = new Date();
            const hoursDiff = (now - loginTime) / (1000 * 60 * 60);

            if (hoursDiff > 24) {
                this.logout();
                return null;
            }

            // Get full user data
            const users = this.getAllUsers();
            const user = users.find(u => u.email === sessionData.email);

            if (user) {
                // Return user without password
                return {
                    id: user.id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    phone: user.phone,
                    createdAt: user.createdAt
                };
            }

            return sessionData;
        } catch (e) {
            console.error('Error parsing session:', e);
            return null;
        }
    },

    /**
     * Check if user is authenticated
     * @returns {boolean}
     */
    isAuthenticated: function() {
        return this.getCurrentUser() !== null;
    },

    /**
     * Get all registered users
     * @returns {Array}
     */
    getAllUsers: function() {
        const users = localStorage.getItem(this.KEYS.USERS);
        return users ? JSON.parse(users) : [];
    },

    /**
     * Update user password
     * @param {string} email - User email
     * @param {string} newPassword - New password
     * @returns {boolean}
     */
    updatePassword: function(email, newPassword) {
        const users = this.getAllUsers();
        const userIndex = users.findIndex(u => u.email === email.toLowerCase());

        if (userIndex === -1) return false;

        users[userIndex].password = this._hashPassword(newPassword);
        localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));

        return true;
    },

    /**
     * Check if an email is already registered
     * @param {string} email
     * @returns {boolean}
     */
    isEmailRegistered: function(email) {
        const users = this.getAllUsers();
        return users.some(u => u.email === email.trim().toLowerCase());
    },

    /**
     * Seed demo users (for testing)
     */
    seedDemoUsers: function() {
        const users = this.getAllUsers();

        // Only seed if no users exist
        if (users.length === 0) {
            const demoUsers = [
                {
                    id: this._generateId(),
                    firstName: 'Demo',
                    lastName: 'User',
                    email: 'user@example.com',
                    phone: '08012345678',
                    password: this._hashPassword('password123'),
                    createdAt: new Date().toISOString(),
                    isActive: true
                },
                {
                    id: this._generateId(),
                    firstName: 'Admin',
                    lastName: 'HYPREP',
                    email: 'admin@hyprep.gov.ng',
                    phone: '08098765432',
                    password: this._hashPassword('admin123'),
                    createdAt: new Date().toISOString(),
                    isActive: true
                }
            ];

            localStorage.setItem(this.KEYS.USERS, JSON.stringify(demoUsers));
            console.log('Demo users seeded for testing');
        }
    },

    /**
     * Create a session for authenticated user
     * @private
     */
    _createSession: function(user) {
        const session = {
            email: user.email,
            name: user.firstName + ' ' + user.lastName,
            firstName: user.firstName,
            lastName: user.lastName,
            loginTime: new Date().toISOString()
        };

        localStorage.setItem(this.KEYS.SESSION, JSON.stringify(session));
        localStorage.setItem(this.KEYS.CURRENT_USER, JSON.stringify({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone
        }));

        // Also maintain backward compatibility with form-utils.js session
        FormUtils.setSession(user.email, user.firstName + ' ' + user.lastName);
    },

    /**
     * Simple password hash (demo only - use bcrypt in production)
     * @private
     */
    _hashPassword: function(password) {
        // In production, use a proper hashing library like bcrypt
        // This is a simple demo hash for client-side simulation
        let hash = 0;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return 'hash_' + Math.abs(hash).toString(16);
    },

    /**
     * Generate unique ID
     * @private
     */
    _generateId: function() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
};

// Auto-seed demo users on first load
if (typeof FormUtils !== 'undefined') {
    Auth.seedDemoUsers();
}

