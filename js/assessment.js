// js/assessment.js
// Page: pages/assessment.html
// Question flow and progress logic
(function(){
    document.addEventListener('DOMContentLoaded', function(){
        const questions = [
            "Over the last 2 weeks, how often have you felt little interest or pleasure in doing things?",
            "How often have you been feeling down, depressed, or hopeless?",
            "Trouble falling or staying asleep, or sleeping too much?",
            "Feeling tired or having little energy?",
            "How would you rate your overall stress level today?"
        ];

        const options = ["Not at all", "Several Days", "More than half"];

        let currentQuestionIndex = 0;

        const questionText = document.getElementById('question-text');
        const optionsContainer = document.getElementById('options-container');
        const questionCount = document.getElementById('question-count');
        const progressBarFill = document.getElementById('progress-bar-fill');
        const progressText = document.getElementById('progress-text');

        function loadQuestion(){
            if (!questionText || !optionsContainer) return;
            questionText.innerText = questions[currentQuestionIndex];
            optionsContainer.innerHTML = '';

            options.forEach(option => {
                const btn = document.createElement('button');
                btn.className = "py-4 md:py-5 bg-white border-2 border-transparent hover:border-teal-500 rounded-2xl text-gray-700 font-bold transition shadow-sm text-base md:text-lg hover:shadow-md active:bg-teal-50";
                btn.innerText = option;
                btn.type = 'button';
                btn.addEventListener('click', () => handleAnswer(option, btn));
                optionsContainer.appendChild(btn);
            });

            updateProgress();
        }

        const answers = [];
        function handleAnswer(selectedOption, btnElement){
            answers.push(selectedOption);
            btnElement.classList.remove('bg-white', 'text-gray-700', 'border-transparent');
            btnElement.classList.add('bg-teal-600', 'text-white', 'border-teal-600', 'scale-105');

            setTimeout(() => {
                currentQuestionIndex++;
                if (currentQuestionIndex < questions.length) {
                    loadQuestion();
                } else {
                    // save answers to current user if auth is available
                    if(window.auth){
                        try{ window.auth.saveAssessment(answers); } catch(e){/* ignore */}
                    }
                    window.location.href = 'dashboard.html';
                }
            }, 300);
        }

        function updateProgress(){
            if (!progressBarFill) return;
            questionCount.innerText = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
            const widthPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
            progressBarFill.style.width = `${widthPercentage}%`;
            progressText.innerText = `${Math.round(widthPercentage)}%`;
        }

        if(window.auth) window.auth.requireAuth('login.html');
        loadQuestion();
    });
})();
