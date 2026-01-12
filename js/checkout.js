// js/checkout.js
// Page: pages/checkout.html
// Payment form handling (demo). Replace with payment provider integration for prod.
(function () {
    document.addEventListener('DOMContentLoaded', function () {
        // 1. Populate UI from Session Storage
        const previewStr = sessionStorage.getItem('mw_booking_preview');
        if (previewStr) {
            const preview = JSON.parse(previewStr);

            const nameEl = document.getElementById('checkout-therapist-name');
            const titleEl = document.getElementById('checkout-therapist-title');
            const avatarEl = document.getElementById('checkout-therapist-avatar');
            const datetimeEl = document.getElementById('checkout-therapist-datetime');

            if (nameEl) nameEl.textContent = preview.therapistName;
            if (titleEl) titleEl.textContent = preview.therapistTitle;
            if (avatarEl) avatarEl.src = preview.therapistAvatar;

            if (datetimeEl) {
                datetimeEl.textContent = `${preview.date}, ${preview.time}`;
            }

            // Show price if element exists (will add to HTML next)
            const priceEl = document.getElementById('checkout-price');
            const totalEl = document.getElementById('checkout-total');
            if (preview.price) {
                if (priceEl) priceEl.textContent = preview.price;
                if (totalEl) totalEl.textContent = preview.price;
            }
        }

        const form = document.getElementById('payment-form');
        if (!form) return;
        form.addEventListener('submit', function (e) {
            // keep demo behavior in JS file
            e.preventDefault();

            // Save booking for current user
            // Save booking for current user
            if (window.auth) {
                const user = window.auth.getCurrentUser();
                if (user) {
                    // Try to get from session preview first
                    const previewStr = sessionStorage.getItem('mw_booking_preview');
                    let booking = {};

                    if (previewStr) {
                        const preview = JSON.parse(previewStr);
                        booking = {
                            therapistName: preview.therapistName,
                            therapistAvatar: preview.therapistAvatar,
                            therapistTitle: preview.therapistTitle,
                            // Save distinct fields
                            date: preview.date,
                            time: preview.time,
                            // Keep legacy string for backward compatibility or simple display
                            datetime: (preview.time || '') + ' • ' + (preview.date || ''),
                            service: 'Therapy Session (1hr)',
                            price: preview.price || 'Rs. 2000',
                            createdAt: new Date().toISOString()
                        };
                    } else {
                        // Fallback to scraping logic if flow was bypassed (legacy)
                        const therapistNameEl = document.getElementById('checkout-therapist-name');
                        const therapistAvatarEl = document.getElementById('checkout-therapist-avatar');
                        const datetimeEl = document.getElementById('checkout-therapist-datetime');
                        booking = {
                            therapistName: therapistNameEl ? therapistNameEl.textContent.trim() : 'Therapist',
                            therapistAvatar: therapistAvatarEl ? therapistAvatarEl.src : '',
                            therapistTitle: document.getElementById('checkout-therapist-title') ? document.getElementById('checkout-therapist-title').textContent.trim() : '',
                            datetime: datetimeEl ? datetimeEl.textContent.trim() : '',
                            service: 'Therapy Session (1hr)',
                            createdAt: new Date().toISOString()
                        };
                    }

                    const bookings = user.bookings || [];
                    bookings.unshift(booking); // add newest first
                    window.auth.updateCurrentUser({ bookings });
                }
            }

            window.location.href = 'feedback.html';
        });
    });
})();
