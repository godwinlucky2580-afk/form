/**
 * HYPREP Livelihood Portal - Password Reset JavaScript
 * Handles password reset request and OTP simulation
 */

document.addEventListener('DOMContentLoaded', function() {
    const resetForm = document.querySelector('form');
    const emailInput = document.getElementById('email-signup');
    const submitBtn = document.getElementById('get-opt');
    const resendLink = document.querySelector('.names a');

    // Real-time email validation
    if (emailInput) {
        FormUtils.addInputListeners(emailInput, function(input) {
            if (!FormUtils.isValidEmail(input.value)) {
                FormUtils.showError(input, 'Please enter a valid email address');
            } else {
                FormUtils.clearError(input);
            }
        });
    }

    // Form submission handler
    if (resetForm) {
        resetForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            // Validate email
            if (!emailInput.value.trim()) {
                FormUtils.showError(emailInput, 'Please enter your registered email');
                return;
            }

            if (!FormUtils.isValidEmail(emailInput.value)) {
                FormUtils.showError(emailInput, 'Please enter a valid email address');
                return;
            }

            FormUtils.clearError(emailInput);

            // Simulate OTP API call
            FormUtils.setLoading(submitBtn, 'Sending OTP...');

            try {
                await FormUtils.simulateApiCall(2000);

                // Generate random 6-digit OTP for demo
                const otp = Math.floor(100000 + Math.random() * 900000);
                localStorage.setItem('hyprep_reset_otp', otp);
                localStorage.setItem('hyprep_reset_email', emailInput.value);

                console.log('Demo OTP for ' + emailInput.value + ': ' + otp);

                // Success feedback
                submitBtn.textContent = 'OTP Sent!';
                submitBtn.style.backgroundColor = '#27ae60';

                alert('A 6-digit OTP has been sent to ' + emailInput.value + '\n\n(Demo OTP: ' + otp + ')');

                // Reset button after delay
                setTimeout(function() {
                    FormUtils.clearLoading(submitBtn);
                    submitBtn.textContent = 'Verify OTP';
                    
                    // Change form to OTP verification mode
                    transformToOtpForm();
                }, 1500);

            } catch (error) {
                console.error('Reset error:', error);
                FormUtils.clearLoading(submitBtn);
                alert('An error occurred. Please try again.');
            }
        });
    }

    // Resend link handler
    if (resendLink) {
        resendLink.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (!emailInput.value.trim() || !FormUtils.isValidEmail(emailInput.value)) {
                alert('Please enter a valid email first');
                emailInput.focus();
                return;
            }

            // Generate new OTP
            const otp = Math.floor(100000 + Math.random() * 900000);
            localStorage.setItem('hyprep_reset_otp', otp);
            
            alert('New OTP sent to ' + emailInput.value + '\n\n(Demo OTP: ' + otp + ')');
        });
    }

    /**
     * Transform form to show OTP input field
     */
    function transformToOtpForm() {
        const formContainer = document.querySelector('.signup-names');
        
        // Create OTP input section
        const otpSection = document.createElement('div');
        otpSection.id = 'otp-section';
        otpSection.innerHTML = `
            <label for="otp-input">Enter 6-digit OTP</label>
            <input type="text" id="otp-input" placeholder="123456" maxlength="6" pattern="[0-9]{6}" required>
        `;
        
        // Insert before the button
        const btnDiv = formContainer.querySelector('.btn') || submitBtn.parentElement;
        formContainer.insertBefore(otpSection, btnDiv);
        
        // Update button click handler
        submitBtn.textContent = 'Verify OTP';
        submitBtn.onclick = async function(e) {
            e.preventDefault();
            
            const otpInput = document.getElementById('otp-input');
            const storedOtp = localStorage.getItem('hyprep_reset_otp');
            
            // Validate OTP
            if (!otpInput.value || otpInput.value !== storedOtp) {
                FormUtils.showError(otpInput, 'Invalid OTP. Please try again.');
                return;
            }
            
            FormUtils.clearError(otpInput);
            
            // OTP verified — redirect to new password page
            window.location.href = 'newpassword.html';
        };
    }
});

