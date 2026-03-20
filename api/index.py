import json
from http.server import BaseHTTPRequestHandler

class handler(BaseHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        
        try:
            data = json.loads(post_data.decode('utf-8'))
            message = data.get('message', '').lower().strip()
            
            # Simple response logic
            response = self.get_simple_response(message)
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            
            self.wfile.write(json.dumps({
                'response': response,
                'timestamp': '2025-01-01T00:00:00Z'
            }).encode())
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode())
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
    
    def get_simple_response(self, message):
        # Simple greeting responses
        if any(greeting in message for greeting in ['hello', 'hi', 'hey', 'greetings']):
            return "Hi there! How can I help you today?"
        
        # How are you
        if any(how in message for how in ['how are you', "how's it going", 'how you doing']):
            return "I'm doing great, thanks for asking! What can I help you with?"
        
        # JavaScript question
        if 'javascript' in message:
            return "JavaScript is a popular programming language used for web development. It runs in browsers and helps make websites interactive!"
        
        # Python question
        if 'python' in message:
            return "Python is a versatile programming language known for its simple syntax. It's great for web development, data science, and automation!"
        
        # HTML question
        if 'html' in message:
            return "HTML (HyperText Markup Language) is the standard language for creating web pages. It provides the structure and content of websites!"
        
        # CSS question
        if 'css' in message:
            return "CSS (Cascading Style Sheets) is used to style and layout web pages. It controls colors, fonts, spacing, and overall design!"
        
        # What is questions
        if message.startswith('what is'):
            return "That's a great question! It's something interesting and worth learning about. Would you like me to explain more?"
        
        # How to questions
        if message.startswith('how to'):
            return "Here's how you can approach that: break it down into small steps, practice regularly, and don't be afraid to ask for help!"
        
        # Help question
        if 'help' in message:
            return "I'm here to help! You can ask me about programming, web development, or anything else you're curious about!"
        
        # Name related
        if 'my name is' in message:
            return "Nice to meet you! I'll remember that. What would you like to talk about?"
        
        # Default response
        return "That's interesting! Tell me more about that or ask me anything about programming and web development!"
