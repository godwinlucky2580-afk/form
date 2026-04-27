/**
 * HYPREP Livelihood Portal - Login Page JavaScript
 * Handles form validation, authentication simulation, and navigation
 */

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('form');
    const emailInput = document.getElementById('email-signup');
    const passwordInput = document.getElementById('password');
    const submitBtn = loginForm.querySelector('.green-btn2');

    // Check if user is already logged in
    if (FormUtils.isLoggedIn()) {
        const session = FormUtils.getSession();
        console.log('Welcome back, ' + (session.name || session.email));
    }

    // Real-time validation
    if (emailInput) {
        FormUtils.addInputListeners(emailInput, function(input) {
            if (!FormUtils.isValidEmail(input.value)) {
                FormUtils.showError(input, 'Please enter a valid email address');
            } else {
                FormUtils.clearError(input);
            }
        });
    }

    if (passwordInput) {
        FormUtils.addInputListeners(passwordInput, function(input) {
            if (!FormUtils.isValidPassword(input.value)) {
                FormUtils.showError(input, 'Password must be at least 6 characters');
            } else {
                FormUtils.clearError(input);
            }
        });
    }

    // Form submission handler
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            let isValid = true;

            // Validate email
            if (!emailInput.value.trim()) {
                FormUtils.showError(emailInput, 'Email is required');
                isValid = false;
            } else if (!FormUtils.isValidEmail(emailInput.value)) {
                FormUtils.showError(emailInput, 'Please enter a valid email address');
                isValid = false;
            } else {
                FormUtils.clearError(emailInput);
            }

            // Validate password
            if (!passwordInput.value) {
                FormUtils.showError(passwordInput, 'Password is required');
                isValid = false;
            } else if (!FormUtils.isValidPassword(passwordInput.value)) {
                FormUtils.showError(passwordInput, 'Password must be at least 6 characters');
                isValid = false;
            } else {
                FormUtils.clearError(passwordInput);
            }

            if (!isValid) {
                return;
            }

            // Simulate login API call
            FormUtils.setLoading(submitBtn, 'Signing in...');

            try {
                await FormUtils.simulateApiCall(1500);

                // Use Auth module for real authentication
                const result = Auth.login(emailInput.value, passwordInput.value);

                if (result.success) {
                    // Show success feedback
                    submitBtn.textContent = 'Login Successful!';
                    submitBtn.style.backgroundColor = '#27ae60';
                    
                    // Redirect after brief delay
                    setTimeout(function() {
                        window.location.href = 'confirm.html';
                    }, 1000);
                } else {
                    FormUtils.clearLoading(submitBtn);
                    alert(result.message);
                    emailInput.focus();
                }
            } catch (error) {
                console.error('Login error:', error);
                FormUtils.clearLoading(submitBtn);
                alert('An error occurred. Please try again.');
            }
        });
    }

    // "Create Account" button handler (header)
    const createAccountBtn = document.querySelector('.green-btn1');
    if (createAccountBtn) {
        createAccountBtn.addEventListener('click', function(e) {
            // Let the <a> tag handle navigation naturally
        });
    }
});

