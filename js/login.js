// js/login.js
// Page: pages/login.html
// Form validation and UX enhancements
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    // if already authenticated this session, go to dashboard
    if (window.auth && window.auth.isAuthenticated && window.auth.isAuthenticated()) {
      window.location.href = 'dashboard.html';
      return;
    }

    const form = document.getElementById('login-form');
    if (!form) return;

    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');

    const showError = (input, errorEl, message) => {
      input.classList.add('border-red-500');
      input.setAttribute('aria-invalid', 'true');
      errorEl.textContent = message;
      errorEl.classList.remove('sr-only');
    };

    const clearError = (input, errorEl) => {
      input.classList.remove('border-red-500');
      input.removeAttribute('aria-invalid');
      errorEl.textContent = '';
      if (!errorEl.classList.contains('sr-only')) errorEl.classList.add('sr-only');
    };

    const validateEmail = (value) => {
      if (!value) return 'Email is required.';
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(value)) return 'Enter a valid email address.';
      return '';
    };

    const validatePassword = (value) => {
      if (!value) return 'Password is required.';
      if (value.length < 8) return 'Password must be at least 8 characters.';
      return '';
    };

    email.addEventListener('input', () => {
      const msg = validateEmail(email.value.trim());
      if (!msg) clearError(email, emailError);
    });

    password.addEventListener('input', () => {
      const msg = validatePassword(password.value);
      if (!msg) clearError(password, passwordError);
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const emailVal = email.value.trim();
      const passwordVal = password.value;

      const emailMsg = validateEmail(emailVal);
      const passwordMsg = validatePassword(passwordVal);

      let firstInvalid = null;
      if (emailMsg) { showError(email, emailError, emailMsg); firstInvalid = firstInvalid || email; } else { clearError(email, emailError); }
      if (passwordMsg) { showError(password, passwordError, passwordMsg); firstInvalid = firstInvalid || password; } else { clearError(password, passwordError); }

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      // Authenticate against stored users
      const submitBtn = document.getElementById('login-btn');
      const genError = document.getElementById('login-general-error');
      const user = window.auth.getUserByEmail(emailVal);
      if (!user || user.password !== passwordVal) {
        genError.textContent = 'Invalid email or password.';
        genError.classList.remove('sr-only');
        email.focus();
        return;
      }

      window.auth.setCurrentUser(emailVal);
      // ensure session is set explicitly
      if (window.auth.setSessionUser) window.auth.setSessionUser(emailVal);
      submitBtn.disabled = true;
      submitBtn.classList.add('opacity-60', 'cursor-not-allowed');
      submitBtn.textContent = 'Logging in...';
      setTimeout(() => { window.location.href = 'dashboard.html'; }, 300);
    });
  });
})();
