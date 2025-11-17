"""Price API routes"""
from flask import Blueprint, jsonify
from services.stock_service import get_stock_price
from services.crypto_service import get_crypto_price
from config import POPULAR_STOCKS, POPULAR_CRYPTO, BORSA_ISTANBUL

prices_bp = Blueprint('prices', __name__, url_prefix='/api/prices')


@prices_bp.route('/popular', methods=['GET'])
def get_popular_prices():
    """Get prices for popular stocks"""
    results = {}
    for symbol, name in POPULAR_STOCKS.items():
        price_data = get_stock_price(symbol)
        # Only include if no error and price is valid
        if 'error' not in price_data and price_data.get('price') and price_data.get('price') != 0:
            results[symbol] = {
                'name': name,
                'symbol': symbol,
                **price_data
            }
    return jsonify(results)


@prices_bp.route('/crypto', methods=['GET'])
def get_crypto_prices():
    """Get prices for popular cryptocurrencies"""
    results = {}
    for symbol, name in POPULAR_CRYPTO.items():
        price_data = get_crypto_price(symbol)
        # Only include if no error and price is valid
        if 'error' not in price_data and price_data.get('price') and price_data.get('price') != 0:
            results[symbol] = {
                'name': name,
                'symbol': symbol.replace('/USDT', ''),
                **price_data
            }
    return jsonify(results)


@prices_bp.route('/borsa-istanbul', methods=['GET'])
def get_borsa_istanbul():
    """Get prices for Borsa Istanbul stocks"""
    results = {}
    for symbol, name in BORSA_ISTANBUL.items():
        price_data = get_stock_price(symbol)
        # Only include if no error and price is valid
        if 'error' not in price_data and price_data.get('price') and price_data.get('price') != 0:
            results[symbol] = {
                'name': name,
                'symbol': symbol,
                **price_data
            }
    return jsonify(results)


@prices_bp.route('/<symbol>', methods=['GET'])
def get_price(symbol):
    """Get price for a specific symbol"""
    # Try as stock first (includes warrants and Borsa Istanbul stocks)
    price_data = get_stock_price(symbol)
    if 'error' not in price_data and price_data.get('price') and price_data.get('price') != 0:
        return jsonify({
            'symbol': symbol,
            'type': 'stock',
            **price_data
        })
    
    # Only try crypto if stock lookup failed and symbol doesn't look like a warrant/stock
    if not ('.' in symbol or symbol.endswith('.V')):
        crypto_symbol = f"{symbol}/USDT"
        crypto_data = get_crypto_price(crypto_symbol)
        if 'error' not in crypto_data and crypto_data.get('price') and crypto_data.get('price') != 0:
            return jsonify({
                'symbol': symbol,
                'type': 'crypto',
                **crypto_data
            })
    
    return jsonify({'error': 'Bu sembol için geçerli fiyat verisi bulunamadı'}), 404

