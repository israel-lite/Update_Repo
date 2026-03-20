# Eazee - F-C 13 Tech Dominator

A modern AI chat interface with dynamic chat management and Eazee branding.

## Features

- 🤖 AI Chat with 20% ChatGPT Intelligence
- 🎨 Modern ChatGPT-style Interface
- 💬 Dynamic Chat Management
- 🗂️ Persistent Chat Storage
- 🎤 Voice Input Support
- 📱 Responsive Design
- 🔐 User Authentication
- 🌙 Dark Theme

## Quick Start

### Local Development

```bash
# Install dependencies
pip install flask flask-cors

# Run the server
python3 simple_ai_server.py
```

Open http://localhost:3000

### Vercel Deployment

1. Push to GitHub
2. Connect to Vercel
3. Deploy automatically

## Project Structure

```
├── chatgpt-style.html      # Main chat interface
├── clone.html             # Landing page
├── login.html             # Authentication
├── js/
│   ├── storage.js         # localStorage operations
│   ├── messageHandler.js  # AI communication
│   ├── uiRenderer.js      # UI rendering
│   └── chatManager.js     # Chat logic
├── api/
│   └── index.py           # Vercel serverless function
├── simple_ai_server.py    # Local development server
├── eazee-logo.svg         # Custom logo
└── vercel.json           # Vercel configuration
```

## Usage

1. Click "Ask anything" to start a new chat
2. Type your questions and get AI responses
3. Chats are automatically saved and organized
4. Use voice input for hands-free chatting

## AI Capabilities

The AI can help with:
- Programming questions (JavaScript, Python, HTML, CSS)
- General knowledge and explanations
- Step-by-step guidance
- Personalized conversations

## Deployment

### Vercel

This project is optimized for Vercel deployment:

- Serverless functions for API endpoints
- Static file serving for frontend
- Automatic CI/CD from GitHub

### Environment Variables

No environment variables required - everything works out of the box!

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Push to GitHub
5. Open a Pull Request

## License

MIT License - feel free to use this project for your own needs!
