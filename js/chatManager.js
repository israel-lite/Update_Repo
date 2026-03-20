/**
 * Chat Manager - Core chat logic and state management
 */
class ChatManager {
    constructor(storage, messageHandler, uiRenderer) {
        this.storage = storage;
        this.messageHandler = messageHandler;
        this.uiRenderer = uiRenderer;
        this.currentChat = null;
        this.chats = [];
    }

    async initialize() {
        await this.loadChats();
        await this.initializeChat();
    }

    async loadChats() {
        this.chats = this.storage.getChats();
        this.uiRenderer.renderChatList(this.chats);
    }

    async initializeChat() {
        const activeChatId = this.storage.getActiveChatId();
        
        if (activeChatId && this.chats.find(chat => chat.id === activeChatId)) {
            await this.openChat(activeChatId);
        } else if (this.chats.length > 0) {
            await this.openChat(this.chats[0].id);
        } else {
            await this.createNewChat();
        }
    }

    async createNewChat() {
        const newChat = this.storage.createChat();
        this.chats.unshift(newChat);
        this.uiRenderer.renderChatList(this.chats);
        await this.openChat(newChat.id);
        return newChat;
    }

    async openChat(chatId) {
        const chat = this.chats.find(c => c.id === chatId);
        if (!chat) return null;

        this.currentChat = chat;
        this.storage.setActiveChatId(chatId);
        
        // Update UI
        this.uiRenderer.setActiveChat(chatId);
        this.uiRenderer.renderMessages(chat.messages);
        this.uiRenderer.updateChatTitle(chat.title);
        
        return chat;
    }

    async deleteChat(chatId) {
        if (!confirm('Are you sure you want to delete this chat?')) {
            return false;
        }

        const updatedChats = this.storage.deleteChat(chatId);
        this.chats = updatedChats;
        
        this.uiRenderer.renderChatList(this.chats);
        
        // If current chat was deleted, open another one
        if (this.currentChat && this.currentChat.id === chatId) {
            if (this.chats.length > 0) {
                await this.openChat(this.chats[0].id);
            } else {
                await this.createNewChat();
            }
        }
        
        return true;
    }

    async sendMessage(content) {
        if (!content.trim() || !this.currentChat) return;

        // Add user message
        const userMessage = {
            role: 'user',
            content: content.trim(),
            timestamp: Date.now()
        };

        const updatedChat = this.storage.addMessage(this.currentChat.id, userMessage);
        if (updatedChat) {
            this.currentChat = updatedChat;
            this.uiRenderer.renderMessages(this.currentChat.messages);
            
            // Generate title for first message
            if (this.currentChat.messages.length === 1) {
                const title = this.storage.generateTitle(content);
                this.storage.updateChat(this.currentChat.id, { title });
                this.currentChat.title = title;
                this.uiRenderer.renderChatList(this.chats);
            }
        }

        // Get AI response
        this.uiRenderer.showTypingIndicator();
        
        try {
            const aiResponse = await this.messageHandler.getAIResponse(content);
            
            const assistantMessage = {
                role: 'assistant',
                content: aiResponse,
                timestamp: Date.now()
            };

            const chatWithResponse = this.storage.addMessage(this.currentChat.id, assistantMessage);
            if (chatWithResponse) {
                this.currentChat = chatWithResponse;
                this.uiRenderer.renderMessages(this.currentChat.messages);
            }
        } catch (error) {
            console.error('Error getting AI response:', error);
            const errorMessage = {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.',
                timestamp: Date.now()
            };
            const chatWithError = this.storage.addMessage(this.currentChat.id, errorMessage);
            if (chatWithError) {
                this.currentChat = chatWithError;
                this.uiRenderer.renderMessages(this.currentChat.messages);
            }
        } finally {
            this.uiRenderer.hideTypingIndicator();
        }
    }

    async saveCurrentChat() {
        if (!this.currentChat) return;

        const title = prompt('Enter a name for this chat:', this.currentChat.title);
        if (title && title.trim()) {
            this.storage.updateChat(this.currentChat.id, { title: title.trim() });
            this.currentChat.title = title.trim();
            this.uiRenderer.renderChatList(this.chats);
            this.uiRenderer.showNotification('Chat saved successfully!');
        }
    }

    getCurrentChat() {
        return this.currentChat;
    }

    getAllChats() {
        return this.chats;
    }
}

// Export for use in other modules
window.ChatManager = ChatManager;
