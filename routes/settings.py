"""Settings API routes"""
from flask import Blueprint, jsonify, request
import google.generativeai as genai
from services.settings_service import get_settings, update_settings

settings_bp = Blueprint('settings', __name__, url_prefix='/api/settings')


@settings_bp.route('', methods=['GET'])
def get_settings_route():
    """Get current settings (without exposing API key)"""
    return jsonify(get_settings())


@settings_bp.route('', methods=['POST'])
def update_settings_route():
    """Update settings"""
    data = request.json
    api_key = data.get('api_key', '').strip()
    model = data.get('model', '').strip()
    
    if not api_key and not model:
        return jsonify({'error': 'At least one setting must be provided'}), 400
    
    try:
        update_settings(api_key=api_key if api_key else None, 
                       model=model if model else None)
        return jsonify({
            'success': True,
            'message': 'Settings updated successfully'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@settings_bp.route('/test-api-key', methods=['POST'])
def test_api_key_route():
    """Test if a Gemini API key is valid"""
    import os
    from config import GEMINI_API_KEY, GEMINI_MODEL
    
    data = request.json or {}
    api_key = data.get('api_key', '').strip()
    
    # If no API key in request, try to get from environment
    if not api_key:
        api_key = os.getenv('GEMINI_API_KEY', GEMINI_API_KEY)
    
    if not api_key:
        return jsonify({'error': 'API key is required for testing. Please enter API key or configure it in settings.'}), 400
    
    try:
        # Configure Gemini with the provided API key
        genai.configure(api_key=api_key)
        
        # Get default model for testing
        model_name = os.getenv('GEMINI_MODEL', GEMINI_MODEL)
        
        # Try to create a model instance with default model
        model_instance = genai.GenerativeModel(model_name)
        
        # Try a simple test prompt
        test_prompt = "Say 'Hello' in one word."
        response = model_instance.generate_content(test_prompt)
        
        # If we got here, the API key is valid
        return jsonify({
            'success': True,
            'message': 'API key is valid and working correctly!',
            'test_response': response.text.strip() if hasattr(response, 'text') else 'OK'
        })
        
    except Exception as e:
        error_msg = str(e)
        # Check for specific error types
        if 'api key' in error_msg.lower() or 'authentication' in error_msg.lower() or 'invalid' in error_msg.lower():
            return jsonify({
                'error': 'Invalid API key. Please check your API key.'
            }), 401
        elif 'quota' in error_msg.lower() or 'limit' in error_msg.lower():
            return jsonify({
                'error': 'API key quota exceeded. Please check your usage limits.'
            }), 429
        else:
            return jsonify({
                'error': f'Error testing API key: {error_msg}'
            }), 500


@settings_bp.route('/test-model', methods=['POST'])
def test_model_route():
    """Test if a Gemini model is accessible and working"""
    import os
    from config import GEMINI_API_KEY, GEMINI_MODEL
    
    data = request.json
    api_key = data.get('api_key', '').strip() or os.getenv('GEMINI_API_KEY', GEMINI_API_KEY)
    model = data.get('model', '').strip()
    
    if not api_key:
        return jsonify({'error': 'API key is required for testing. Please enter API key first or configure it in settings.'}), 400
    
    if not model:
        return jsonify({'error': 'Model name is required for testing'}), 400
    
    try:
        # Configure Gemini with the provided API key
        genai.configure(api_key=api_key)
        
        # Try to create a model instance
        model_instance = genai.GenerativeModel(model)
        
        # Try a simple test prompt
        test_prompt = "Say 'Hello' in one word."
        response = model_instance.generate_content(test_prompt)
        
        # If we got here, the model is working
        return jsonify({
            'success': True,
            'message': f'Model "{model}" is working correctly!',
            'test_response': response.text.strip() if hasattr(response, 'text') else 'OK'
        })
        
    except Exception as e:
        error_msg = str(e)
        # Check for specific error types
        if 'not found' in error_msg.lower() or 'does not exist' in error_msg.lower():
            return jsonify({
                'error': f'Model "{model}" not found. Please check the model name.'
            }), 404
        elif 'api key' in error_msg.lower() or 'authentication' in error_msg.lower():
            return jsonify({
                'error': 'Invalid API key. Please check your API key.'
            }), 401
        else:
            return jsonify({
                'error': f'Error testing model: {error_msg}'
            }), 500

