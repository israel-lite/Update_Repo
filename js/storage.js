/**
 * Storage Manager - Handles localStorage operations
 */
class StorageManager {
    constructor() {
        this.CHATS_KEY = 'eazee_chats';
        this.ACTIVE_CHAT_KEY = 'eazee_active_chat';
        this.USER_DATA_KEY = 'eazee_user_data';
    }

    // Chat operations
    getChats() {
        try {
            const chats = localStorage.getItem(this.CHATS_KEY);
            return chats ? JSON.parse(chats) : [];
        } catch (error) {
            console.error('Error loading chats:', error);
            return [];
        }
    }

    saveChats(chats) {
        try {
            localStorage.setItem(this.CHATS_KEY, JSON.stringify(chats));
            return true;
        } catch (error) {
            console.error('Error saving chats:', error);
            return false;
        }
    }

    createChat(title = 'New Chat') {
        const chats = this.getChats();
        const newChat = {
            id: this.generateId(),
            title: title,
            messages: [],
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        
        chats.unshift(newChat);
        this.saveChats(chats);
        return newChat;
    }

    updateChat(chatId, updates) {
        const chats = this.getChats();
        const chatIndex = chats.findIndex(chat => chat.id === chatId);
        
        if (chatIndex !== -1) {
            chats[chatIndex] = { ...chats[chatIndex], ...updates, updatedAt: Date.now() };
            this.saveChats(chats);
            return chats[chatIndex];
        }
        return null;
    }

    deleteChat(chatId) {
        const chats = this.getChats();
        const filteredChats = chats.filter(chat => chat.id !== chatId);
        this.saveChats(filteredChats);
        return filteredChats;
    }

    addMessage(chatId, message) {
        const chats = this.getChats();
        const chat = chats.find(chat => chat.id === chatId);
        
        if (chat) {
            chat.messages.push({
                role: message.role,
                content: message.content,
                timestamp: Date.now()
            });
            chat.updatedAt = Date.now();
            this.saveChats(chats);
            return chat;
        }
        return null;
    }

    // Active chat operations
    getActiveChatId() {
        return localStorage.getItem(this.ACTIVE_CHAT_KEY);
    }

    setActiveChatId(chatId) {
        localStorage.setItem(this.ACTIVE_CHAT_KEY, chatId);
    }

    // User data operations
    getUserData() {
        try {
            const userData = localStorage.getItem(this.USER_DATA_KEY);
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Error loading user data:', error);
            return null;
        }
    }

    saveUserData(userData) {
        try {
            localStorage.setItem(this.USER_DATA_KEY, JSON.stringify(userData));
            return true;
        } catch (error) {
            console.error('Error saving user data:', error);
            return false;
        }
    }

    // Utility methods
    generateId() {
        return 'chat_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    generateTitle(message) {
        const words = message.trim().split(/\s+/);
        const title = words.slice(0, 6).join(' ');
        return title.length > 30 ? title.substring(0, 30) + '...' : title;
    }

    clearAllData() {
        localStorage.removeItem(this.CHATS_KEY);
        localStorage.removeItem(this.ACTIVE_CHAT_KEY);
        localStorage.removeItem(this.USER_DATA_KEY);
    }
}

// Export singleton instance
const storage = new StorageManager();
