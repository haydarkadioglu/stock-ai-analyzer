"""Gemini AI service for stock analysis"""
import google.generativeai as genai
from config import GEMINI_API_KEY, GEMINI_MODEL


def configure_gemini(api_key=None):
    """Configure Gemini API"""
    key = api_key or GEMINI_API_KEY
    if key:
        genai.configure(api_key=key)


def ask_question(symbol, price_data, analysis_text, question, model_name=None, language='tr'):
    """Ask a follow-up question about the analysis"""
    model_name = model_name or GEMINI_MODEL
    
    # Configure Gemini
    configure_gemini()
    
    lang_instruction = "Türkçe olarak" if language == 'tr' else "In English"
    
    prompt = f"""
    You are a financial analysis expert. Answer the user's question about the following analysis report:

    Symbol: {symbol}
    Current Price: ${price_data.get('price', 'N/A')}
    Change: {price_data.get('change', 'N/A')} ({price_data.get('change_percent', 'N/A')}%)
    
    PREVIOUS ANALYSIS REPORT:
    {analysis_text}
    
    USER QUESTION: {question}
    
    Please answer the user's question based on the previous analysis report in a concise and clear manner (maximum 150 words).
    {lang_instruction}, answer in a professional but understandable way.
    """
    
    try:
        model = genai.GenerativeModel(model_name)
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        raise Exception(f"Gemini API error: {str(e)}")


def analyze_stock(symbol, price_data, analysis_type='short_term', model_name=None, language='tr'):
    """Analyze a stock using Gemini AI
    
    Args:
        symbol: Stock/crypto symbol
        price_data: Price data dictionary
        analysis_type: Type of analysis - 'daily', 'weekly', 'short_term', 'long_term'
        model_name: Gemini model name
    """
    model_name = model_name or GEMINI_MODEL
    
    # Configure Gemini
    configure_gemini()
    
    # Define analysis type prompts
    analysis_prompts = {
        'daily': {
            'title': 'GÜNLÜK ANALİZ (1 Gün)',
            'description': 'Bugün için teknik analiz yap. Günlük fiyat hareketleri, destek-direnç seviyeleri, günlük trend ve kısa vadeli işlem fırsatlarını değerlendir.',
            'focus': 'Günlük grafikler, günlük hacim, günlük volatilite, günlük destek-direnç seviyeleri'
        },
        'weekly': {
            'title': 'HAFTALIK ANALİZ (1 Hafta)',
            'description': 'Bu hafta için teknik ve temel analiz yap. Haftalık trend, haftalık destek-direnç seviyeleri, haftalık fiyat hedefleri ve haftalık işlem stratejilerini değerlendir.',
            'focus': 'Haftalık trend, haftalık grafik formasyonları, haftalık hacim analizi, haftalık fiyat hedefleri'
        },
        'short_term': {
            'title': 'KISA VADE ANALİZİ (1-3 Ay)',
            'description': '1-3 ay arası kısa vadeli analiz yap. Teknik göstergeler, kısa vadeli trend, destek-direnç seviyeleri, kısa vadeli fiyat hedefleri ve risk değerlendirmesi yap.',
            'focus': 'Kısa vadeli trend, teknik göstergeler (RSI, MACD, Moving Averages), kısa vadeli destek-direnç, kısa vadeli fiyat hedefleri, riskler ve fırsatlar'
        },
        'long_term': {
            'title': 'UZUN VADE ANALİZİ (6-12 Ay)',
            'description': '6-12 ay arası uzun vadeli analiz yap. Temel analiz, uzun vadeli trend, şirket/kripto temel göstergeleri, sektör analizi, uzun vadeli büyüme potansiyeli ve risk değerlendirmesi yap.',
            'focus': 'Uzun vadeli trend, temel analiz, şirket/kripto güçlü yönleri, sektör analizi, uzun vadeli büyüme potansiyeli, riskler ve fırsatlar, yatırım önerisi'
        }
    }
    
    analysis_info = analysis_prompts.get(analysis_type, analysis_prompts['short_term'])
    
    # Check if this is a warrant
    is_warrant = symbol.endswith('.V')
    warrant_note = ""
    if is_warrant:
        if language == 'tr':
            warrant_note = "\n\nNOT: Bu bir varant (warrant) sembolüdür. Varantlar, dayanak varlığa (örneğin KOZAL) dayalı türev enstrümanlardır. Varant analizinde dayanak varlığın performansı, vade tarihi, kullanım fiyatı ve varantın kaldıracı gibi faktörleri değerlendir."
        else:
            warrant_note = "\n\nNOTE: This is a warrant symbol. Warrants are derivative instruments based on underlying assets (e.g., KOZAL). In warrant analysis, consider factors such as the underlying asset's performance, expiry date, strike price, and the warrant's leverage."
    
    # Create analysis prompt based on language
    if language == 'tr':
        lang_instruction = "Türkçe olarak, profesyonel ama kısa ve öz bir şekilde sun."
        analysis_type_label = analysis_info['title']
    else:
        lang_instruction = "In English, present it professionally but concisely."
        # Translate analysis type titles to English
        analysis_type_labels_en = {
            'daily': 'DAILY ANALYSIS (1 Day)',
            'weekly': 'WEEKLY ANALYSIS (1 Week)',
            'short_term': 'SHORT-TERM ANALYSIS (1-3 Months)',
            'long_term': 'LONG-TERM ANALYSIS (6-12 Months)'
        }
        analysis_type_label = analysis_type_labels_en.get(analysis_type, analysis_info['title'])
    
    # Create analysis prompt - Kısa ve öz
    prompt = f"""
    You are a financial analysis expert. Perform {analysis_type_label} on the following stock/cryptocurrency:

    Symbol: {symbol}
    Current Price: ${price_data.get('price', 'N/A')}
    Change: {price_data.get('change', 'N/A')} ({price_data.get('change_percent', 'N/A')}%)
    Volume: {price_data.get('volume', 'N/A')}
    {warrant_note}
    
    Analysis Type: {analysis_type_label}
    
    Please perform a BRIEF AND CONCISE analysis (maximum 300 words). Briefly summarize the following headings:
    
    1. CURRENT SITUATION (2-3 sentences)
    2. TECHNICAL ANALYSIS (2-3 sentences - {analysis_info['focus']})
    3. PRICE TARGETS (1-2 sentences)
    4. RISKS AND OPPORTUNITIES (2-3 sentences)
    5. RECOMMENDATION (1 sentence)
    
    {lang_instruction} Avoid unnecessary details, only mention important points.
    """
    
    try:
        model = genai.GenerativeModel(model_name)
        response = model.generate_content(prompt)
        analysis_text = response.text
        
        # Add disclaimer at the end
        if language == 'tr':
            disclaimer = "\n\n---\n**UYARI:** Bu analiz yatırım tavsiyesi niteliği taşımamaktadır. Yatırım kararları kendi risk ve sorumluluğunuzdadır."
        else:
            disclaimer = "\n\n---\n**DISCLAIMER:** This analysis does not constitute investment advice. Investment decisions are at your own risk and responsibility."
        
        return analysis_text + disclaimer
    except Exception as e:
        raise Exception(f"Gemini API error: {str(e)}")

