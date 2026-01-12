// js/feedback.js
// Page: pages/feedback.html
// Rating and modal logic
(function(){
    // Rating logic
    function rate(stars){
        const starButtons = document.querySelectorAll('.star');
        const feedbackText = document.getElementById('rating-text');
        starButtons.forEach((btn, index) => {
            if (index < stars) {
                btn.classList.add('text-yellow-400', 'scale-110');
                btn.classList.remove('text-gray-200');
            } else {
                btn.classList.remove('text-yellow-400', 'scale-110');
                btn.classList.add('text-gray-200');
            }
        });
        if (feedbackText) {
            feedbackText.innerHTML = `You rated ${stars} Star${stars > 1 ? 's' : ''}! 🌟`;
            feedbackText.classList.remove('pop-in', 'opacity-0');
            void feedbackText.offsetWidth;
            feedbackText.classList.add('pop-in');
        }
    }

    // Modal and accessibility logic
    let previousActiveElement = null;
    let modalKeydownHandler = null;

    function closeModal() {
        const modal = document.getElementById('modal');
        if (!modal) return;
        modal.classList.add('hidden');
        modal.removeAttribute('aria-labelledby');
        modal.removeAttribute('role');
        modal.removeAttribute('aria-modal');
        if (modalKeydownHandler) {
            document.removeEventListener('keydown', modalKeydownHandler);
            modalKeydownHandler = null;
        }
        if (previousActiveElement) previousActiveElement.focus();
        previousActiveElement = null;
    }

    function showThankYouModal() {
        const modal = document.getElementById('modal');
        const content = document.getElementById('modal-content');
        if (!modal || !content) return;
        previousActiveElement = document.activeElement;

        content.innerHTML = `
            <button id="modal-close" aria-label="Close dialog" class="absolute top-4 right-4 text-gray-300 hover:text-gray-500 text-xl font-bold">✕</button>
            <div class="w-14 h-14 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                <img src="../assets/like.png" class="w-8 h-8 object-contain" alt="like">
            </div>
            <h2 id="modal-title" class="text-2xl font-bold text-gray-800 mb-2">Thank You!</h2>
            <p class="text-gray-500 text-sm mb-8 leading-relaxed">We appreciate your feedback.</p>
            <button id="modal-dashboard" class="flex items-center justify-center gap-2 w-full bg-teal-600 text-white py-3.5 rounded-xl font-bold hover:bg-teal-700 transition shadow-md">
                <img src="../assets/dashboard.png" class="w-8 h-8 object-contain invert brightness-0" alt="dashboard">
                <span>Dashboard</span>
            </button>
        `;

        modal.setAttribute('role','dialog');
        modal.setAttribute('aria-modal','true');
        modal.setAttribute('aria-labelledby','modal-title');
        modal.classList.remove('hidden');

        const focusable = modal.querySelectorAll('a, button, input, textarea, [tabindex]:not([tabindex="-1"])');
        const focusableEl = Array.from(focusable).filter(el => !el.hasAttribute('disabled'));
        if (focusableEl.length) focusableEl[0].focus();

        modalKeydownHandler = function(e){
            if (e.key === 'Escape') { closeModal(); }
            if (e.key === 'Tab') {
                if (!focusableEl.length) return;
                const first = focusableEl[0];
                const last = focusableEl[focusableEl.length -1];
                if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
                if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            }
        };
        document.addEventListener('keydown', modalKeydownHandler);

        const closeBtn = document.getElementById('modal-close');
        if (closeBtn) closeBtn.addEventListener('click', closeModal);
        const dashBtn = document.getElementById('modal-dashboard');
        if (dashBtn) dashBtn.addEventListener('click', function(){ window.location.href = 'dashboard.html'; });
    }

    function goToDashboard() { window.location.href = 'dashboard.html'; }

    document.addEventListener('DOMContentLoaded', function(){
        const stars = document.querySelectorAll('.star');
        stars.forEach((s, i) => s.addEventListener('click', () => rate(i+1)));
        // expose functions globally for inline attributes
        window.rate = rate;
        window.showThankYouModal = showThankYouModal;
        window.closeModal = closeModal;
        window.goToDashboard = goToDashboard;
    });
})();
