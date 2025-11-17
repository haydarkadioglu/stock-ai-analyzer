"""Stock price service using Yahoo Finance"""
import yfinance as yf


def get_stock_price(symbol):
    """Get real-time stock price from Yahoo Finance"""
    # Try different symbol formats for Borsa Istanbul warrants
    symbol_variants = [symbol]
    
    # If symbol ends with .V (warrant), try with .IS suffix
    if symbol.endswith('.V') and not symbol.endswith('.IS'):
        symbol_variants.append(f"{symbol}.IS")
    
    # If symbol doesn't have .IS suffix and is not a warrant, try adding .IS
    if not symbol.endswith('.IS') and not symbol.endswith('.V'):
        symbol_variants.append(f"{symbol}.IS")
    
    for sym in symbol_variants:
        try:
            ticker = yf.Ticker(sym)
            info = ticker.info
            
            # Check if we have valid data
            if not info or len(info) == 0:
                continue
            
            current_price = info.get('currentPrice') or info.get('regularMarketPrice') or info.get('previousClose')
            
            # If price is 0 or None, try next variant
            if not current_price or current_price == 0:
                continue
            
            change = info.get('regularMarketChange', 0)
            change_percent = info.get('regularMarketChangePercent', 0)
            volume = info.get('volume', 0)
            market_cap = info.get('marketCap', 0)
            
            return {
                'price': round(current_price, 2),
                'change': round(change, 2),
                'change_percent': round(change_percent, 2),
                'volume': volume,
                'market_cap': market_cap
            }
        except Exception:
            continue
    
    # If all variants failed, return error
    return {'error': f'No data available for symbol: {symbol}'}


def get_stock_history(symbol, period='1mo'):
    """Get historical price data for charting
    
    Args:
        symbol: Stock symbol
        period: Period to fetch (1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max)
    
    Returns:
        Dictionary with dates and prices, or error
    """
    # Try different symbol formats for Borsa Istanbul warrants
    symbol_variants = [symbol]
    
    if symbol.endswith('.V') and not symbol.endswith('.IS'):
        symbol_variants.append(f"{symbol}.IS")
    
    if not symbol.endswith('.IS') and not symbol.endswith('.V'):
        symbol_variants.append(f"{symbol}.IS")
    
    for sym in symbol_variants:
        try:
            ticker = yf.Ticker(sym)
            hist = ticker.history(period=period)
            
            if hist.empty:
                continue
            
            # Convert to list format for JSON
            # For 1d period, show hour info, otherwise just date
            if period == '1d':
                dates = hist.index.strftime('%Y-%m-%d %H:%M').tolist()
            else:
                dates = hist.index.strftime('%Y-%m-%d').tolist()
            prices = hist['Close'].tolist()
            
            return {
                'dates': dates,
                'prices': [round(float(p), 2) for p in prices],
                'high': [round(float(p), 2) for p in hist['High'].tolist()],
                'low': [round(float(p), 2) for p in hist['Low'].tolist()],
                'volume': [int(v) for v in hist['Volume'].tolist()]
            }
        except Exception:
            continue
    
    return {'error': f'No historical data available for symbol: {symbol}'}

