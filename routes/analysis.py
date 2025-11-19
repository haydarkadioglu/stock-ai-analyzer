"""Analysis API routes"""
from flask import Blueprint, jsonify, request
from datetime import datetime
import os
from services.stock_service import get_stock_price, get_stock_history
from services.crypto_service import get_crypto_price, get_crypto_history
from services.gemini_service import analyze_stock, ask_question
from services.news_service import analyze_news_with_ai
from config import GEMINI_API_KEY, GEMINI_MODEL

analysis_bp = Blueprint('analysis', __name__, url_prefix='/api')


@analysis_bp.route('/price/<symbol>', methods=['GET'])
def get_price(symbol):
    """Get price for a specific symbol (used by analysis)"""
    # Try as stock first
    price_data = get_stock_price(symbol)
    if 'error' not in price_data:
        return jsonify({
            'symbol': symbol,
            'type': 'stock',
            **price_data
        })
    
    # Try as crypto
    crypto_symbol = f"{symbol}/USDT"
    price_data = get_crypto_price(crypto_symbol)
    if 'error' not in price_data:
        return jsonify({
            'symbol': symbol,
            'type': 'crypto',
            **price_data
        })
    
    return jsonify({'error': 'Symbol not found'}), 404


@analysis_bp.route('/analyze', methods=['POST'])
def analyze_stock_route():
    """Analyze a stock using Gemini AI"""
    data = request.json
    symbol = data.get('symbol', '').upper()
    analysis_type = data.get('analysis_type', 'short_term')
    language = data.get('language', 'tr')  # Default to Turkish
    
    # Validate analysis type
    valid_types = ['daily', 'weekly', 'short_term', 'long_term']
    if analysis_type not in valid_types:
        analysis_type = 'short_term'
    
    if not symbol:
        return jsonify({'error': 'Symbol is required'}), 400
    
    # Get current API key and model from env
    api_key = os.getenv('GEMINI_API_KEY', '')
    model_name = os.getenv('GEMINI_MODEL', GEMINI_MODEL)
    
    if not api_key:
        return jsonify({'error': 'Gemini API key not configured'}), 400
    
    try:
        # Get stock data (includes warrants and Borsa Istanbul stocks)
        price_data = get_stock_price(symbol)
        
        # Only try crypto if stock lookup failed and symbol doesn't look like a warrant/stock
        if 'error' in price_data and not ('.' in symbol or symbol.endswith('.V')):
            # Try crypto
            crypto_symbol = f"{symbol}/USDT"
            crypto_data = get_crypto_price(crypto_symbol)
            if 'error' not in crypto_data:
                price_data = crypto_data
        
        # Validate price data before analysis
        if 'error' in price_data:
            return jsonify({'error': price_data['error']}), 404
        
        # Check if price is valid (not 0 or None)
        if not price_data.get('price') or price_data.get('price') == 0:
            return jsonify({'error': 'Bu sembol için geçerli fiyat verisi bulunamadı. Lütfen farklı bir sembol deneyin.'}), 404
        
        # Analyze with Gemini
        analysis = analyze_stock(symbol, price_data, analysis_type, model_name, language)
        
        return jsonify({
            'symbol': symbol,
            'price_data': price_data,
            'analysis': analysis,
            'analysis_type': analysis_type,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@analysis_bp.route('/ask-question', methods=['POST'])
def ask_question_route():
    """Ask a follow-up question about the analysis"""
    data = request.json
    symbol = data.get('symbol', '').upper()
    question = data.get('question', '').strip()
    analysis_text = data.get('analysis_text', '')
    price_data = data.get('price_data', {})
    language = data.get('language', 'tr')  # Default to Turkish
    
    if not symbol or not question:
        return jsonify({'error': 'Symbol and question are required'}), 400
    
    if not analysis_text:
        return jsonify({'error': 'Analysis text is required'}), 400
    
    # Get current API key and model from env
    api_key = os.getenv('GEMINI_API_KEY', '')
    model_name = os.getenv('GEMINI_MODEL', GEMINI_MODEL)
    
    if not api_key:
        return jsonify({'error': 'Gemini API key not configured'}), 400
    
    try:
        # Ask question using Gemini
        answer = ask_question(symbol, price_data, analysis_text, question, model_name, language)
        
        return jsonify({
            'symbol': symbol,
            'question': question,
            'answer': answer,
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@analysis_bp.route('/analyze-news', methods=['POST'])
def analyze_news_route():
    """Use Gemini AI to research and analyze news for a stock symbol"""
    data = request.json
    symbol = data.get('symbol', '').upper()
    language = data.get('language', 'tr')  # Default to Turkish
    
    if not symbol:
        return jsonify({'error': 'Symbol is required'}), 400
    
    # Get current API key and model from env
    api_key = os.getenv('GEMINI_API_KEY', '')
    model_name = os.getenv('GEMINI_MODEL', GEMINI_MODEL)
    
    if not api_key:
        return jsonify({'error': 'Gemini API key not configured'}), 400
    
    try:
        # Get price data for context (optional but helpful)
        price_data = None
        try:
            stock_data = get_stock_price(symbol)
            if 'error' not in stock_data:
                price_data = stock_data
            else:
                # Try as crypto
                crypto_symbol = f"{symbol}/USDT"
                crypto_data = get_crypto_price(crypto_symbol)
                if 'error' not in crypto_data:
                    price_data = crypto_data
        except:
            pass  # Price data is optional
        
        # Use Gemini AI to research and analyze news
        analysis = analyze_news_with_ai(symbol, price_data, language, model_name)
        
        if 'error' in analysis:
            return jsonify({'error': analysis['error']}), 500
        
        return jsonify({
            'symbol': symbol,
            'news_analysis': analysis['analysis'],
            'timestamp': datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@analysis_bp.route('/history/<symbol>', methods=['GET'])
def get_history(symbol):
    """Get historical price data for charting"""
    symbol = symbol.upper()
    period = request.args.get('period', '1mo')  # Default to 1 month
    
    try:
        # Try as stock first
        history = get_stock_history(symbol, period)
        
        # Only try crypto if stock lookup failed and symbol doesn't look like a warrant/stock
        if 'error' in history and not ('.' in symbol or symbol.endswith('.V')):
            # Try crypto
            crypto_symbol = f"{symbol}/USDT"
            crypto_history = get_crypto_history(crypto_symbol, period)
            if 'error' not in crypto_history:
                history = crypto_history
        
        if 'error' in history:
            return jsonify({'error': history['error']}), 404
        
        return jsonify({
            'symbol': symbol,
            'period': period,
            **history
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

