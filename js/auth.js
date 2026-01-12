// js/auth.js
// Simple client-side user store (localStorage) and auth helpers for the prototype
(function () {
    const USERS_KEY = 'mw_users';
    const CURRENT_KEY = 'mw_currentUser';
    const SESSION_KEY = 'mw_sessionUser';

    function getUsers() {
        try {
            return JSON.parse(localStorage.getItem(USERS_KEY) || '{}');
        } catch (e) {
            return {};
        }
    }

    function saveUsers(users) {
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    function getUserByEmail(email) {
        if (!email) return null;
        const users = getUsers();
        return users[email.toLowerCase()] || null;
    }

    function createUser({ firstName, lastName, email, password }) {
        const key = email.toLowerCase();
        const users = getUsers();
        if (users[key]) throw new Error('User already exists');

        const id = 'MW-' + (Date.now() % 100000);
        const user = {
            firstName: firstName || '',
            lastName: lastName || '',
            email: email,
            password: password || '', // NOTE: demo only — don't store raw passwords in production
            patientId: id,
            profile: {},
            assessment: null,
            bookings: [],
            createdAt: new Date().toISOString()
        };
        users[key] = user;
        saveUsers(users);
        // register creates account; we also set current user and start session
        setCurrentUser(email);
        setSessionUser(email);
        return user;
    }

    function setCurrentUser(email) {
        if (!email) return;
        localStorage.setItem(CURRENT_KEY, email.toLowerCase());
        // also set session as active when explicitly setting current user
        try { setSessionUser(email); } catch (e) { }
    }

    function getCurrentUserEmail() {
        return localStorage.getItem(CURRENT_KEY) || null;
    }

    function getCurrentUser() {
        const email = getCurrentUserEmail();
        if (!email) return null;
        return getUserByEmail(email);
    }

    // Session helpers (sessionStorage) - used to represent an active login session
    function setSessionUser(email) {
        if (!email) return;
        sessionStorage.setItem(SESSION_KEY, email.toLowerCase());
    }

    function clearSessionUser() {
        sessionStorage.removeItem(SESSION_KEY);
    }

    function getSessionUserEmail() {
        return sessionStorage.getItem(SESSION_KEY) || null;
    }

    function isAuthenticated() {
        // session store is authoritative for active auth
        return !!getSessionUserEmail();
    }

    function logout() {
        // keep user record but clear session
        clearSessionUser();
        // Optionally the app could redirect to login page
    }

    function updateCurrentUser(updates) {
        const email = getCurrentUserEmail();
        if (!email) return null;
        const users = getUsers();
        const user = users[email];
        if (!user) return null;
        Object.assign(user, updates);
        users[email] = user;
        saveUsers(users);
        return user;
    }

    function requireAuth(redirectTo) {
        if (!isAuthenticated()) {
            window.location.href = redirectTo || 'login.html';
        }
    }

    function saveProfile(profile) {
        const user = getCurrentUser();
        if (!user) return null;

        // Ensure we don't overwrite the entire profile object if it exists
        user.profile = user.profile || {};

        // Merge new fields into existing profile
        Object.keys(profile).forEach(key => {
            user.profile[key] = profile[key];
        });

        updateCurrentUser(user);
        return user;
    }

    function saveAssessment(answers) {
        const user = getCurrentUser();
        if (!user) return null;
        // Simple scoring: map option index to score
        // If answers are strings, compute a small metric
        const score = answers.length ? answers.reduce((acc, a) => {
            // assign rough weights based on some keywords
            if (typeof a === 'string') {
                if (a.toLowerCase().includes('not at all')) return acc + 0;
                if (a.toLowerCase().includes('several')) return acc + 1;
                return acc + 2;
            }
            return acc + (Number(a) || 0);
        }, 0) : 0;

        user.assessment = { answers, score, updatedAt: new Date().toISOString() };
        updateCurrentUser(user);
        return user.assessment;
    }

    window.auth = {
        getUsers,
        saveUsers,
        getUserByEmail,
        createUser,
        setCurrentUser,
        getCurrentUserEmail,
        getCurrentUser,
        setSessionUser,
        clearSessionUser,
        getSessionUserEmail,
        isAuthenticated,
        logout,
        updateCurrentUser,
        requireAuth,
        saveProfile,
        saveAssessment
    };

    // attach logout handlers to elements with class 'mw-logout'
    document.addEventListener('DOMContentLoaded', function () {
        try {
            const links = document.querySelectorAll('.mw-logout');
            links.forEach(link => {
                link.addEventListener('click', function (e) {
                    e.preventDefault();
                    logout();
                    const href = link.getAttribute('href') || '../index.html';
                    window.location.href = href;
                });
            });
        } catch (e) {/* ignore */ }
    });

})();
