// js/register.js
// Page: pages/register.html
// Registration form handling and validation
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    // redirect only if authenticated this session
    if (window.auth && window.auth.isAuthenticated && window.auth.isAuthenticated()) {
      window.location.href = 'dashboard.html';
      return;
    }

    const form = document.getElementById('register-form');
    if (!form) return;

    const first = document.getElementById('first-name');
    const last = document.getElementById('last-name');
    const email = document.getElementById('reg-email');
    const password = document.getElementById('reg-password');

    const firstError = document.getElementById('first-error');
    const lastError = document.getElementById('last-error');
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

    const validateName = (v) => (!v || !v.trim() ? 'This field is required.' : '');
    const validateEmail = (v) => {
      if (!v || !v.trim()) return 'Email is required.';
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(v)) return 'Enter a valid email address.';
      return '';
    };
    const validatePassword = (v) => {
      if (!v) return 'Password is required.';
      if (v.length < 8) return 'Password must be at least 8 characters.';
      return '';
    };

    [first, last, email, password].forEach((el) => {
      el.addEventListener('input', () => {
        // clear individual errors on input
        const id = el.id;
        if (id === 'first-name') { if (!validateName(el.value)) clearError(el, firstError); }
        if (id === 'last-name') { if (!validateName(el.value)) clearError(el, lastError); }
        if (id === 'reg-email') { if (!validateEmail(el.value.trim())) clearError(el, emailError); }
        if (id === 'reg-password') { if (!validatePassword(el.value)) clearError(el, passwordError); }
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const firstMsg = validateName(first.value);
      const lastMsg = validateName(last.value);
      const emailMsg = validateEmail(email.value.trim());
      const passwordMsg = validatePassword(password.value);

      let firstInvalid = null;
      if (firstMsg) { showError(first, firstError, firstMsg); firstInvalid = firstInvalid || first; } else { clearError(first, firstError); }
      if (lastMsg) { showError(last, lastError, lastMsg); firstInvalid = firstInvalid || last; } else { clearError(last, lastError); }
      if (emailMsg) { showError(email, emailError, emailMsg); firstInvalid = firstInvalid || email; } else { clearError(email, emailError); }
      if (passwordMsg) { showError(password, passwordError, passwordMsg); firstInvalid = firstInvalid || password; } else { clearError(password, passwordError); }

      if (firstInvalid) { firstInvalid.focus(); return; }

      const submitBtn = document.getElementById('register-btn');
      const genError = document.getElementById('register-general-error');
      submitBtn.disabled = true;
      submitBtn.classList.add('opacity-60', 'cursor-not-allowed');
      submitBtn.textContent = 'Creating...';

      // Create user in localStorage via auth
      try {
        const created = window.auth.createUser({
          firstName: first.value.trim(),
          lastName: last.value.trim(),
          email: email.value.trim(),
          password: password.value
        });
        // go to profile setup after creating
        setTimeout(() => {
          window.location.href = 'profile-setup.html';
        }, 300);
      } catch (err) {
        submitBtn.disabled = false;
        submitBtn.classList.remove('opacity-60', 'cursor-not-allowed');
        submitBtn.textContent = 'Create Account';
        genError.textContent = err.message || 'An error occurred';
        genError.classList.remove('sr-only');
        genError.focus && genError.focus();
      }
    });
  });
})();
