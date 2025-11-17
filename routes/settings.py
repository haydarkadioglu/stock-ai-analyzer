"""Settings API routes"""
from flask import Blueprint, jsonify, request
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

