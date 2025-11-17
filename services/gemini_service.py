"""Gemini AI service for stock analysis"""
import google.generativeai as genai
from config import GEMINI_API_KEY, GEMINI_MODEL


def configure_gemini(api_key=None):
    """Configure Gemini API"""
    key = api_key or GEMINI_API_KEY
    if key:
        genai.configure(api_key=key)


def ask_question(symbol, price_data, analysis_text, question, model_name=None):
    """Ask a follow-up question about the analysis"""
    model_name = model_name or GEMINI_MODEL
    
    # Configure Gemini
    configure_gemini()
    
    prompt = f"""
    Sen bir finansal analiz uzmanısın. Aşağıdaki analiz raporu hakkında kullanıcının sorusunu yanıtla:

    Sembol: {symbol}
    Mevcut Fiyat: ${price_data.get('price', 'N/A')}
    Değişim: {price_data.get('change', 'N/A')} ({price_data.get('change_percent', 'N/A')}%)
    
    ÖNCEKİ ANALİZ RAPORU:
    {analysis_text}
    
    KULLANICI SORUSU: {question}
    
    Lütfen kullanıcının sorusunu, önceki analiz raporuna dayanarak kısa ve net bir şekilde (maksimum 150 kelime) yanıtla.
    Türkçe olarak, profesyonel ama anlaşılır bir dille cevap ver.
    """
    
    try:
        model = genai.GenerativeModel(model_name)
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        raise Exception(f"Gemini API error: {str(e)}")


def analyze_stock(symbol, price_data, analysis_type='short_term', model_name=None):
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
        warrant_note = "\n\nNOT: Bu bir varant (warrant) sembolüdür. Varantlar, dayanak varlığa (örneğin KOZAL) dayalı türev enstrümanlardır. Varant analizinde dayanak varlığın performansı, vade tarihi, kullanım fiyatı ve varantın kaldıracı gibi faktörleri değerlendir."
    
    # Create analysis prompt - Kısa ve öz
    prompt = f"""
    Sen bir finansal analiz uzmanısın. Aşağıdaki hisse senedi/kripto para hakkında {analysis_info['title']} yap:

    Sembol: {symbol}
    Mevcut Fiyat: ${price_data.get('price', 'N/A')}
    Değişim: {price_data.get('change', 'N/A')} ({price_data.get('change_percent', 'N/A')}%)
    Hacim: {price_data.get('volume', 'N/A')}
    {warrant_note}
    
    Analiz Türü: {analysis_info['title']}
    
    Lütfen KISA VE ÖZ bir analiz yap (maksimum 300 kelime). Şu başlıkları kısaca özetle:
    
    1. MEVCUT DURUM (2-3 cümle)
    2. TEKNİK ANALİZ (2-3 cümle - {analysis_info['focus']})
    3. FİYAT HEDEFLERİ (1-2 cümle)
    4. RİSKLER VE FIRSATLAR (2-3 cümle)
    5. ÖNERİ (1 cümle)
    
    Analizi Türkçe olarak, profesyonel ama kısa ve öz bir şekilde sun. Gereksiz detaylardan kaçın, sadece önemli noktaları belirt.
    """
    
    try:
        model = genai.GenerativeModel(model_name)
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        raise Exception(f"Gemini API error: {str(e)}")

