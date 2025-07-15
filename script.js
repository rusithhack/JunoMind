// Global Variables
let currentTheme = 'light';
let currentUser = null;
let chatMessages = [];
let isTyping = false;
let currentMood = 2;
let timerMinutes = 25;
let timerSeconds = 0;
let timerActive = false;
let timerInterval = null;
let timerDuration = 25;
let soundPlaying = false;
let soundMuted = false;
let currentTrack = 0;
let ttsEnabled = true;
let isMuted = false;

// Daily content arrays
const DAILY_QUOTES = [
    "Every moment is a fresh beginning. 🌱",
    "You are stronger than you think. 💪",
    "Progress, not perfection. ✨",
    "Breathe in peace, breathe out stress. 🌸",
    "Your feelings are valid and temporary. 🤗",
    "Small steps lead to big changes. 🦋",
    "You deserve kindness, especially from yourself. 💝"
];

const DAILY_AFFIRMATIONS = [
    "I am worthy of love and happiness 💖",
    "Every breath I take fills me with calm and peace 🌸",
    "I choose to focus on what I can control 🎯",
    "My feelings are valid and temporary 🌊",
    "I am growing stronger with each challenge 💪",
    "Today I choose kindness towards myself 🤗",
    "I trust in my ability to navigate life's ups and downs 🦋",
    "I am exactly where I need to be right now ✨",
    "My mental health matters and I prioritize it 🧠",
    "I celebrate small victories and progress 🎉",
    "I am resilient and capable of healing 🌱",
    "Peace begins with me 🕊️"
];

const MOOD_LABELS = ["Very Sad", "Sad", "Neutral", "Happy", "Very Happy"];

const SOUND_TRACKS = [
    { name: "Focus Flow", description: "40Hz Gamma waves", frequency: "40Hz" },
    { name: "Calm Mind", description: "10Hz Alpha waves", frequency: "10Hz" },
    { name: "Deep Rest", description: "4Hz Theta waves", frequency: "4Hz" }
];

// AI Response Templates
const AI_RESPONSES = [
    "I hear you, and I want you to know that your feelings are completely valid. It takes courage to share what you're going through.",
    "Thank you for trusting me with your thoughts. What you're experiencing sounds really challenging, and I'm here to support you through this.",
    "It sounds like you're dealing with a lot right now. Remember that it's okay to feel overwhelmed sometimes - you're human, and these feelings are temporary.",
    "I can sense the weight of what you're carrying. You're not alone in this, and taking the time to talk about it shows real strength.",
    "Your awareness of your feelings is actually a positive step. Many people struggle to recognize and express what they're going through like you just did.",
    "What you're describing resonates with many people's experiences. You're not alone, and there are ways we can work through this together.",
    "I appreciate you sharing this with me. It sounds like you're being really thoughtful about your mental health, which is commendable.",
    "These feelings you're describing are more common than you might think. The fact that you're reaching out shows real self-awareness and courage."
];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadUserPreferences();
    setDailyContent();
});

function initializeApp() {
    // Set initial theme
    const savedTheme = localStorage.getItem('juno-theme') || 'light';
    setTheme(savedTheme);
    
    // Initialize mood
    const today = new Date().toDateString();
    const savedMood = localStorage.getItem(`juno-mood-${today}`);
    if (savedMood) {
        currentMood = parseInt(savedMood);
        updateMoodDisplay();
    }
    
    // Initialize timer
    updateTimerDisplay();
    
    // Initialize sound player
    updateSoundDisplay();
    
    // Check for saved user
    const savedUser = localStorage.getItem('juno-user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        updateAuthButton();
    }
}

function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            showPage(page);
        });
    });
    
    // Mobile menu toggle
    document.getElementById('mobileMenuToggle').addEventListener('click', () => {
        const navMenu = document.getElementById('navMenu');
        navMenu.classList.toggle('active');
    });
    
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Auth button
    document.getElementById('authBtn').addEventListener('click', () => {
        if (currentUser) {
            signOut();
        } else {
            showAuthModal();
        }
    });
    
    // Chat functionality
    document.getElementById('startChatBtn').addEventListener('click', startChat);
    document.getElementById('chatInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    document.getElementById('sendBtn').addEventListener('click', sendMessage);
    document.getElementById('voiceBtn').addEventListener('click', toggleVoiceInput);
    document.getElementById('ttsToggle').addEventListener('change', (e) => {
        ttsEnabled = e.target.checked;
        localStorage.setItem('juno-tts-enabled', ttsEnabled);
    });
    document.getElementById('muteBtn').addEventListener('click', toggleMute);
    
    // Mood tracker
    document.querySelectorAll('.mood-emoji').forEach((emoji, index) => {
        emoji.addEventListener('click', () => setMood(index));
    });
    document.getElementById('moodSlider').addEventListener('input', (e) => {
        setMood(parseInt(e.target.value));
    });
    
    // Timer functionality
    document.getElementById('timerSettingsBtn').addEventListener('click', showTimerSettings);
    document.getElementById('timerPlayBtn').addEventListener('click', toggleTimer);
    document.getElementById('timerResetBtn').addEventListener('click', resetTimer);
    
    // Sound player
    document.querySelectorAll('.sound-track').forEach((track, index) => {
        track.addEventListener('click', () => selectTrack(index));
    });
    document.getElementById('soundPlayBtn').addEventListener('click', toggleSound);
    document.getElementById('soundMuteBtn').addEventListener('click', toggleSoundMute);
    document.getElementById('volumeSlider').addEventListener('input', (e) => {
        // Volume control would be implemented here
    });
    
    // Modal functionality
    document.getElementById('modalClose').addEventListener('click', hideAuthModal);
    document.getElementById('timerModalClose').addEventListener('click', hideTimerModal);
    
    // Auth tabs
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            const tabName = e.target.getAttribute('data-tab');
            switchAuthTab(tabName);
        });
    });
    
    // Auth forms
    document.getElementById('signinForm').addEventListener('submit', handleSignIn);
    document.getElementById('signupForm').addEventListener('submit', handleSignUp);
    
    // Timer settings
    document.getElementById('saveTimerSettings').addEventListener('click', saveTimerSettings);
    document.getElementById('cancelTimerSettings').addEventListener('click', hideTimerModal);
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const minutes = parseInt(e.target.getAttribute('data-minutes'));
            document.getElementById('timerMinutes').value = minutes;
            document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
        });
    });
    
    // Contact form
    document.getElementById('contactForm').addEventListener('submit', handleContactForm);
    
    // Password toggles
    document.querySelectorAll('.password-toggle').forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            const input = e.target.closest('.input-with-icon').querySelector('input');
            const icon = e.target.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.className = 'fas fa-eye-slash';
            } else {
                input.type = 'password';
                icon.className = 'fas fa-eye';
            }
        });
    });
    
    // Close modals when clicking outside
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });
}

function loadUserPreferences() {
    // Load TTS preference
    const savedTTS = localStorage.getItem('juno-tts-enabled');
    if (savedTTS !== null) {
        ttsEnabled = savedTTS === 'true';
        document.getElementById('ttsToggle').checked = ttsEnabled;
    }
    
    // Load mute preference
    const savedMute = localStorage.getItem('juno-muted');
    if (savedMute !== null) {
        isMuted = savedMute === 'true';
        updateMuteButton();
    }
}

function setDailyContent() {
    const today = new Date().toDateString();
    
    // Set daily quote
    let savedQuote = localStorage.getItem(`juno-quote-${today}`);
    if (!savedQuote) {
        savedQuote = DAILY_QUOTES[Math.floor(Math.random() * DAILY_QUOTES.length)];
        localStorage.setItem(`juno-quote-${today}`, savedQuote);
    }
    document.getElementById('dailyQuoteText').textContent = savedQuote;
    
    // Set daily affirmation
    let savedAffirmation = localStorage.getItem(`juno-affirmation-${today}`);
    if (!savedAffirmation) {
        savedAffirmation = DAILY_AFFIRMATIONS[Math.floor(Math.random() * DAILY_AFFIRMATIONS.length)];
        localStorage.setItem(`juno-affirmation-${today}`, savedAffirmation);
    }
    document.getElementById('dailyAffirmation').textContent = savedAffirmation;
}

// Theme Management
function setTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    
    const themeIcon = document.querySelector('#themeToggle i');
    if (theme === 'dark') {
        themeIcon.className = 'fas fa-sun';
    } else {
        themeIcon.className = 'fas fa-moon';
    }
    
    localStorage.setItem('juno-theme', theme);
}

function toggleTheme() {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

// Page Navigation
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    document.getElementById(pageId + 'Page').classList.add('active');
    
    // Update navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-page="${pageId}"]`).classList.add('active');
    
    // Close mobile menu
    document.getElementById('navMenu').classList.remove('active');
}

// Authentication
function showAuthModal() {
    document.getElementById('authModal').classList.add('active');
}

function hideAuthModal() {
    document.getElementById('authModal').classList.remove('active');
}

function switchAuthTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Update tab content
    document.querySelectorAll('.auth-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(tabName + 'Tab').classList.add('active');
}

function handleSignIn(e) {
    e.preventDefault();
    const email = document.getElementById('signinEmail').value;
    const password = document.getElementById('signinPassword').value;
    
    // Simple validation (in a real app, this would be server-side)
    if (email && password.length >= 6) {
        currentUser = {
            id: Date.now().toString(),
            name: email.split('@')[0],
            email: email,
            createdAt: new Date()
        };
        
        localStorage.setItem('juno-user', JSON.stringify(currentUser));
        updateAuthButton();
        hideAuthModal();
        showNotification('Welcome back! 👋', 'success');
    } else {
        showNotification('Please check your credentials', 'error');
    }
}

function handleSignUp(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        return;
    }
    
    if (name && email && password.length >= 6) {
        currentUser = {
            id: Date.now().toString(),
            name: name,
            email: email,
            createdAt: new Date()
        };
        
        localStorage.setItem('juno-user', JSON.stringify(currentUser));
        updateAuthButton();
        hideAuthModal();
        showNotification('Account created successfully! 🎉', 'success');
    } else {
        showNotification('Please fill in all fields correctly', 'error');
    }
}

function signOut() {
    currentUser = null;
    localStorage.removeItem('juno-user');
    updateAuthButton();
    showNotification('Signed out successfully', 'success');
}

function updateAuthButton() {
    const authBtn = document.getElementById('authBtn');
    if (currentUser) {
        authBtn.innerHTML = `<i class="fas fa-sign-out-alt"></i> Sign Out`;
    } else {
        authBtn.innerHTML = `<i class="fas fa-user"></i> Sign In`;
    }
}

// Chat Functionality
function startChat() {
    document.getElementById('welcomeMessage').style.display = 'none';
    document.getElementById('chatMessages').style.display = 'block';
    document.getElementById('chatInput').disabled = false;
    document.getElementById('sendBtn').disabled = false;
    
    // Add initial AI message
    addMessage('assistant', "Hello! I'm Juno, and I'm here to listen and support you. How are you feeling today?");
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message || isTyping) return;
    
    // Add user message
    addMessage('user', message);
    input.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Simulate AI response
    setTimeout(() => {
        hideTypingIndicator();
        const response = generateAIResponse(message);
        addMessage('assistant', response);
        
        // Text-to-speech for AI response
        if (ttsEnabled && !isMuted) {
            speakText(response);
        }
    }, 1500 + Math.random() * 1000);
}

function addMessage(role, content) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${role}`;
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.textContent = content;
    
    messageDiv.appendChild(messageContent);
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Store message
    chatMessages.push({ role, content, timestamp: new Date() });
}

function showTypingIndicator() {
    isTyping = true;
    const messagesContainer = document.getElementById('chatMessages');
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message assistant';
    typingDiv.id = 'typingIndicator';
    
    typingDiv.innerHTML = `
        <div class="typing-indicator">
            <div class="typing-avatar">
                <i class="fas fa-heart"></i>
            </div>
            <div class="typing-dots">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
            <span class="typing-text">Juno is thinking...</span>
        </div>
    `;
    
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function hideTypingIndicator() {
    isTyping = false;
    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function generateAIResponse(userMessage) {
    // Simple keyword-based responses (in a real app, this would use actual AI)
    const message = userMessage.toLowerCase();
    
    if (message.includes('sad') || message.includes('depressed') || message.includes('down')) {
        return "I can hear that you're going through a difficult time. Sadness is a natural human emotion, and it's okay to feel this way. Would you like to talk about what's contributing to these feelings?";
    } else if (message.includes('anxious') || message.includes('worried') || message.includes('stress')) {
        return "Anxiety can feel overwhelming, but you're not alone in this. Let's take a moment to breathe together. Can you tell me what's been causing you the most stress lately?";
    } else if (message.includes('happy') || message.includes('good') || message.includes('great')) {
        return "I'm so glad to hear you're feeling positive! It's wonderful when we can recognize and appreciate the good moments. What's been bringing you joy recently?";
    } else if (message.includes('tired') || message.includes('exhausted') || message.includes('sleep')) {
        return "Feeling tired can really impact our emotional wellbeing. Rest is so important for our mental health. Have you been able to get enough quality sleep lately?";
    } else if (message.includes('help') || message.includes('support')) {
        return "I'm here to support you in whatever way I can. Sometimes just talking through our thoughts and feelings can be really helpful. What kind of support would feel most useful to you right now?";
    } else {
        // Return a random empathetic response
        return AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
    }
}

// Voice Input
function toggleVoiceInput() {
    const voiceBtn = document.getElementById('voiceBtn');
    
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        showNotification('Speech recognition not supported in this browser', 'error');
        return;
    }
    
    if (voiceBtn.classList.contains('listening')) {
        // Stop listening
        if (window.currentRecognition) {
            window.currentRecognition.stop();
        }
        voiceBtn.classList.remove('listening');
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
    } else {
        // Start listening
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onstart = () => {
            voiceBtn.classList.add('listening');
            voiceBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>';
        };
        
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            document.getElementById('chatInput').value = transcript;
        };
        
        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            showNotification('Speech recognition error. Please try again.', 'error');
        };
        
        recognition.onend = () => {
            voiceBtn.classList.remove('listening');
            voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
            window.currentRecognition = null;
        };
        
        window.currentRecognition = recognition;
        recognition.start();
    }
}

// Text-to-Speech
function speakText(text) {
    if (!ttsEnabled || isMuted) return;
    
    // Cancel any ongoing speech
    speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 0.8;
    
    // Try to use a better voice
    const voices = speechSynthesis.getVoices();
    const preferredVoice = voices.find(voice => 
        voice.name.includes('Google') || 
        voice.name.includes('Microsoft') || 
        voice.name.includes('Samantha')
    );
    
    if (preferredVoice) {
        utterance.voice = preferredVoice;
    }
    
    speechSynthesis.speak(utterance);
}

function toggleMute() {
    isMuted = !isMuted;
    localStorage.setItem('juno-muted', isMuted);
    updateMuteButton();
    
    if (isMuted) {
        speechSynthesis.cancel();
    }
}

function updateMuteButton() {
    const muteBtn = document.getElementById('muteBtn');
    if (isMuted) {
        muteBtn.classList.add('muted');
        muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
        muteBtn.title = 'Unmute Juno';
    } else {
        muteBtn.classList.remove('muted');
        muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
        muteBtn.title = 'Mute Juno';
    }
}

// Mood Tracking
function setMood(moodIndex) {
    currentMood = moodIndex;
    
    // Update visual indicators
    updateMoodDisplay();
    
    // Save mood for today
    const today = new Date().toDateString();
    localStorage.setItem(`juno-mood-${today}`, currentMood);
}

function updateMoodDisplay() {
    // Update emoji selection
    document.querySelectorAll('.mood-emoji').forEach((emoji, index) => {
        emoji.classList.toggle('selected', index === currentMood);
    });
    
    // Update slider
    document.getElementById('moodSlider').value = currentMood;
    
    // Update label
    document.getElementById('moodLabel').textContent = MOOD_LABELS[currentMood];
}

// Timer Functionality
function showTimerSettings() {
    document.getElementById('timerModal').classList.add('active');
    document.getElementById('timerMinutes').value = timerDuration;
    
    // Update preset button selection
    document.querySelectorAll('.preset-btn').forEach(btn => {
        const minutes = parseInt(btn.getAttribute('data-minutes'));
        btn.classList.toggle('active', minutes === timerDuration);
    });
}

function hideTimerModal() {
    document.getElementById('timerModal').classList.remove('active');
}

function saveTimerSettings() {
    const newDuration = parseInt(document.getElementById('timerMinutes').value);
    if (newDuration >= 1 && newDuration <= 120) {
        timerDuration = newDuration;
        if (!timerActive) {
            timerMinutes = timerDuration;
            timerSeconds = 0;
            updateTimerDisplay();
        }
        hideTimerModal();
        showNotification('Timer settings saved!', 'success');
    } else {
        showNotification('Please enter a valid duration (1-120 minutes)', 'error');
    }
}

function toggleTimer() {
    if (timerActive) {
        pauseTimer();
    } else {
        startTimer();
    }
}

function startTimer() {
    if (timerMinutes === 0 && timerSeconds === 0) {
        timerMinutes = timerDuration;
        timerSeconds = 0;
    }
    
    timerActive = true;
    updateTimerButtons();
    
    timerInterval = setInterval(() => {
        if (timerSeconds > 0) {
            timerSeconds--;
        } else if (timerMinutes > 0) {
            timerMinutes--;
            timerSeconds = 59;
        } else {
            // Timer completed
            timerActive = false;
            clearInterval(timerInterval);
            updateTimerButtons();
            showNotification('Focus session complete! 🎉', 'success');
            
            // Request notification permission and show notification
            if ('Notification' in window && Notification.permission === 'granted') {
                new Notification('Juno Timer', {
                    body: 'Your focus session is complete! 🎉',
                    icon: '/favicon.ico'
                });
            }
        }
        updateTimerDisplay();
    }, 1000);
    
    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

function pauseTimer() {
    timerActive = false;
    clearInterval(timerInterval);
    updateTimerButtons();
}

function resetTimer() {
    timerActive = false;
    clearInterval(timerInterval);
    timerMinutes = timerDuration;
    timerSeconds = 0;
    updateTimerDisplay();
    updateTimerButtons();
}

function updateTimerDisplay() {
    const timeString = `${timerMinutes.toString().padStart(2, '0')}:${timerSeconds.toString().padStart(2, '0')}`;
    const timerTimeElement = document.getElementById('timerTime');
    timerTimeElement.textContent = timeString;
    
    // Update visual state
    timerTimeElement.classList.toggle('active', timerActive);
    
    // Update status
    const statusElement = document.getElementById('timerStatus');
    if (timerActive) {
        statusElement.innerHTML = '<div class="status-dot"></div>Focus session in progress';
        statusElement.classList.add('active');
    } else {
        statusElement.textContent = `${timerDuration} minute session ready`;
        statusElement.classList.remove('active');
    }
}

function updateTimerButtons() {
    const playBtn = document.getElementById('timerPlayBtn');
    
    if (timerActive) {
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        playBtn.classList.add('active');
    } else {
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        playBtn.classList.remove('active');
    }
}

// Sound Player
function selectTrack(trackIndex) {
    currentTrack = trackIndex;
    
    // Update track selection
    document.querySelectorAll('.sound-track').forEach((track, index) => {
        track.classList.toggle('active', index === currentTrack);
    });
    
    updateSoundDisplay();
}

function toggleSound() {
    soundPlaying = !soundPlaying;
    updateSoundButtons();
    updateSoundDisplay();
    
    // In a real implementation, this would control actual audio playback
    if (soundPlaying) {
        showNotification(`Playing: ${SOUND_TRACKS[currentTrack].name}`, 'success');
    }
}

function toggleSoundMute() {
    soundMuted = !soundMuted;
    updateSoundButtons();
    updateSoundDisplay();
}

function updateSoundButtons() {
    const playBtn = document.getElementById('soundPlayBtn');
    const muteBtn = document.getElementById('soundMuteBtn');
    
    // Update play button
    if (soundPlaying) {
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        playBtn.classList.add('active');
    } else {
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        playBtn.classList.remove('active');
    }
    
    // Update mute button
    if (soundMuted) {
        muteBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else {
        muteBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
}

function updateSoundDisplay() {
    const track = SOUND_TRACKS[currentTrack];
    document.querySelector('.track-info').textContent = track.name;
    document.querySelector('.track-status').textContent = `${track.frequency} • ${soundPlaying ? 'Playing' : 'Paused'}`;
}

// Contact Form
function handleContactForm(e) {
    e.preventDefault();
    
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const subject = document.getElementById('contactSubject').value;
    const message = document.getElementById('contactMessage').value;
    
    if (name && email && subject && message) {
        // In a real app, this would send the message to a server
        showNotification('Thank you for your message! We\'ll get back to you soon. 💜', 'success');
        
        // Reset form
        document.getElementById('contactForm').reset();
    } else {
        showNotification('Please fill in all fields', 'error');
    }
}

// Notification System
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
        z-index: 9999;
        max-width: 300px;
        animation: slideIn 0.3s ease-out;
        font-weight: 500;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Remove notification after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

// Add CSS for notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
