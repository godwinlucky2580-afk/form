/**
 * HYPREP Livelihood Portal - Shared Form Utilities
 * Common functions used across all form pages
 */

// Mobile detection and helpers
const FormUtils = {
    /**
     * Check if device is mobile (touch-enabled or small screen)
     */
    isMobile: function() {
        return window.innerWidth <= 768 || 
               'ontouchstart' in window || 
               navigator.maxTouchPoints > 0;
    },

    /**
     * Validate email format
     */
    isValidEmail: function(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    /**
     * Validate Nigerian phone number
     */
    isValidPhone: function(phone) {
        const phoneRegex = /^(0|(\+234))[7-9][0-1][0-9]{8}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    },

    /**
     * Check password strength (min 6 chars)
     */
    isValidPassword: function(password) {
        return password && password.length >= 6;
    },

    /**
     * Show error message on input field
     */
    showError: function(inputElement, message) {
        const parent = inputElement.closest('div') || inputElement.parentElement;
        let errorDiv = parent.querySelector('.error-message');
        
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.style.cssText = 'color: #e74c3c; font-size: 0.85rem; margin-top: 4px; display: none;';
            parent.appendChild(errorDiv);
        }
        
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        inputElement.style.borderColor = '#e74c3c';
        inputElement.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.15)';
    },

    /**
     * Clear error message from input field
     */
    clearError: function(inputElement) {
        const parent = inputElement.closest('div') || inputElement.parentElement;
        const errorDiv = parent.querySelector('.error-message');
        
        if (errorDiv) {
            errorDiv.style.display = 'none';
        }
        
        inputElement.style.borderColor = '#ccc';
        inputElement.style.boxShadow = 'none';
    },

    /**
     * Add loading state to button
     */
    setLoading: function(button, text = 'Loading...') {
        button.dataset.originalText = button.textContent;
        button.textContent = text;
        button.disabled = true;
        button.style.opacity = '0.7';
        button.style.cursor = 'not-allowed';
    },

    /**
     * Remove loading state from button
     */
    clearLoading: function(button) {
        if (button.dataset.originalText) {
            button.textContent = button.dataset.originalText;
        }
        button.disabled = false;
        button.style.opacity = '1';
        button.style.cursor = 'pointer';
    },

    /**
     * Simulate async API call
     */
    simulateApiCall: function(duration = 1500) {
        return new Promise(resolve => setTimeout(resolve, duration));
    },

    /**
     * Store user session in localStorage
     */
    setSession: function(email, name = '') {
        localStorage.setItem('hyprep_user', JSON.stringify({
            email: email,
            name: name,
            loginTime: new Date().toISOString()
        }));
    },

    /**
     * Get current session
     */
    getSession: function() {
        const session = localStorage.getItem('hyprep_user');
        return session ? JSON.parse(session) : null;
    },

    /**
     * Clear session
     */
    clearSession: function() {
        localStorage.removeItem('hyprep_user');
    },

    /**
     * Check if user is logged in
     */
    isLoggedIn: function() {
        return this.getSession() !== null;
    },

    /**
     * Show success message on input field
     */
    showSuccess: function(inputElement, message) {
        const parent = inputElement.closest('div') || inputElement.parentElement;
        let successDiv = parent.querySelector('.success-message');
        
        if (!successDiv) {
            successDiv = document.createElement('div');
            successDiv.className = 'success-message';
            successDiv.style.cssText = 'color: #27ae60; font-size: 0.85rem; margin-top: 4px; display: none;';
            parent.appendChild(successDiv);
        }
        
        successDiv.textContent = message;
        successDiv.style.display = 'block';
        inputElement.style.borderColor = '#27ae60';
        inputElement.style.boxShadow = '0 0 0 3px rgba(39, 174, 96, 0.15)';
    },

    /**
     * Clear success message from input field
     */
    clearSuccess: function(inputElement) {
        const parent = inputElement.closest('div') || inputElement.parentElement;
        const successDiv = parent.querySelector('.success-message');
        
        if (successDiv) {
            successDiv.style.display = 'none';
        }
        
        inputElement.style.borderColor = '#ccc';
        inputElement.style.boxShadow = 'none';
    },

    /**
     * Generate unique ID
     */
    generateId: function(prefix = 'id') {
        return prefix + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    },

    /**
     * Add input validation listeners
     */
    addInputListeners: function(inputElement, validatorFn) {
        inputElement.addEventListener('blur', function() {
            if (this.value.trim()) {
                validatorFn(this);
            }
        });
        
        inputElement.addEventListener('input', function() {
            if (this.style.borderColor === 'rgb(231, 76, 60)') {
                FormUtils.clearError(this);
            }
        });
    }
};

// Handle mobile-specific adjustments
window.addEventListener('load', function() {
    if (FormUtils.isMobile()) {
        document.body.classList.add('mobile-device');
    }
});

window.addEventListener('resize', function() {
    if (FormUtils.isMobile()) {
        document.body.classList.add('mobile-device');
    } else {
        document.body.classList.remove('mobile-device');
    }
});

