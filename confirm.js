/**
 * HYPREP Livelihood Portal - Confirmation Page JavaScript
 * Handles success page interactions and auto-redirect
 */

document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('login-successful');
    const userInfoTitle = document.querySelector('.user-info h3');
    const userInfoText = document.querySelector('.user-info p');
    const profilePic = document.getElementById('profile_picture');

    // Get registered user data if available
    const registeredUser = localStorage.getItem('hyprep_registered_user');
    const currentUser = Auth.getCurrentUser();
    const session = FormUtils.getSession();

    if (registeredUser) {
        const userData = JSON.parse(registeredUser);
        
        // Personalize the confirmation page for new signup
        if (userData.firstName) {
            userInfoTitle.textContent = 'Welcome, ' + userData.firstName + '!';
            
            // Update profile picture initial
            if (profilePic) {
                profilePic.textContent = userData.firstName.charAt(0).toUpperCase();
            }
        }
        
        userInfoText.textContent = 'Your HYPREP Livelihood account has been successfully created.';
    } else if (currentUser) {
        // User logged in successfully
        const firstName = currentUser.firstName || currentUser.name.split(' ')[0];
        userInfoTitle.textContent = 'Welcome back, ' + firstName + '!';
        if (profilePic) {
            profilePic.textContent = firstName.charAt(0).toUpperCase();
        }
        userInfoText.textContent = 'You have successfully logged into your account.';
    } else if (session && session.name) {
        userInfoTitle.textContent = 'Welcome back, ' + session.name.split(' ')[0] + '!';
        if (profilePic) {
            profilePic.textContent = session.name.charAt(0).toUpperCase();
        }
        userInfoText.textContent = 'You have successfully logged into your account.';
    }

    // Login button handler
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            // Add click animation
            this.style.transform = 'scale(0.98)';
            
            setTimeout(function() {
                window.location.href = 'login.html';
            }, 150);
        });
    }

    // Optional: Auto-redirect after 10 seconds
    const autoRedirect = false; // Set to true to enable
    
    if (autoRedirect && loginBtn) {
        let countdown = 10;
        const originalText = loginBtn.textContent;
        
        const timer = setInterval(function() {
            countdown--;
            loginBtn.textContent = originalText + ' (' + countdown + 's)';
            
            if (countdown <= 0) {
                clearInterval(timer);
                window.location.href = 'login.html';
            }
        }, 1000);
    }

    // Add success animation to profile pic
    if (profilePic) {
        profilePic.style.transition = 'transform 0.5s ease, background-color 0.5s ease';
        
        setTimeout(function() {
            profilePic.style.transform = 'scale(1.1)';
            profilePic.style.backgroundColor = '#27ae60';
            
            setTimeout(function() {
                profilePic.style.transform = 'scale(1)';
            }, 300);
        }, 300);
    }

    // Animate tips section
    const tips = document.querySelector('.tips');
    if (tips) {
        tips.style.opacity = '0';
        tips.style.transform = 'translateY(20px)';
        tips.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        setTimeout(function() {
            tips.style.opacity = '1';
            tips.style.transform = 'translateY(0)';
        }, 500);
    }
});

