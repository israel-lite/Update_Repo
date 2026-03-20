/**
 * Message Handler - Manages AI communication and user interactions
 */
class MessageHandler {
    constructor() {
        this.apiEndpoint = '/api';
        this.userId = this.getUserId();
    }

    getUserId() {
        // Try to get user ID from localStorage or generate one
        let userId = localStorage.getItem('eazee_user_id');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('eazee_user_id', userId);
        }
        return userId;
    }

    async getAIResponse(message) {
        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    user_id: this.userId
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.response || 'I apologize, but I could not process your request at the moment.';
        } catch (error) {
            console.error('Error getting AI response:', error);
            throw error;
        }
    }

    formatMessage(content, role, timestamp) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = content;
        
        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        messageTime.textContent = this.formatTime(timestamp);
        
        messageDiv.appendChild(messageContent);
        messageDiv.appendChild(messageTime);
        
        return messageDiv;
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    validateMessage(content) {
        if (!content || content.trim().length === 0) {
            return false;
        }
        if (content.trim().length > 10000) {
            return false;
        }
        return true;
    }

    extractKeywords(content) {
        // Simple keyword extraction for potential future features
        const words = content.toLowerCase().split(/\s+/);
        const keywords = words.filter(word => word.length > 3);
        return keywords.slice(0, 5);
    }

    detectMessageType(content) {
        const lowerContent = content.toLowerCase();
        
        if (lowerContent.includes('?')) return 'question';
        if (lowerContent.includes('help')) return 'help';
        if (lowerContent.includes('explain') || lowerContent.includes('what is')) return 'explanation';
        if (lowerContent.includes('how to')) return 'tutorial';
        if (lowerContent.includes('code') || lowerContent.includes('programming')) return 'technical';
        
        return 'general';
    }
}

// Voice input handler
class VoiceInputHandler {
    constructor(onResult) {
        this.onResult = onResult;
        this.recognition = null;
        this.isRecording = false;
        this.initializeVoiceRecognition();
    }

    initializeVoiceRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';
            
            this.recognition.onstart = () => {
                this.isRecording = true;
                this.updateRecordingUI(true);
            };
            
            this.recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                this.onResult(transcript);
            };
            
            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.isRecording = false;
                this.updateRecordingUI(false);
            };
            
            this.recognition.onend = () => {
                this.isRecording = false;
                this.updateRecordingUI(false);
            };
        }
    }

    startRecording() {
        if (this.recognition && !this.isRecording) {
            this.recognition.start();
        }
    }

    stopRecording() {
        if (this.recognition && this.isRecording) {
            this.recognition.stop();
        }
    }

    updateRecordingUI(isRecording) {
        const micButton = document.getElementById('micButton');
        if (micButton) {
            if (isRecording) {
                micButton.classList.add('recording');
                micButton.innerHTML = '🔴';
            } else {
                micButton.classList.remove('recording');
                micButton.innerHTML = '🎤';
            }
        }
    }

    isSupported() {
        return this.recognition !== null;
    }
}

// Export for use in other modules
window.MessageHandler = MessageHandler;
window.VoiceInputHandler = VoiceInputHandler;
