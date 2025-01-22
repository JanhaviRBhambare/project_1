from flask import Flask, request, jsonify
import google.generativeai as genai
import os
from flask_cors import CORS  # Added for CORS support

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure Gemini API
GOOGLE_API_KEY = "AIzaSyDqN82Jxa3YmWro9XJ4X-dhuR2owlXwH4s"  # Replace with your API key
genai.configure(api_key=GOOGLE_API_KEY)

# Initialize Gemini Pro model
model = genai.GenerativeModel('gemini-pro')

def get_gemini_response(question):
    """Get response from Gemini model"""
    try:
        response = model.generate_content(question)
        return response.text
    except Exception as e:
        raise Exception(f"Error getting response from Gemini: {str(e)}")
@app.route('/ask', methods=['POST'])
def ask_question():
    try:
        # Get JSON data from request body
        data = request.get_json()

        if not data or 'question' not in data:
            return jsonify({"error": "No question provided in request body"}), 400
        
        question = data['question']

        question += "question is related to anemia ans it in short"
        
        # Get response from Gemini
        response = get_gemini_response(question)

        # Remove markdown formatting like asterisks for bold text
        formatted_response = response.replace('* **', '').replace('**', '').replace('*', '\n')
        
        return jsonify({
            "question": question,
            "answer": formatted_response.strip()
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/', methods=['GET'])
def home():
    return """
    <html>
        <body style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
            <h1>Gemini AI API</h1>
            <p>Send POST requests to /ask with JSON body containing your question</p>
            <div style="background-color: #f0f0f0; padding: 15px; border-radius: 5px;">
                <h2>Try it out:</h2>
                <form id="questionForm" onsubmit="return false;">
                    <input type="text" id="questionInput" style="width: 70%; padding: 8px;" placeholder="Enter your question">
                    <button onclick="askQuestion()" style="padding: 8px 15px;">Ask</button>
                </form>
                <div id="response" style="margin-top: 15px;"></div>
            </div>
            <script>
                function askQuestion() {
                    const question = document.getElementById('questionInput').value;
                    const responseDiv = document.getElementById('response');
                    responseDiv.innerHTML = 'Loading...';
                    
                    fetch('/ask', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            question: question
                        })
                    })
                    .then(response => response.json())
                    .then(data => {
                        responseDiv.innerHTML = `<strong>Answer:</strong><br>${data.answer}`;
                    })
                    .catch(error => {
                        responseDiv.innerHTML = `Error: ${error}`;
                    });
                }
            </script>
        </body>
    </html>
    """

if __name__ == '__main__':
    print("Server starting on http://localhost:5000")
    app.run(port=5000, debug=True)