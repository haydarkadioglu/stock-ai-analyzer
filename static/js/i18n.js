// Internationalization (i18n) support for Stock AI Analyzer

const translations = {
    tr: {
        // App Name
        appName: 'Stock AI Analyzer',
        
        // Navigation
        navHome: 'Anasayfa',
        navAnalyze: 'Analiz',
        navSettings: 'Ayarlar',
        
        // Index Page
        pageTitle: 'Anlık Borsa Fiyatları',
        pageSubtitle: 'Gerçek zamanlı hisse senedi ve kripto para fiyatları',
        tabPopular: 'Popüler Hisseler',
        tabCrypto: 'Kripto Paralar',
        tabBorsa: 'Borsa İstanbul',
        loading: 'Yükleniyor...',
        
        // Analyze Page
        analyzeTitle: 'AI Destekli Borsa Analizi',
        analyzeSubtitle: 'Gemini AI ile günlük, haftalık, kısa ve uzun vadeli analiz',
        symbolLabel: 'Borsa Kodu / Sembol',
        symbolPlaceholder: 'Örn: AAPL, BTC, THYAO.IS',
        analysisTypeLabel: 'Analiz Türü Seçin:',
        analysisDaily: 'Günlük',
        analysisWeekly: 'Haftalık',
        analysisShortTerm: 'Kısa Vade',
        analysisLongTerm: 'Uzun Vade',
        dailyPeriod: '1 Gün',
        weeklyPeriod: '1 Hafta',
        shortTermPeriod: '1-3 Ay',
        longTermPeriod: '6-12 Ay',
        analyzeBtn: 'Analiz Yap',
        priceLabel: 'Fiyat:',
        changeLabel: 'Değişim:',
        changePercentLabel: 'Değişim %:',
        analysisReport: 'AI Analiz Raporu',
        priceChart: 'Fiyat Grafiği',
        questionTitle: 'Soru Sor',
        questionPlaceholder: 'Analiz hakkında bir soru sorun...',
        askBtn: 'Sor',
        volume: 'Hacim:',
        marketCap: 'Piyasa Değeri:',
        
        // Settings Page
        settingsTitle: 'Ayarlar',
        settingsSubtitle: 'Gemini API ve model ayarlarını yapılandırın',
        apiKeyLabel: 'Gemini API Key',
        apiKeyPlaceholder: 'API anahtarınızı girin',
        apiKeyHelp: 'API anahtarınızı Google AI Studio\'dan alabilirsiniz',
        modelLabel: 'Model Adı',
        modelPlaceholder: 'gemini-2.5-flash',
        modelHelp: 'Gemini model adını girin (örn: gemini-2.5-flash, gemini-1.5-pro)',
        saveBtn: 'Ayarları Kaydet',
        testBtn: 'Test',
        testApiKeyBtn: 'Test',
        testing: 'Test Ediliyor...',
        testingModel: 'Model test ediliyor...',
        testingApiKey: 'API key test ediliyor...',
        testSuccess: 'Model testi başarılı!',
        testApiKeySuccess: 'API key geçerli!',
        testError: 'Model testi sırasında hata',
        testApiKeyError: 'API key testi sırasında hata',
        errorApiKeyForTest: 'Test için önce API key girin',
        errorApiKeyRequired: 'Lütfen önce API key girin',
        testUnknownError: 'Bilinmeyen bir hata oluştu',
        currentSettings: 'Mevcut Ayarlar',
        apiKeyStatus: 'API Key Durumu',
        currentModel: 'Mevcut Model',
        currentApiKey: 'Mevcut API Key',
        configured: 'Yapılandırıldı',
        notConfigured: 'Yapılandırılmadı',
        
        // Messages
        saving: 'Kaydediliyor...',
        saveSuccess: 'Ayarlar başarıyla kaydedildi!',
        errorNoSymbol: 'Lütfen bir borsa kodu girin.',
        errorNoData: 'Bu sembol için geçerli fiyat verisi bulunamadı. Lütfen farklı bir sembol deneyin.',
        errorApiKey: 'Gemini API key not configured',
        analyzing: 'AI analiz yapılıyor...',
        answering: 'Yanıtlanıyor...',
        errorAnalyzing: 'Analiz yapılırken bir hata oluştu',
        errorAnswering: 'Soru yanıtlanırken bir hata oluştu',
        errorNoAnalysis: 'Önce bir analiz yapmalısınız.',
        errorLoadingSettings: 'Ayarlar yüklenirken bir hata oluştu',
        errorSavingSettings: 'Ayarlar kaydedilirken bir hata oluştu',
        errorNoSettings: 'Lütfen en az bir ayar girin.',
        
        // Disclaimer
        disclaimerTitle: 'Önemli Uyarı',
        disclaimerText: 'Bu uygulamada sunulan analizler ve bilgiler yalnızca bilgilendirme amaçlıdır ve yatırım tavsiyesi niteliği taşımamaktadır. Yatırım kararları kendi risk ve sorumluluğunuzdadır. Lütfen yatırım yapmadan önce profesyonel danışmanlık alınız.',
        disclaimerClose: 'Anladım',
        footerDisclaimer: 'Bu uygulamada sunulan analizler yatırım tavsiyesi niteliği taşımamaktadır.',
        
        // News Analysis
        analyzeNewsBtn: 'İlgili Haberleri Analiz Et',
        newsAnalysisTitle: 'Haber Analizi',
        analyzingNews: 'Haberler analiz ediliyor...',
        errorAnalyzingNews: 'Haberler analiz edilirken bir hata oluştu',
        noNewsFound: 'Bu sembol için haber bulunamadı'
    },
    en: {
        // App Name
        appName: 'Stock AI Analyzer',
        
        // Navigation
        navHome: 'Home',
        navAnalyze: 'Analyze',
        navSettings: 'Settings',
        
        // Index Page
        pageTitle: 'Real-Time Stock Prices',
        pageSubtitle: 'Real-time stock and cryptocurrency prices',
        tabPopular: 'Popular Stocks',
        tabCrypto: 'Cryptocurrencies',
        tabBorsa: 'Istanbul Stock Exchange',
        loading: 'Loading...',
        
        // Analyze Page
        analyzeTitle: 'AI-Powered Stock Analysis',
        analyzeSubtitle: 'Daily, weekly, short-term and long-term analysis with Gemini AI',
        symbolLabel: 'Stock Code / Symbol',
        symbolPlaceholder: 'E.g: AAPL, BTC, THYAO.IS',
        analysisTypeLabel: 'Select Analysis Type:',
        analysisDaily: 'Daily',
        analysisWeekly: 'Weekly',
        analysisShortTerm: 'Short Term',
        analysisLongTerm: 'Long Term',
        dailyPeriod: '1 Day',
        weeklyPeriod: '1 Week',
        shortTermPeriod: '1-3 Months',
        longTermPeriod: '6-12 Months',
        analyzeBtn: 'Analyze',
        priceLabel: 'Price:',
        changeLabel: 'Change:',
        changePercentLabel: 'Change %:',
        analysisReport: 'AI Analysis Report',
        priceChart: 'Price Chart',
        questionTitle: 'Ask Question',
        questionPlaceholder: 'Ask a question about the analysis...',
        askBtn: 'Ask',
        volume: 'Volume:',
        marketCap: 'Market Cap:',
        
        // Settings Page
        settingsTitle: 'Settings',
        settingsSubtitle: 'Configure Gemini API and model settings',
        apiKeyLabel: 'Gemini API Key',
        apiKeyPlaceholder: 'Enter your API key',
        apiKeyHelp: 'You can get your API key from Google AI Studio',
        modelLabel: 'Model Name',
        modelPlaceholder: 'gemini-2.5-flash',
        modelHelp: 'Enter the Gemini model name (e.g., gemini-2.5-flash, gemini-1.5-pro)',
        saveBtn: 'Save Settings',
        testBtn: 'Test',
        testApiKeyBtn: 'Test',
        testing: 'Testing...',
        testingModel: 'Testing model...',
        testingApiKey: 'Testing API key...',
        testSuccess: 'Model test successful!',
        testApiKeySuccess: 'API key is valid!',
        testError: 'Error testing model',
        testApiKeyError: 'Error testing API key',
        errorApiKeyForTest: 'Please enter API key first for testing',
        errorApiKeyRequired: 'Please enter API key first',
        testUnknownError: 'An unknown error occurred',
        currentSettings: 'Current Settings',
        apiKeyStatus: 'API Key Status',
        currentModel: 'Current Model',
        currentApiKey: 'Current API Key',
        configured: 'Configured',
        notConfigured: 'Not Configured',
        
        // Messages
        saving: 'Saving...',
        saveSuccess: 'Settings saved successfully!',
        errorNoSymbol: 'Please enter a stock code.',
        errorNoData: 'No valid price data found for this symbol. Please try a different symbol.',
        errorApiKey: 'Gemini API key not configured',
        analyzing: 'AI is analyzing...',
        answering: 'Answering...',
        errorAnalyzing: 'An error occurred while analyzing',
        errorAnswering: 'An error occurred while answering the question',
        errorNoAnalysis: 'You must perform an analysis first.',
        errorLoadingSettings: 'An error occurred while loading settings',
        errorSavingSettings: 'An error occurred while saving settings',
        errorNoSettings: 'Please enter at least one setting.',
        
        // Disclaimer
        disclaimerTitle: 'Important Notice',
        disclaimerText: 'The analyses and information provided in this application are for informational purposes only and do not constitute investment advice. Investment decisions are at your own risk and responsibility. Please consult a professional advisor before making any investment.',
        disclaimerClose: 'I Understand',
        footerDisclaimer: 'The analyses provided in this application do not constitute investment advice.',
        
        // News Analysis
        analyzeNewsBtn: 'Analyze Related News',
        newsAnalysisTitle: 'News Analysis',
        analyzingNews: 'Analyzing news...',
        errorAnalyzingNews: 'An error occurred while analyzing news',
        noNewsFound: 'No news found for this symbol'
    }
};

// Get current language from localStorage or default to Turkish
let currentLang = localStorage.getItem('language') || 'tr';

// Function to change language
function setLanguage(lang) {
    if (!translations[lang]) return;
    currentLang = lang;
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    updatePageLanguage();
}

// Function to get translation
function t(key) {
    return translations[currentLang][key] || key;
}

// Function to update all translatable elements
function updatePageLanguage() {
    // Update elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = t(key);
        element.textContent = translation;
    });
    
    // Update elements with data-i18n-placeholder attribute
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        const translation = t(key);
        element.placeholder = translation;
    });
    
    // Update language buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeLangBtn = document.getElementById(`lang-${currentLang}`);
    if (activeLangBtn) {
        activeLangBtn.classList.add('active');
    }
    
    // Update page title
    const page = window.location.pathname;
    if (page === '/') {
        document.title = `${t('appName')} - ${t('navHome')}`;
    } else if (page === '/analyze') {
        document.title = `${t('appName')} - ${t('navAnalyze')}`;
    } else if (page === '/settings') {
        document.title = `${t('appName')} - ${t('navSettings')}`;
    }
}

// Show disclaimer modal on first visit
function showDisclaimerModal() {
    const disclaimerShown = localStorage.getItem('disclaimerShown');
    if (!disclaimerShown) {
        const modal = document.getElementById('disclaimer-modal');
        if (modal) {
            modal.classList.remove('hidden');
        }
    }
}

// Close disclaimer modal
function closeDisclaimerModal() {
    const modal = document.getElementById('disclaimer-modal');
    if (modal) {
        modal.classList.add('hidden');
        localStorage.setItem('disclaimerShown', 'true');
    }
}

// Initialize language and disclaimer on page load
document.addEventListener('DOMContentLoaded', function() {
    document.documentElement.lang = currentLang;
    updatePageLanguage();
    
    // Show disclaimer modal
    showDisclaimerModal();
    
    // Add event listener for close button
    const closeBtn = document.getElementById('disclaimer-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeDisclaimerModal);
    }
    
    // Close modal on background click
    const modal = document.getElementById('disclaimer-modal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeDisclaimerModal();
            }
        });
    }
});

