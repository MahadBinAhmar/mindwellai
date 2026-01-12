// js/chat.js
// MindWell Local AI Therapist Logic
// Zero Dependency, Works Offline, Instant Response

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const chatContainer = document.getElementById('chat-container');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('chat-send-btn');

    // Auto-focus input
    chatInput.focus();

    // --- Local Therapist Knowledge Base ---
    const knowledgeBase = [
        {
            patterns: [/hello/i, /hi/i, /hey/i, /start/i, /greetings/i],
            responses: [
                "Hello! I am MindWell, your AI counselor. How are you feeling today?",
                "Hi there. I'm here to listen. What's on your mind?",
                "Welcome. This is a safe space. How can I support you right now?"
            ]
        },
        {
            patterns: [/sad/i, /depress/i, /unhappy/i, /cry/i, /low/i],
            responses: [
                "I'm sorry to hear that you're feeling down. It takes courage to open up. Do you want to talk about what's making you feel this way?",
                "It sounds like you're going through a tough time. Remember, it's okay not to be okay. I'm here for you.",
                "Sadness is a heavy emotion. Have you been feeling this way for a long time, or did something specific happen?"
            ]
        },
        {
            patterns: [/anxi/i, /nervous/i, /panic/i, /scared/i, /worried/i, /worry/i],
            responses: [
                "Anxiety can be very overwhelming. Let's try a quick grounding exercise: Name 5 things you can see around you right now.",
                "I hear you. When we feel anxious, our mind often races. Take a deep breath with me... Inhale... Exhale... How does that feel?",
                "It's understandable to feel worried. Let's break down what's causing this anxiety. Is it something specific?"
            ]
        },
        {
            patterns: [/sleep/i, /insomnia/i, /tired/i, /exhausted/i, /awake/i],
            responses: [
                "Sleep is so important for our mental health. Have you tried establishing a calming bedtime routine, like reading or warm tea?",
                "Racing thoughts often keep us up. Writing them down in a journal before bed might help clear your mind.",
                "If you're feeling constantly tired, it might be a sign of emotional burnout. Are you taking breaks during your day?"
            ]
        },
        {
            patterns: [/stress/i, /pressure/i, /work/i, /school/i, /busy/i, /overwhelm/i],
            responses: [
                "Stress is a signal that you need to recharge. What is one small thing you can remove from your to-do list today?",
                "You're carrying a heavy load. Remember, you don't have to solve everything at once. One step at a time.",
                "Burnout is real. Have you taken any time for yourself today, even just 5 minutes?"
            ]
        },
        {
            patterns: [/thank/i, /thanks/i, /appreciate/i, /help/i],
            responses: [
                "You're very welcome. I'm glad I could help.",
                "I'm here for you anytime. Take care of yourself.",
                "It's my privilege to listen. Be gentle with yourself today."
            ]
        },
        {
            patterns: [/bye/i, /goodbye/i, /leave/i, /stop/i],
            responses: [
                "Take care. Remember, you are important.",
                "Goodbye for now. I'll be here whenever you need to talk again.",
                "Wishing you peace. See you soon."
            ]
        }
    ];

    const defaultResponses = [
        "I hear you. Tell me more about that.",
        "It sounds like this is important to you. How does that make you feel?",
        "I'm listening. Please go on.",
        "Thank you for sharing that with me. What do you think would help right now?",
        "I understand. Emotions can be complex. I'm here to support you."
    ];

    // --- Chat Functionality ---

    const processMessage = (text) => {
        // 1. Simulate "Thinking" delay
        const typingId = showTypingIndicator();

        setTimeout(() => {
            removeTypingIndicator(typingId);

            // 2. Find Match
            let response = "";
            for (const category of knowledgeBase) {
                if (category.patterns.some(pattern => pattern.test(text))) {
                    response = category.responses[Math.floor(Math.random() * category.responses.length)];
                    break;
                }
            }

            // 3. Fallback
            if (!response) {
                response = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
            }

            appendMessage('ai', response);

        }, 1500); // 1.5s delay for realism
    };

    const sendMessage = () => {
        const text = chatInput.value.trim();
        if (!text) return;

        appendMessage('user', text);
        chatInput.value = '';

        processMessage(text);
    };

    sendBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') sendMessage();
    });

    // --- Helper Functions ---

    function appendMessage(sender, text) {
        const isUser = sender === 'user';
        const msgDiv = document.createElement('div');
        msgDiv.className = isUser ? 'flex items-start gap-3 md:gap-4 flex-row-reverse' : 'flex items-start gap-3 md:gap-4';

        const avatar = isUser
            ? `<div class="w-8 h-8 md:w-10 md:h-10 bg-teal-700 rounded-full flex items-center justify-center text-white font-bold text-[10px] md:text-xs flex-shrink-0">ME</div>`
            : `<div class="w-8 h-8 md:w-10 md:h-10 bg-white border border-gray-200 rounded-full p-1.5 md:p-2 flex items-center justify-center overflow-hidden flex-shrink-0"><img src="../assets/logo.png" class="w-full h-full object-contain"></div>`;

        const content = isUser
            ? `<div class="bg-teal-600 text-white p-4 md:p-5 rounded-2xl rounded-tr-none shadow-md text-sm md:text-base max-w-[85%] md:max-w-2xl leading-relaxed">${text}</div>`
            : `<div class="bg-white p-4 md:p-5 rounded-2xl rounded-tl-none shadow-sm text-gray-700 leading-relaxed max-w-[85%] md:max-w-2xl border border-gray-100 text-sm md:text-base">${text}</div>`;

        msgDiv.innerHTML = avatar + content;
        chatContainer.appendChild(msgDiv);
        scrollToBottom();
    }

    function showTypingIndicator() {
        const id = 'typing-' + Date.now();
        const msgDiv = document.createElement('div');
        msgDiv.id = id;
        msgDiv.className = 'flex items-start gap-3 md:gap-4';
        msgDiv.innerHTML = `
            <div class="w-8 h-8 md:w-10 md:h-10 bg-white border border-gray-200 rounded-full p-1.5 md:p-2 flex items-center justify-center overflow-hidden flex-shrink-0">
                <img src="../assets/logo.png" class="w-full h-full object-contain">
            </div>
            <div class="bg-white p-4 md:p-5 rounded-2xl rounded-tl-none shadow-sm text-gray-500 leading-relaxed max-w-[85%] md:max-w-2xl border border-gray-100 text-sm md:text-base italic">
                <span class="animate-pulse">MindWell is typing...</span>
            </div>
        `;
        chatContainer.appendChild(msgDiv);
        scrollToBottom();
        return id;
    }

    function removeTypingIndicator(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    function scrollToBottom() {
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
});
