/**
 * UI Renderer - Handles all DOM manipulation and rendering
 */
class UIRenderer {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.chatList = document.getElementById('chatList');
        this.chatTitle = document.getElementById('chatTitle');
        this.welcomeMessage = document.getElementById('welcomeMessage');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.micButton = document.getElementById('micButton');
        this.newChatButton = document.getElementById('newChatButton');
        this.saveChatButton = document.getElementById('saveChatButton');
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // New chat button
        if (this.newChatButton) {
            this.newChatButton.addEventListener('click', () => {
                window.chatManager.createNewChat();
            });
        }

        // Save chat button
        if (this.saveChatButton) {
            this.saveChatButton.addEventListener('click', () => {
                window.chatManager.saveCurrentChat();
            });
        }

        // Message input
        if (this.messageInput) {
            this.messageInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
        }

        // Send button
        if (this.sendButton) {
            this.sendButton.addEventListener('click', () => {
                this.sendMessage();
            });
        }
    }

    renderChatList(chats) {
        if (!this.chatList) return;

        this.chatList.innerHTML = '';

        if (chats.length === 0) {
            this.renderEmptyState();
            return;
        }

        chats.forEach(chat => {
            const chatElement = this.createChatElement(chat);
            this.chatList.appendChild(chatElement);
        });
    }

    renderEmptyState() {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = `
            <div class="empty-state-icon">💬</div>
            <div class="empty-state-text">No chats yet</div>
            <div class="empty-state-subtext">Start a new conversation</div>
        `;
        this.chatList.appendChild(emptyState);
    }

    createChatElement(chat) {
        const chatDiv = document.createElement('div');
        chatDiv.className = 'chat-item';
        chatDiv.dataset.chatId = chat.id;
        
        const chatTitle = document.createElement('div');
        chatTitle.className = 'chat-title';
        chatTitle.textContent = chat.title;
        
        const chatMeta = document.createElement('div');
        chatMeta.className = 'chat-meta';
        
        const messageCount = document.createElement('span');
        messageCount.className = 'message-count';
        messageCount.textContent = `${chat.messages.length} messages`;
        
        const chatTime = document.createElement('span');
        chatTime.className = 'chat-time';
        chatTime.textContent = this.formatChatTime(chat.updatedAt);
        
        chatMeta.appendChild(messageCount);
        chatMeta.appendChild(chatTime);
        
        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-chat';
        deleteButton.innerHTML = '🗑️';
        deleteButton.addEventListener('click', (e) => {
            e.stopPropagation();
            window.chatManager.deleteChat(chat.id);
        });
        
        chatDiv.appendChild(chatTitle);
        chatDiv.appendChild(chatMeta);
        chatDiv.appendChild(deleteButton);
        
        chatDiv.addEventListener('click', () => {
            window.chatManager.openChat(chat.id);
        });
        
        return chatDiv;
    }

    renderMessages(messages) {
        if (!this.chatMessages) return;

        this.chatMessages.innerHTML = '';

        if (messages.length === 0) {
            this.showWelcomeMessage();
            return;
        }

        this.hideWelcomeMessage();
        
        messages.forEach(message => {
            const messageElement = this.createMessageElement(message);
            this.chatMessages.appendChild(messageElement);
        });

        this.scrollToBottom();
    }

    createMessageElement(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.role}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = message.content;
        
        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        messageTime.textContent = this.formatMessageTime(message.timestamp);
        
        messageDiv.appendChild(messageContent);
        messageDiv.appendChild(messageTime);
        
        return messageDiv;
    }

    setActiveChat(chatId) {
        // Remove active class from all chat items
        const chatItems = this.chatList.querySelectorAll('.chat-item');
        chatItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.chatId === chatId) {
                item.classList.add('active');
            }
        });
    }

    updateChatTitle(title) {
        if (this.chatTitle) {
            this.chatTitle.textContent = title;
        }
    }

    showWelcomeMessage() {
        if (this.welcomeMessage) {
            this.welcomeMessage.style.display = 'block';
        }
    }

    hideWelcomeMessage() {
        if (this.welcomeMessage) {
            this.welcomeMessage.style.display = 'none';
        }
    }

    showTypingIndicator() {
        if (this.typingIndicator) {
            this.typingIndicator.style.display = 'block';
            this.scrollToBottom();
        }
    }

    hideTypingIndicator() {
        if (this.typingIndicator) {
            this.typingIndicator.style.display = 'none';
        }
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Hide and remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    sendMessage() {
        const content = this.messageInput.value.trim();
        if (!content) return;

        if (!window.messageHandler.validateMessage(content)) {
            this.showNotification('Please enter a valid message');
            return;
        }

        window.chatManager.sendMessage(content);
        this.messageInput.value = '';
    }

    scrollToBottom() {
        if (this.chatMessages) {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }
    }

    formatChatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return date.toLocaleDateString([], { weekday: 'short' });
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    }

    formatMessageTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    getInputValue() {
        return this.messageInput ? this.messageInput.value : '';
    }

    setInputValue(value) {
        if (this.messageInput) {
            this.messageInput.value = value;
        }
    }

    clearInput() {
        this.setInputValue('');
    }

    focusInput() {
        if (this.messageInput) {
            this.messageInput.focus();
        }
    }

    setVoiceInputHandler(voiceHandler) {
        if (this.micButton && voiceHandler.isSupported()) {
            this.micButton.addEventListener('click', () => {
                if (voiceHandler.isRecording) {
                    voiceHandler.stopRecording();
                } else {
                    voiceHandler.startRecording();
                }
            });
            this.micButton.style.display = 'block';
        } else if (this.micButton) {
            this.micButton.style.display = 'none';
        }
    }
}

// Export for use in other modules
window.UIRenderer = UIRenderer;
