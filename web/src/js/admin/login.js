import '../../styles/admin/style.css';
import { loginWithEmail, onAuthChange } from './auth.js';

// If user is already authenticated, redirect to admin dashboard
onAuthChange((user) => {
  if (user) {
    window.location.href = '/admin.html';
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');
  const submitBtn = document.getElementById('login-submit');
  const btnText = document.getElementById('btn-text');
  const btnArrow = document.getElementById('btn-arrow');
  const btnSpinner = document.getElementById('btn-spinner');
  const errorBox = document.getElementById('login-error');
  const errorText = document.getElementById('login-error-text');
  const togglePassword = document.getElementById('toggle-password');
  const eyeIcon = document.getElementById('eye-icon');
  const loginCard = document.getElementById('login-card');

  // Toggle password visibility
  if (togglePassword) {
    togglePassword.addEventListener('click', () => {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      eyeIcon.classList.toggle('bi-eye', !isPassword);
      eyeIcon.classList.toggle('bi-eye-slash', isPassword);
    });
  }

  // Show error
  function showError(msg) {
    errorText.textContent = msg;
    errorBox.classList.remove('hidden');
    loginCard.classList.add('shake');
    setTimeout(() => loginCard.classList.remove('shake'), 500);
  }

  // Hide error
  function hideError() {
    errorBox.classList.add('hidden');
  }

  // Set loading state
  function setLoading(loading) {
    submitBtn.disabled = loading;
    if (loading) {
      btnText.textContent = 'Signing in...';
      btnArrow.classList.add('hidden');
      btnSpinner.classList.remove('hidden');
    } else {
      btnText.textContent = 'Sign In';
      btnArrow.classList.remove('hidden');
      btnSpinner.classList.add('hidden');
    }
  }

  // Handle form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      showError('Please enter both email and password.');
      return;
    }

    setLoading(true);

    const result = await loginWithEmail(email, password);

    if (result.success) {
      // Success — onAuthChange will redirect to admin
      btnText.textContent = 'Welcome back!';
    } else {
      setLoading(false);
      showError(result.error);
    }
  });

  // Allow Enter key to submit
  passwordInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      form.dispatchEvent(new Event('submit'));
    }
  });

  // Focus email input on load
  emailInput.focus();
});
