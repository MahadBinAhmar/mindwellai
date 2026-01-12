
// js/ui.js
// Shared UI logic to update user info on any page
(function () {
    document.addEventListener('DOMContentLoaded', function () {
        // Ensure auth is loaded
        if (!window.auth) return;

        const user = window.auth.getCurrentUser();
        if (!user) return;

        const fullName = (user.firstName || '') + ' ' + (user.lastName || '');

        // Update all elements with class 'u-name' (or specific IDs if legacy)
        const nameElements = document.querySelectorAll('.u-name');
        nameElements.forEach(el => el.textContent = fullName);

        // Fallback for specific IDs if classes aren't effectively used yet
        const nameId = document.getElementById('user-name');
        const profileNameId = document.getElementById('profile-name');
        if (nameId) nameId.textContent = fullName;
        if (profileNameId) profileNameId.textContent = fullName;

        // Update avatar
        if (user.profile && user.profile.photo) {
            const avatars = document.querySelectorAll('.u-avatar, #profile-avatar, #navbar-avatar');
            avatars.forEach(img => {
                if (img.tagName === 'IMG') img.src = user.profile.photo;
            });
        }

        // Click / Tap fade-in behavior for elements with class 'click-fade'
        const clickFadeEls = document.querySelectorAll('.click-fade');
        clickFadeEls.forEach(el => {
            if (!el.classList.contains('opacity-50')) el.classList.add('opacity-50');
            el.addEventListener('click', () => {
                el.classList.add('opacity-100');
                setTimeout(() => {
                    el.classList.remove('opacity-100');
                }, 600);
            }, {passive: true});
        });
    });
})();
