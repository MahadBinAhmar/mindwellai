// js/dashboard.js
// Page: pages/dashboard.html
// Dashboard interactivity (charts, quick actions)
(function () {
  document.addEventListener('DOMContentLoaded', function () {
    if (!window.auth) return;
    // require active session (not just an account existing)
    if (!window.auth.isAuthenticated || !window.auth.isAuthenticated()) {
      window.location.href = 'login.html';
      return;
    }

    const user = window.auth.getCurrentUser();
    if (!user) return;

    const nameEl = document.getElementById('user-name');
    const profileNameEl = document.getElementById('profile-name');
    const patientIdEl = document.getElementById('patient-id');

    if (nameEl) nameEl.textContent = (user.firstName || '') + ' ' + (user.lastName || '');
    if (profileNameEl) profileNameEl.textContent = (user.firstName || '') + ' ' + (user.lastName || '');
    if (patientIdEl) patientIdEl.textContent = user.patientId || '';

    // set avatar if provided
    const avatar = document.getElementById('profile-avatar');
    if (avatar && user.profile && user.profile.photo) {
      avatar.src = user.profile.photo;
    }

    // Greeting: Welcome or Welcome back
    const fullName = (user.firstName || '') + ' ' + (user.lastName || '');
    const userNameSpan = document.getElementById('user-name');
    if (userNameSpan) userNameSpan.textContent = fullName;

    const greetingEl = document.getElementById('greeting-text');
    if (greetingEl) {
      if (!user.lastSeen) {
        greetingEl.textContent = 'Welcome, ' + (user.firstName || user.email || '');
      } else {
        greetingEl.textContent = 'Welcome back, ' + (user.firstName || user.email || '');
      }
      // update lastSeen
      window.auth.updateCurrentUser({ lastSeen: new Date().toISOString() });
    }

    // Set Current Date
    const dateEl = document.getElementById('current-date-display');
    if (dateEl) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      dateEl.textContent = new Date().toLocaleDateString('en-US', options);
    }

    // Upcoming booking
    const bookings = user.bookings || [];
    const upcomingBox = document.getElementById('upcoming-session');
    if (bookings.length === 0) {
      if (upcomingBox) upcomingBox.style.display = 'none';
    } else {
      const next = bookings[0];
      const upAvatar = document.getElementById('upcoming-avatar');
      const upName = document.getElementById('upcoming-name');
      const upTitle = document.getElementById('upcoming-title');
      const upTime = document.getElementById('upcoming-time');
      const upDate = document.getElementById('upcoming-date');

      if (upAvatar && next.therapistAvatar) upAvatar.src = next.therapistAvatar;
      if (upName) upName.textContent = next.therapistName || 'Therapist';
      if (upTitle) upTitle.textContent = (next.therapistTitle || next.service || 'Therapy Session');
      // Use distinct fields if available, otherwise split string
      let timeStr = next.time;
      let dateStr = next.date;

      if (!timeStr || !dateStr) {
        const parts = next.datetime ? next.datetime.split('•') : [];
        timeStr = parts[0] ? parts[0].trim() : '';
        dateStr = parts[1] ? parts[1].trim() : (new Date(next.createdAt).toLocaleDateString());
      }

      if (upTime) upTime.textContent = timeStr;
      if (upDate) upDate.textContent = dateStr;

      // Cancel Booking Logic
      const cancelBtn = document.getElementById('cancel-booking-btn');
      const modal = document.getElementById('cancel-modal');
      const modalCloseBtn = document.getElementById('modal-close-btn');
      const modalConfirmBtn = document.getElementById('modal-confirm-btn');

      if (cancelBtn && modal) {
        cancelBtn.addEventListener('click', function () {
          // Show modal
          modal.classList.remove('hidden');
          setTimeout(() => {
            modal.classList.remove('opacity-0');
            modal.querySelector('div').classList.remove('scale-95');
            modal.querySelector('div').classList.add('scale-100');
          }, 10);
        });

        // Close Modal Function
        const closeModal = () => {
          modal.classList.add('opacity-0');
          modal.querySelector('div').classList.remove('scale-100');
          modal.querySelector('div').classList.add('scale-95');
          setTimeout(() => {
            modal.classList.add('hidden');
          }, 300);
        };

        if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);

        // Confirm Cancellation
        if (modalConfirmBtn) {
          modalConfirmBtn.addEventListener('click', function () {
            // Remove first booking
            bookings.shift();
            // Update user
            const updatedUser = { ...user, bookings: bookings };
            window.auth.updateCurrentUser({ bookings: bookings });

            closeModal();

            // Reload page to reflect changes
            setTimeout(() => {
              window.location.reload();
            }, 300);
          });
        }

        // Close on clicking outside
        modal.addEventListener('click', function (e) {
          if (e.target === modal) closeModal();
        });
      }
    }

    // Populate Booking History List
    const bookingListEl = document.getElementById('booking-list');
    const noBookingsEl = document.getElementById('no-bookings');
    if (bookingListEl) {
      bookingListEl.innerHTML = '';
      if (bookings.length > 0) {
        if (noBookingsEl) noBookingsEl.style.display = 'none';
        bookings.forEach(booking => {
          const item = document.createElement('div');
          item.className = 'flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100';

          // Fallback details
          let tName = booking.therapistName || 'Therapist';
          let tTime = booking.time || '';
          let tDate = booking.date || '';
          if (!tTime || !tDate) {
            const parts = (booking.datetime || '').split('•');
            tTime = parts[0] || '';
            tDate = parts[1] || new Date(booking.createdAt).toLocaleDateString();
          }

          item.innerHTML = `
                    <div class="flex items-center gap-4">
                        <div class="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center overflow-hidden shrink-0 border border-teal-200">
                             <img src="${booking.therapistAvatar || '../assets/doctor.png'}" class="w-full h-full object-cover">
                        </div>
                        <div>
                            <p class="font-bold text-gray-800 text-sm">${tName}</p>
                            <p class="text-xs text-gray-500">${booking.service || 'Session'}</p>
                        </div>
                    </div>
                    <div class="text-right">
                        <p class="text-xs font-bold text-gray-800">${tDate}</p>
                        <p class="text-xs text-gray-500">${tTime}</p>
                    </div>
                `;
          bookingListEl.appendChild(item);
        });
      } else {
        if (noBookingsEl) noBookingsEl.style.display = 'block';
      }
    }

    // Optionally show assessment summary
    const assessment = user.assessment;
    if (assessment) {
      // show a small toast or modify a section (left as enhancement)
      const overview = document.querySelector('.order-3');
      if (overview) {
        const note = document.createElement('div');
        note.className = 'text-sm text-gray-500 mt-2';
        note.textContent = 'Last check-in score: ' + (assessment.score || 0);
        overview.appendChild(note);
      }
    }
  });
})();
