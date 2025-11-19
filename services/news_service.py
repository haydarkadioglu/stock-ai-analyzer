"""News service for analyzing stock-related news using Gemini AI"""
from services.gemini_service import configure_gemini
import google.generativeai as genai
from config import GEMINI_API_KEY, GEMINI_MODEL


def analyze_news_with_ai(symbol, price_data=None, language='tr', model_name=None):
    """Use Gemini AI to research and analyze news for a stock symbol"""
    model_name = model_name or GEMINI_MODEL
    
    # Configure Gemini
    configure_gemini()
    
    # Clean symbol for search (remove .IS, .V, etc.)
    clean_symbol = symbol.replace('.IS', '').replace('.V', '').split('.')[0]
    
    # Get price info if available
    price_info = ""
    if price_data and price_data.get('price'):
        price = price_data.get('price', 'N/A')
        change = price_data.get('change', 'N/A')
        change_percent = price_data.get('change_percent', 'N/A')
        if language == 'tr':
            price_info = f"\nMevcut Fiyat: ${price}\nDeğişim: {change} ({change_percent}%)\n"
        else:
            price_info = f"\nCurrent Price: ${price}\nChange: {change} ({change_percent}%)\n"
    
    # Create prompt based on language
    if language == 'tr':
        lang_instruction = "Türkçe olarak, profesyonel ama kısa ve öz bir şekilde sun."
        prompt = f"""
        Sen bir finansal analiz uzmanısın. {symbol} (veya {clean_symbol}) sembolü için güncel haberleri araştır ve analiz et.
        
        {price_info}
        
        Lütfen aşağıdakileri yap:
        1. {symbol} sembolü için en güncel ve önemli haberleri araştır
        2. BORSAYI İLGİLENDİREBİLECEK en önemli 2-3 haberi seç
        3. Her haber için:
           - Haber başlığı veya konusu
           - Haberin önemi ve sembol üzerindeki potansiyel etkisi (kısa ve öz, 2-3 cümle)
           - Yatırımcılar için önemi ve fiyat hareketlerine etkisi
        
        Önemli notlar:
        - Sadece gerçekten önemli ve sembolün fiyatını etkileyebilecek haberleri seç
        - Eğer önemli haber yoksa veya bulamıyorsan, "Bu sembol için önemli haber bulunamadı" yaz
        - Haberlerin tarihlerini de belirt (mümkünse)
        
        {lang_instruction} Maksimum 250 kelime. Sadece önemli haberleri seç ve kısa tut.
        """
    else:
        lang_instruction = "In English, present it professionally but concisely."
        prompt = f"""
        You are a financial analysis expert. Research and analyze recent news for symbol {symbol} (or {clean_symbol}).
        
        {price_info}
        
        Please do the following:
        1. Research the most recent and important news for symbol {symbol}
        2. Select the 2-3 MOST IMPORTANT news that could affect the stock market
        3. For each news:
           - News headline or topic
           - The importance of the news and its potential impact on the symbol (brief, 2-3 sentences)
           - Importance for investors and potential impact on price movements
        
        Important notes:
        - Only select truly important news that could affect the symbol's price
        - If there are no important news or you cannot find any, write "No important news found for this symbol"
        - Include dates for news (if possible)
        
        {lang_instruction} Maximum 250 words. Only select important news and keep it brief.
        """
    
    try:
        model = genai.GenerativeModel(model_name)
        response = model.generate_content(prompt)
        return {
            'symbol': symbol,
            'analysis': response.text,
            'articles_count': 0  # We don't fetch articles directly anymore
        }
    except Exception as e:
        return {'error': f'Gemini API error: {str(e)}'}

