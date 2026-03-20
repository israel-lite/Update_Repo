const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// AI Response endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const lowerMessage = message.toLowerCase();
        
        // Enhanced AI responses with more technical knowledge
        const responses = {
            'html': 'HTML stands for HyperText Markup Language. It\'s the standard markup language used to create web pages. HTML describes the structure of a web page semantically and originally included cues for the appearance of the document. It consists of elements represented by tags, which define the content and structure of web pages.',
            
            'javascript': 'JavaScript is a high-level, interpreted programming language that is one of the core technologies of the World Wide Web, alongside HTML and CSS. It enables interactive web pages and is an essential part of web applications. JavaScript can be used for client-side development, server-side development (with Node.js), mobile apps, and more.',
            
            'css': 'CSS stands for Cascading Style Sheets. It\'s a stylesheet language used to describe the presentation of a document written in HTML or XML. CSS describes how elements should be rendered on screen, on paper, in speech, or on other media. It controls layout, colors, fonts, and spacing of web elements.',
            
            'python': 'Python is a high-level, interpreted programming language known for its clear syntax and readability. It\'s widely used in web development, data science, artificial intelligence, scientific computing, and automation. Python emphasizes code readability with its notable use of significant whitespace.',
            
            'react': 'React is a JavaScript library for building user interfaces, particularly web applications with rich, interactive UIs. It was developed by Facebook and is maintained by Facebook and a community of individual developers and companies. React uses a virtual DOM to optimize rendering performance and allows developers to create reusable UI components.',
            
            'node': 'Node.js is a JavaScript runtime built on Chrome\'s V8 JavaScript engine. It allows developers to run JavaScript on the server-side, enabling full-stack JavaScript development. Node.js is known for its non-blocking, event-driven architecture, making it efficient for building scalable network applications.',
            
            'hello': 'Hello! I\'m here to help you with programming questions, explain technical concepts, or assist with any other topics you\'re curious about. What would you like to learn about today?',
            
            'hi': 'Hi there! I\'m your AI assistant ready to help with programming, technology, and general knowledge. What can I assist you with?',
            
            'how are you': 'I\'m functioning perfectly and ready to help! I have access to a wide range of knowledge about programming, technology, and general topics. What can I assist you with?',
            
            'what is your name': 'I\'m your AI assistant, designed to help with programming questions, technical explanations, and general knowledge. I\'m here to provide clear, accurate information to help you learn and solve problems.',
            
            'help': 'I can help you with:\n• Programming languages (HTML, CSS, JavaScript, Python, etc.)\n• Web development concepts\n• Technical explanations\n• Problem-solving\n• General knowledge questions\n• And much more! Just ask me anything you\'re curious about.',
            
            'time': 'The current time is: ' + new Date().toLocaleTimeString(),
            
            'date': 'Today\'s date is: ' + new Date().toLocaleDateString(),
            
            'weather': 'I\'d need your location to provide weather information. Could you tell me which city you\'re in?'
        };
        
        let response = null;
        
        // Check for exact matches first
        for (let key in responses) {
            if (lowerMessage.includes(key)) {
                response = responses[key];
                break;
            }
        }
        
        // Check for programming-related questions
        if (!response) {
            if (lowerMessage.includes('programming') || lowerMessage.includes('code') || lowerMessage.includes('develop')) {
                if (lowerMessage.includes('who') || lowerMessage.includes('what') || lowerMessage.includes('when') || lowerMessage.includes('where') || lowerMessage.includes('why') || lowerMessage.includes('how')) {
                    response = 'That\'s a great programming question! I\'d be happy to help explain that concept. Could you provide a bit more context about what specific aspect you\'d like me to cover? For example, are you asking about implementation, best practices, or theoretical concepts?';
                }
            }
        }
        
        // Check for general question words
        if (!response) {
            if (lowerMessage.includes('who') || lowerMessage.includes('what') || lowerMessage.includes('when') || lowerMessage.includes('where') || lowerMessage.includes('why') || lowerMessage.includes('how')) {
                response = 'That\'s an interesting question! Let me provide you with a comprehensive answer. To give you the most accurate and helpful response, could you tell me a bit more about what specific aspect you\'d like me to focus on?';
            }
        }
        
        // Default intelligent responses
        if (!response) {
            const defaultResponses = [
                'That\'s a thoughtful question! Based on what you\'ve asked, I\'d be happy to provide more detailed information. Could you help me understand what specific aspect you\'d most like to explore?',
                'I understand you\'re curious about ' + message + '. This is an interesting topic! To give you the most helpful response, could you let me know what particular aspect you\'d like me to focus on?',
                'Great question! I can definitely help you with that. To provide the most useful information, could you clarify what specific area you\'d like me to focus on?',
                'I appreciate you asking about that! This is a fascinating topic with many aspects. What particular dimension of this would you like me to explain in more detail?',
                'That\'s an excellent question! I\'d be happy to share what I know about this topic. Is there a specific angle or application you\'re most interested in learning about?'
            ];
            response = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
        }
        
        // Simulate processing delay for more natural interaction
        setTimeout(() => {
            res.json({ response });
        }, 800 + Math.random() * 700); // Random delay between 0.8-1.5 seconds
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'clone.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
