from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import random
import time
from datetime import datetime

app = Flask(__name__)
CORS(app)

# OTP storage (in production, use database)
otp_storage = {}

class SimpleAI:
    def __init__(self):
        print("🚀 F-C 13 Tech Dominator (20% ChatGPT Intelligence) initialized")
        
        # User learning memory
        self.user_memory = {}
        
        # Knowledge base
        self.knowledge_base = {
            'html': {
                'definition': 'HTML (HyperText Markup Language) is the standard markup language for creating web pages.',
                'explanation': 'HTML describes the structure of a web page semantically and originally included cues for the appearance of the document.',
                'features': ['Semantic markup', 'Cross-platform compatibility', 'SEO optimization'],
                'uses': ['Web page structure', 'Email templates', 'Documentation']
            },
            'javascript': {
                'definition': 'JavaScript is a programming language that enables interactive web pages.',
                'explanation': 'JavaScript is an essential part of web applications, enabling dynamic content, interactive forms, and animations.',
                'features': ['Dynamic content', 'Event handling', 'DOM manipulation'],
                'uses': ['Web interactivity', 'Mobile apps', 'Server-side development']
            },
            'python': {
                'definition': 'Python is a high-level programming language known for its simplicity and readability.',
                'explanation': 'Python supports multiple programming paradigms including procedural, object-oriented, and functional programming.',
                'features': ['Simple syntax', 'Large standard library', 'Cross-platform'],
                'uses': ['Web development', 'Data science', 'Machine learning', 'Automation']
            }
        }
        
        # Conversation patterns
        self.patterns = {
            'greeting': ['hello', 'hi', 'hey', 'greetings'],
            'technical': ['html', 'javascript', 'python', 'react', 'css', 'programming', 'code'],
            'question': ['what', 'how', 'why', 'when', 'where', 'who'],
            'learning': ['explain', 'teach', 'learn', 'understand', 'tutorial']
        }
    
    def learn_from_user(self, user_input, user_id="default"):
        """Learn from user input and save to memory"""
        if user_id not in self.user_memory:
            self.user_memory[user_id] = {
                'name': None,
                'preferences': {},
                'learned_facts': [],
                'conversation_history': [],
                'nicknames': [],
                'last_interaction': None
            }
        
        user_memory = self.user_memory[user_id]
        user_memory['last_interaction'] = datetime.now().isoformat()
        user_memory['conversation_history'].append({
            'input': user_input,
            'timestamp': datetime.now().isoformat()
        })
        
        # Extract personal information
        text_lower = user_input.lower()
        
        # Learn user name
        if 'my name is' in text_lower:
            parts = text_lower.split('my name is')
            if len(parts) > 1:
                name = parts[1].strip().split()[0].capitalize()
                user_memory['name'] = name
                return f"✅ Saved to memory: Your name is {name}"
        
        # Check for nickname requests
        if 'nickname' in text_lower and 'israel' in text_lower:
            return "Based on your name Israel, I'd suggest the nickname 'Eazee' - it's modern, memorable, and has a nice flow to it."
        
        return None
    
    def generate_response(self, user_input):
        """Generate ChatGPT-like intelligent response"""
        user_id = request.args.get('user_id', 'default') if hasattr(request, 'args') else 'default'
        
        # Learn from user input
        learning_result = self.learn_from_user(user_input, user_id)
        if learning_result:
            return learning_result
        
        # Get user context
        user_context = self.user_memory.get(user_id, {})
        user_name = user_context.get('name')
        
        text_lower = user_input.lower()
        
        # Check for greetings
        if any(greeting in text_lower for greeting in ['hello', 'hi', 'hey']):
            if user_name:
                return f"Hello {user_name}! How can I help you today?"
            return "Hello! How can I help you today?"
        
        # Check for technical questions
        for topic, info in self.knowledge_base.items():
            if topic in text_lower:
                response = f"{info['definition']} "
                
                if 'explain' in text_lower or 'how does' in text_lower:
                    response += f"{info['explanation']} "
                
                if 'features' in text_lower:
                    response += f"Key features include: {', '.join(info['features'])}. "
                
                if 'uses' in text_lower:
                    response += f"Common uses: {', '.join(info['uses'])}. "
                
                return response.strip()
        
        # Check for questions
        if '?' in user_input or any(q in text_lower for q in ['what', 'how', 'why', 'when', 'where', 'who']):
            if 'what is' in text_lower:
                return "That's a great question! Let me explain what that is and how it works."
            elif 'how to' in text_lower:
                return "Here's how you can approach that. Let me break it down step by step."
            elif 'why' in text_lower:
                return "That's a thoughtful question. The reason behind that involves several factors."
            else:
                return "That's an interesting question! Let me help you understand it better."
        
        # Check for learning requests
        if any(learn in text_lower for learn in ['explain', 'teach', 'learn', 'understand', 'tutorial']):
            return "I'd be happy to help you learn about that! Let me provide a comprehensive explanation with practical examples."
        
        # Default casual response
        casual_responses = [
            "That's interesting! Tell me more about that.",
            "I see what you mean. How can I help you with that?",
            "Thanks for sharing! What would you like to know next?",
            "That makes sense. Is there anything specific you'd like to explore?",
        ]
        
        if user_name:
            return f"{user_name}, {random.choice(casual_responses).lower()}"
        
        return random.choice(casual_responses)

# Initialize AI
ai_assistant = SimpleAI()

@app.route('/')
def serve_main():
    return send_from_directory('.', 'clone.html')

@app.route('/js/<filename>')
def serve_js(filename):
    return send_from_directory('js', filename)

@app.route('/<filename>')
def serve_root(filename):
    if filename.endswith('.svg') or filename.endswith('.html'):
        return send_from_directory('.', filename)
    return send_from_directory('.', filename)

@app.route('/login.html')
def serve_login():
    return send_from_directory('.', 'login.html')

@app.route('/api/send-otp', methods=['POST'])
def send_otp():
    try:
        data = request.get_json()
        email = data.get('email', '')
        
        # Generate 6-digit OTP
        otp = str(random.randint(100000, 999999))
        
        # Store OTP
        otp_storage[email] = {
            'otp': otp,
            'timestamp': datetime.now().isoformat()
        }
        
        print(f"🔐 OTP sent to {email}: {otp}")
        
        return jsonify({
            'success': True,
            'message': f'OTP sent to {email}',
            'otp': otp  # In production, don't return OTP
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/verify-otp', methods=['POST'])
def verify_otp():
    try:
        data = request.get_json()
        email = data.get('email', '')
        otp = data.get('otp', '')
        
        if email in otp_storage and otp_storage[email]['otp'] == otp:
            del otp_storage[email]
            return jsonify({'success': True, 'message': 'OTP verified successfully'})
        else:
            return jsonify({'success': False, 'message': 'Invalid OTP'}), 400
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        message = data.get('message', '')
        
        if not message:
            return jsonify({'error': 'No message provided'}), 400
        
        # Generate response
        response = ai_assistant.generate_response(message)
        
        # Simulate processing time
        time.sleep(0.5)
        
        return jsonify({
            'response': response,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("🚀 Starting F-C 13 Tech Dominator AI Server...")
    print("📱 Frontend: http://localhost:3000")
    print("🤖 AI Chat: http://localhost:3000/chatgpt-style.html")
    print("🔐 Login: http://localhost:3000/login.html")
    app.run(host='0.0.0.0', port=3000, debug=True)
