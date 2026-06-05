import { loginWithEmail, onAuthChange } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const togglePasswordBtn = document.getElementById('toggle-password');
    const eyeIcon = document.getElementById('eye-icon');
    const loginSubmitBtn = document.getElementById('login-submit');
    const btnText = document.getElementById('btn-text');
    const btnArrow = document.getElementById('btn-arrow');
    const btnSpinner = document.getElementById('btn-spinner');
    const errorBox = document.getElementById('login-error');
    const errorText = document.getElementById('login-error-text');
    const loginCard = document.getElementById('login-card');

    // Check if user is already logged in
    onAuthChange((user) => {
        if (user) {
            // Check if user is admin - although this is mostly handled by rules
            window.location.href = '/admin.html';
        }
    });

    // Toggle password visibility
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            if (type === 'text') {
                eyeIcon.classList.remove('bi-eye');
                eyeIcon.classList.add('bi-eye-slash');
            } else {
                eyeIcon.classList.remove('bi-eye-slash');
                eyeIcon.classList.add('bi-eye');
            }
        });
    }

    // Handle login submission
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            
            if (!email || !password) return;
            
            // Set loading state
            setLoadingState(true);
            hideError();
            
            try {
                const result = await loginWithEmail(email, password);
                
                if (result.success) {
                    // Success! Redirection is handled by onAuthChange
                    btnText.textContent = 'Success!';
                    loginCard.style.transform = 'scale(0.98)';
                    loginCard.style.opacity = '0.8';
                    loginCard.style.transition = 'all 0.4s ease';
                } else {
                    // Show error
                    showError(result.error || 'Authentication failed. Please try again.');
                    setLoadingState(false);
                }
            } catch (err) {
                console.error('Login error:', err);
                showError('An unexpected error occurred. Please try again.');
                setLoadingState(false);
            }
        });
    }

    function setLoadingState(isLoading) {
        if (isLoading) {
            loginSubmitBtn.disabled = true;
            btnText.textContent = 'Signing In...';
            btnArrow.classList.add('hidden');
            btnSpinner.classList.remove('hidden');
        } else {
            loginSubmitBtn.disabled = false;
            btnText.textContent = 'Sign In';
            btnArrow.classList.remove('hidden');
            btnSpinner.classList.add('hidden');
        }
    }

    function showError(message) {
        errorText.textContent = message;
        errorBox.classList.remove('hidden');
        errorBox.classList.add('shake');
        
        // Remove shake class after animation completes so it can shake again
        setTimeout(() => {
            errorBox.classList.remove('shake');
        }, 500);
    }

    function hideError() {
        errorBox.classList.add('hidden');
    }
});
