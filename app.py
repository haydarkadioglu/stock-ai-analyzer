"""Main Flask application"""
from flask import Flask
from flask_cors import CORS
from routes.pages import pages_bp
from routes.prices import prices_bp
from routes.analysis import analysis_bp
from routes.settings import settings_bp
from services.gemini_service import configure_gemini
from config import GEMINI_API_KEY

app = Flask(__name__)
CORS(app)

# Register blueprints
app.register_blueprint(pages_bp)
app.register_blueprint(prices_bp)
app.register_blueprint(analysis_bp)
app.register_blueprint(settings_bp)

# Initialize Gemini if API key is available
if GEMINI_API_KEY:
    configure_gemini()


if __name__ == '__main__':
    app.run(debug=True, port=5000)
