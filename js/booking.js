// js/booking.js
// Page: pages/booking.html
// Calendar interactions and slot selection
(function () {
    document.addEventListener('DOMContentLoaded', function () {
        const nameEl = document.getElementById('booking-therapist-name');
        const imgEl = document.getElementById('booking-therapist-img');
        const proceedBtn = document.querySelector('a[href="checkout.html"]');
        const dateDisplayEl = document.getElementById('selected-date-display');

        let selectedDate = null;
        let selectedTime = null;

        // 1. Load selected therapist
        const stored = sessionStorage.getItem('mw_selected_therapist');
        let therapist = {};
        if (stored) {
            therapist = JSON.parse(stored);
            if (nameEl) nameEl.textContent = therapist.name;
            if (imgEl) imgEl.src = therapist.img;
        }

        // 2. Dynamic Functional Calendar
        // dateDisplayEl is already declared above
        const gridEl = document.getElementById('calendar-grid');
        const monthDisplayEl = document.getElementById('current-month-display');
        const prevBtn = document.getElementById('prev-month');
        const nextBtn = document.getElementById('next-month');

        let currentDate = new Date();
        let currentMonth = currentDate.getMonth();
        let currentYear = currentDate.getFullYear();
        let selectedDateObj = null;

        function renderCalendar(month, year) {
            if (!gridEl) return;
            gridEl.innerHTML = '';

            // Update Header
            const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            if (monthDisplayEl) monthDisplayEl.textContent = `${monthNames[month]} ${year}`;

            // Add Days Header
            const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
            days.forEach((day, index) => {
                const header = document.createElement('div');
                header.className = "text-gray-400 font-bold uppercase text-[10px] md:text-xs tracking-widest";
                if (index === 6) header.classList.add('text-red-300'); // Sunday red
                header.textContent = day;
                gridEl.appendChild(header);
            });

            // Get first day of month (0-6, Mon-Sun)
            const firstDay = new Date(year, month, 1).getDay(); // 0 is Sun, 1 is Mon
            // Adjust so 0 is Mon, 6 is Sun
            const startDay = firstDay === 0 ? 6 : firstDay - 1;

            // Days in month
            const daysInMonth = new Date(year, month + 1, 0).getDate();

            // Previous month fill
            const prevMonthDays = new Date(year, month, 0).getDate();
            for (let i = startDay - 1; i >= 0; i--) {
                const dayDiv = document.createElement('div');
                dayDiv.className = "text-gray-300 py-2 md:py-3";
                dayDiv.textContent = prevMonthDays - i;
                gridEl.appendChild(dayDiv);
            }

            // Current Days
            const today = new Date(); // To check "today"

            for (let i = 1; i <= daysInMonth; i++) {
                const dayWrapper = document.createElement('div');
                const dayBtn = document.createElement('span');
                dayBtn.className = "date-slot w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-xl hover:bg-teal-50 hover:text-teal-700 cursor-pointer transition font-medium mx-auto select-none";
                dayBtn.textContent = i;

                // Construct date for this cell
                const cellDate = new Date(year, month, i);

                // Disable past dates
                today.setHours(0, 0, 0, 0);
                if (cellDate < today) {
                    dayBtn.classList.add('text-gray-300', 'cursor-not-allowed', 'hover:bg-transparent', 'hover:text-gray-300');
                    dayBtn.style.pointerEvents = 'none';
                } else if (selectedDateObj && cellDate.getTime() === selectedDateObj.getTime()) {
                    // Active State
                    dayBtn.classList.add('bg-teal-600', 'text-white', 'scale-110', 'shadow-lg');
                    dayBtn.classList.remove('hover:bg-teal-50', 'hover:text-teal-700');
                } else {
                    // Normal State
                }

                dayBtn.addEventListener('click', function () {
                    // Update Selected
                    selectedDateObj = cellDate;

                    // Format for storage/display: "Oct 24"
                    const options = { month: 'short', day: 'numeric' };
                    selectedDate = cellDate.toLocaleDateString('en-US', options);

                    if (dateDisplayEl) dateDisplayEl.textContent = selectedDate;

                    // Re-render to show selection
                    renderCalendar(currentMonth, currentYear);

                    // Reset time selection
                    selectedTime = null;
                    resetTimeSlots();
                });

                dayWrapper.appendChild(dayBtn);
                gridEl.appendChild(dayWrapper);
            }
        }

        // Navigation
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentMonth--;
                if (currentMonth < 0) {
                    currentMonth = 11;
                    currentYear--;
                }
                renderCalendar(currentMonth, currentYear);
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentMonth++;
                if (currentMonth > 11) {
                    currentMonth = 0;
                    currentYear++;
                }
                renderCalendar(currentMonth, currentYear);
            });
        }

        // Init
        renderCalendar(currentMonth, currentYear);

        // 3. Interactive Time Slots & Mock Availability
        const timeSlots = document.querySelectorAll('.time-slot');

        // Mock "booked" slots - randomly disable a few or hardcode
        // Let's hardcode some for demonstration: 11:00 AM and 04:00 PM are booked
        const bookedTimes = ["11:00 AM", "04:00 PM"];

        function resetTimeSlots() {
            timeSlots.forEach(btn => {
                const timeText = btn.textContent.trim();

                // Check if booked
                if (bookedTimes.includes(timeText)) {
                    btn.disabled = true;
                    btn.classList.add('opacity-50', 'cursor-not-allowed', 'line-through', 'bg-gray-100', 'text-gray-400');
                    btn.classList.remove('bg-white', 'hover:border-teal-500', 'hover:bg-teal-50', 'hover:text-teal-600');
                    return;
                }

                // Reset normal state
                btn.disabled = false;
                btn.classList.remove('bg-teal-600', 'text-white', 'shadow-md', 'ring-2', 'ring-teal-100', 'opacity-50', 'cursor-not-allowed', 'line-through', 'bg-gray-100', 'text-gray-400');
                btn.classList.add('bg-white', 'border-gray-200', 'hover:border-teal-500', 'hover:bg-teal-50', 'hover:text-teal-600');
            });
        }

        // Init mock booked slots
        resetTimeSlots();

        timeSlots.forEach(btn => {
            btn.addEventListener('click', function () {
                if (this.disabled) return;

                // Reset selection
                timeSlots.forEach(b => {
                    if (!bookedTimes.includes(b.textContent.trim())) {
                        b.classList.remove('bg-teal-600', 'text-white', 'shadow-md', 'ring-2', 'ring-teal-100');
                        b.classList.add('bg-white', 'border-gray-200');
                    }
                });

                // Apply active style
                this.classList.remove('bg-white', 'border-gray-200');
                this.classList.add('bg-teal-600', 'text-white', 'shadow-md', 'ring-2', 'ring-teal-100');

                selectedTime = this.textContent.trim();
            });
        });


        // 4. Save and Proceed
        if (proceedBtn) {
            proceedBtn.addEventListener('click', function (e) {
                e.preventDefault();

                if (!selectedDate || !selectedTime) {
                    alert("Please select both a Date and a Time slot.");
                    return;
                }

                const bookingPreview = {
                    therapistName: therapist.name || 'Therapist',
                    therapistTitle: therapist.title || 'Specialist',
                    therapistAvatar: therapist.img || '',
                    date: selectedDate,
                    time: selectedTime,
                    price: therapist.price || 'Rs. 2000'
                };
                sessionStorage.setItem('mw_booking_preview', JSON.stringify(bookingPreview));

                window.location.href = 'checkout.html';
            });
        }

    });
})();
