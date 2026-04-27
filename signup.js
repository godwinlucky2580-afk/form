/**
 * HYPREP Livelihood Portal - Signup Page JavaScript
 * Handles registration form validation and account creation
 */

document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.querySelector('form');
    const firstNameInput = document.getElementById('f-name');
    const lastNameInput = document.getElementById('L-name');
    const emailInput = document.getElementById('email-signup');
    const phoneInput = document.getElementById('Phone-number');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const termsCheckbox = document.getElementById('tick-it');
    const submitBtn = signupForm.querySelector('.green-btn2');

    // Real-time validation for each field
    if (firstNameInput) {
        FormUtils.addInputListeners(firstNameInput, function(input) {
            if (input.value.trim().length < 2) {
                FormUtils.showError(input, 'First name must be at least 2 characters');
            } else {
                FormUtils.clearError(input);
            }
        });
    }

    if (lastNameInput) {
        FormUtils.addInputListeners(lastNameInput, function(input) {
            if (input.value.trim().length < 2) {
                FormUtils.showError(input, 'Last name must be at least 2 characters');
            } else {
                FormUtils.clearError(input);
            }
        });
    }

    if (emailInput) {
        FormUtils.addInputListeners(emailInput, function(input) {
            if (!FormUtils.isValidEmail(input.value)) {
                FormUtils.showError(input, 'Please enter a valid email address');
            } else {
                FormUtils.clearError(input);
            }
        });
    }

    if (phoneInput) {
        FormUtils.addInputListeners(phoneInput, function(input) {
            if (!FormUtils.isValidPhone(input.value)) {
                FormUtils.showError(input, 'Please enter a valid Nigerian phone number');
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
            
            // Also validate confirm password if it has a value
            if (confirmPasswordInput && confirmPasswordInput.value) {
                if (input.value !== confirmPasswordInput.value) {
                    FormUtils.showError(confirmPasswordInput, 'Passwords do not match');
                } else {
                    FormUtils.clearError(confirmPasswordInput);
                }
            }
        });
    }

    if (confirmPasswordInput) {
        FormUtils.addInputListeners(confirmPasswordInput, function(input) {
            if (input.value !== passwordInput.value) {
                FormUtils.showError(input, 'Passwords do not match');
            } else {
                FormUtils.clearError(input);
            }
        });
    }

    // Form submission handler
    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            let isValid = true;

            // Validate first name
            if (!firstNameInput.value.trim()) {
                FormUtils.showError(firstNameInput, 'First name is required');
                isValid = false;
            } else if (firstNameInput.value.trim().length < 2) {
                FormUtils.showError(firstNameInput, 'First name must be at least 2 characters');
                isValid = false;
            } else {
                FormUtils.clearError(firstNameInput);
            }

            // Validate last name
            if (!lastNameInput.value.trim()) {
                FormUtils.showError(lastNameInput, 'Last name is required');
                isValid = false;
            } else if (lastNameInput.value.trim().length < 2) {
                FormUtils.showError(lastNameInput, 'Last name must be at least 2 characters');
                isValid = false;
            } else {
                FormUtils.clearError(lastNameInput);
            }

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

            // Validate phone
            if (!phoneInput.value.trim()) {
                FormUtils.showError(phoneInput, 'Phone number is required');
                isValid = false;
            } else if (!FormUtils.isValidPhone(phoneInput.value)) {
                FormUtils.showError(phoneInput, 'Please enter a valid Nigerian phone number (e.g., 08012345678)');
                isValid = false;
            } else {
                FormUtils.clearError(phoneInput);
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

            // Validate confirm password
            if (!confirmPasswordInput.value) {
                FormUtils.showError(confirmPasswordInput, 'Please confirm your password');
                isValid = false;
            } else if (confirmPasswordInput.value !== passwordInput.value) {
                FormUtils.showError(confirmPasswordInput, 'Passwords do not match');
                isValid = false;
            } else {
                FormUtils.clearError(confirmPasswordInput);
            }

            // Validate terms checkbox
            if (!termsCheckbox.checked) {
                alert('Please agree to the Terms of Service and Privacy Policy');
                termsCheckbox.focus();
                isValid = false;
            }

            if (!isValid) {
                return;
            }

            // Simulate registration API call
            FormUtils.setLoading(submitBtn, 'Creating Account...');

            try {
                await FormUtils.simulateApiCall(2000);

                // Use Auth module to register user
                const result = Auth.register({
                    firstName: firstNameInput.value.trim(),
                    lastName: lastNameInput.value.trim(),
                    email: emailInput.value.trim(),
                    phone: phoneInput.value.trim(),
                    password: passwordInput.value
                });

                if (!result.success) {
                    FormUtils.clearLoading(submitBtn);
                    alert(result.message);
                    return;
                }

                // Success feedback
                submitBtn.textContent = 'Account Created!';
                submitBtn.style.backgroundColor = '#27ae60';

                // Redirect to confirmation page
                setTimeout(function() {
                    window.location.href = 'confirm.html';
                }, 1000);

            } catch (error) {
                console.error('Registration error:', error);
                FormUtils.clearLoading(submitBtn);
                alert('An error occurred. Please try again.');
            }
        });
    }
});

