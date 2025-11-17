import os
from dotenv import load_dotenv

load_dotenv()

# Gemini Configuration
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', '')
GEMINI_MODEL = os.getenv('GEMINI_MODEL', 'gemini-2.5-flash')

# Popular stocks and crypto symbols
POPULAR_STOCKS = {
    'AAPL': 'Apple Inc.',
    'GOOGL': 'Alphabet Inc.',
    'MSFT': 'Microsoft Corporation',
    'AMZN': 'Amazon.com Inc.',
    'TSLA': 'Tesla Inc.',
    'META': 'Meta Platforms Inc.',
    'NVDA': 'NVIDIA Corporation',
    'BABA': 'Alibaba Group',
    'NFLX': 'Netflix Inc.',
    'AMD': 'Advanced Micro Devices'
}

POPULAR_CRYPTO = {
    'BTC/USDT': 'Bitcoin',
    'ETH/USDT': 'Ethereum',
    'BNB/USDT': 'Binance Coin',
    'SOL/USDT': 'Solana',
    'ADA/USDT': 'Cardano',
    'XRP/USDT': 'Ripple',
    'DOGE/USDT': 'Dogecoin',
    'DOT/USDT': 'Polkadot'
}

BORSA_ISTANBUL = {
    'THYAO.IS': 'Türk Hava Yolları',
    'AKBNK.IS': 'Akbank',
    'GARAN.IS': 'Garanti BBVA',
    'ISCTR.IS': 'İş Bankası',
    'SAHOL.IS': 'Hacı Ömer Sabancı Holding',
    'TUPRS.IS': 'Tüpraş',
    'BIMAS.IS': 'BİM',
    'EREGL.IS': 'Ereğli Demir Çelik'
}

