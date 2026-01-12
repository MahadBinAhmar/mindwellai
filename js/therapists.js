// js/therapists.js
// Page: pages/therapists.html
// Search and booking interactions
(function () {
    document.addEventListener('DOMContentLoaded', function () {
        // Search Functionality
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.getElementById('search-btn');
        const therapistCards = document.querySelectorAll('div.bg-white.p-8'); // Selector for therapist cards

        function filterTherapists() {
            const query = searchInput.value.toLowerCase().trim();

            therapistCards.forEach(card => {
                const name = card.querySelector('h3').textContent.toLowerCase();
                const specialty = card.querySelector('p.text-teal-600').textContent.toLowerCase();

                if (name.includes(query) || specialty.includes(query)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        }

        if (searchBtn && searchInput) {
            searchBtn.addEventListener('click', filterTherapists);
            // Optional: Helper to search on 'Enter' key press
            searchInput.addEventListener('keypress', function (e) {
                if (e.key === 'Enter') filterTherapists();
            });
        }

        // Book Session Handling
        const bookButtons = document.querySelectorAll('a[href="booking.html"]');

        bookButtons.forEach(btn => {
            btn.addEventListener('click', function (e) {
                // Determine the therapist card container
                const card = e.target.closest('div.bg-white');
                if (!card) return;

                const name = card.querySelector('h3').textContent.trim();
                const title = card.querySelector('p.text-teal-600').textContent.trim();
                const img = card.querySelector('img').src;
                // Price is the text node of the paragraph with text-teal-800
                const priceEl = card.querySelector('p.text-teal-800');
                const price = priceEl ? priceEl.innerText.split('/')[0].trim() : 'Rs. 2000'; // fallback

                const therapistData = {
                    name,
                    title,
                    img,
                    price
                };

                // Save to sessionStorage for the booking page to pick up
                sessionStorage.setItem('mw_selected_therapist', JSON.stringify(therapistData));
            });
        });
    });
})();
