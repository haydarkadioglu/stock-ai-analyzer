"""Cryptocurrency price service using Binance API"""
import ccxt

# Initialize crypto exchange
exchange = ccxt.binance()


def get_crypto_price(symbol):
    """Get real-time crypto price from Binance"""
    try:
        ticker = exchange.fetch_ticker(symbol)
        
        # Check if we have valid price data
        if not ticker or 'last' not in ticker or not ticker['last'] or ticker['last'] == 0:
            return {'error': 'Price data not available for this symbol'}
        
        return {
            'price': round(ticker['last'], 2),
            'change': round(ticker['change'], 2),
            'change_percent': round(ticker['percentage'], 2),
            'volume': ticker.get('quoteVolume', 0),
            'high_24h': ticker.get('high', 0),
            'low_24h': ticker.get('low', 0)
        }
    except Exception as e:
        return {'error': f'Error fetching data: {str(e)}'}

