"""Settings management service"""
import os
from dotenv import load_dotenv
from services.gemini_service import configure_gemini


def get_settings():
    """Get current settings (without exposing API key)"""
    api_key = os.getenv('GEMINI_API_KEY', '')
    return {
        'api_key_configured': bool(api_key),
        'model': os.getenv('GEMINI_MODEL', 'gemini-2.5-flash')
    }


def update_settings(api_key=None, model=None):
    """Update settings in .env file"""
    env_path = '.env'
    env_vars = {}
    
    # Read existing .env if it exists
    if os.path.exists(env_path):
        with open(env_path, 'r', encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if '=' in line and not line.startswith('#'):
                    key, value = line.split('=', 1)
                    env_vars[key] = value
    
    # Update values
    if api_key:
        env_vars['GEMINI_API_KEY'] = api_key.strip()
    if model:
        env_vars['GEMINI_MODEL'] = model.strip()
    
    # Write back to .env
    with open(env_path, 'w', encoding='utf-8') as f:
        for key, value in env_vars.items():
            f.write(f"{key}={value}\n")
    
    # Reload environment
    load_dotenv(override=True)
    
    # Reconfigure Gemini if API key is set
    if api_key:
        configure_gemini(api_key)
    
    return True

