/**
 * B2B agent login — agents sign in with an admin-issued Agent ID that maps to
 * a synthetic Firebase Auth email (<id>@b2b.zamratravels.com).
 */
import { loginWithEmail, logoutUser, onAuthChange } from '../admin/auth.js';

const B2B_EMAIL_DOMAIN = 'b2b.zamratravels.com';

function agentIdToEmail(agentId) {
    return `${String(agentId || '').trim().toLowerCase()}@${B2B_EMAIL_DOMAIN}`;
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const agentIdInput = document.getElementById('login-agent-id');
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

    // Surface a forced-logout reason (e.g. account deactivated mid-session)
    const logoutReason = sessionStorage.getItem('b2bLogoutReason');
    if (logoutReason) {
        sessionStorage.removeItem('b2bLogoutReason');
        showError(logoutReason);
    }

    // Already signed in? Route strictly by claim.
    onAuthChange(async (user) => {
        if (!user) return;
        const { claims } = await user.getIdTokenResult();
        if (claims.agent) {
            window.location.href = '/b2b';
        } else if (claims.admin) {
            window.location.href = '/admin';
        } else {
            await logoutUser();
            showError('This account has no B2B portal access. Contact Zamra Travels.');
            setLoadingState(false);
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

            const agentId = agentIdInput.value.trim();
            const password = passwordInput.value;

            if (!agentId || !password) return;

            setLoadingState(true);
            hideError();

            try {
                const result = await loginWithEmail(agentIdToEmail(agentId), password);

                if (result.success) {
                    // Redirection is handled by onAuthChange
                    btnText.textContent = 'Success!';
                    loginCard.style.transform = 'scale(0.98)';
                    loginCard.style.opacity = '0.8';
                    loginCard.style.transition = 'all 0.4s ease';
                } else {
                    showError(mapAgentError(result.error));
                    setLoadingState(false);
                }
            } catch (err) {
                console.error('Login error:', err);
                showError('An unexpected error occurred. Please try again.');
                setLoadingState(false);
            }
        });
    }

    // Reword email-centric auth errors for the Agent ID flow.
    function mapAgentError(message = '') {
        if (/disabled/i.test(message)) return 'Account deactivated — contact Zamra Travels.';
        if (/no account|invalid email/i.test(message)) return 'Agent ID not found. Check the ID issued to you.';
        if (/invalid email or password|incorrect password/i.test(message)) return 'Invalid Agent ID or password.';
        return message || 'Login failed. Please try again.';
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

        setTimeout(() => {
            errorBox.classList.remove('shake');
        }, 500);
    }

    function hideError() {
        errorBox.classList.add('hidden');
    }
});
