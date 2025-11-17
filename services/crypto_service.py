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


def get_crypto_history(symbol, period='1mo'):
    """Get historical price data for charting
    
    Args:
        symbol: Crypto symbol (e.g., BTC/USDT)
        period: Period to fetch (1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max)
    
    Returns:
        Dictionary with dates and prices, or error
    """
    try:
        # Convert period to timeframe
        timeframe_map = {
            '1d': '1h',
            '5d': '4h',
            '1mo': '1d',
            '3mo': '1d',
            '6mo': '1d',
            '1y': '1d',
            '2y': '1d',
            '5y': '1w',
            '10y': '1w',
            'ytd': '1d',
            'max': '1w'
        }
        
        timeframe = timeframe_map.get(period, '1d')
        
        # Calculate limit based on period
        limit_map = {
            '1d': 24,
            '5d': 30,
            '1mo': 30,
            '3mo': 90,
            '6mo': 180,
            '1y': 365,
            '2y': 730,
            '5y': 260,
            '10y': 520,
            'ytd': 365,
            'max': 1000
        }
        
        limit = limit_map.get(period, 30)
        
        # Fetch OHLCV data
        ohlcv = exchange.fetch_ohlcv(symbol, timeframe, limit=limit)
        
        if not ohlcv or len(ohlcv) == 0:
            return {'error': 'No historical data available'}
        
        # Extract data
        dates = []
        prices = []
        high = []
        low = []
        volume = []
        
        for candle in ohlcv:
            timestamp = candle[0]
            dates.append(timestamp)
            high.append(round(candle[2], 2))
            low.append(round(candle[3], 2))
            prices.append(round(candle[4], 2))  # Close price
            volume.append(int(candle[5]))
        
        # Convert timestamps to dates
        from datetime import datetime
        # For 1d period, show hour info, otherwise just date
        if period == '1d':
            date_strings = [datetime.fromtimestamp(ts / 1000).strftime('%Y-%m-%d %H:%M') for ts in dates]
        else:
            date_strings = [datetime.fromtimestamp(ts / 1000).strftime('%Y-%m-%d') for ts in dates]
        
        return {
            'dates': date_strings,
            'prices': prices,
            'high': high,
            'low': low,
            'volume': volume
        }
    except Exception as e:
        return {'error': f'Error fetching historical data: {str(e)}'}

