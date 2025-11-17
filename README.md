# Borsa Analiz Uygulaması

Modern ve estetik bir borsa analiz uygulaması. Popüler hisse senetleri, kripto paralar ve Borsa İstanbul'dan anlık fiyatları gösterir ve Gemini AI ile detaylı analiz yapar.

## Özellikler

- 📊 **Anlık Fiyatlar**: Popüler hisse senetleri, kripto paralar ve Borsa İstanbul için gerçek zamanlı fiyatlar
- 🤖 **AI Analiz**: Gemini AI ile kısa ve uzun vadeli analiz, risk değerlendirmesi
- ⚙️ **Ayarlar**: API anahtarı ve model adını uygulama üzerinden yönetme
- 🎨 **Modern UI**: Estetik ve kullanıcı dostu arayüz

## Proje Yapısı

```
stockmarket/
├── app.py                 # Ana Flask uygulaması
├── config.py              # Konfigürasyon ve sabitler
├── requirements.txt       # Python bağımlılıkları
├── .env                   # Ortam değişkenleri (oluşturulacak)
├── .env.example           # Örnek ortam değişkenleri
├── services/              # Servis katmanı
│   ├── stock_service.py   # Hisse senedi fiyat servisi
│   ├── crypto_service.py  # Kripto para fiyat servisi
│   ├── gemini_service.py # Gemini AI analiz servisi
│   └── settings_service.py # Ayarlar yönetim servisi
├── routes/                # Route'lar (Blueprint'ler)
│   ├── pages.py           # Sayfa route'ları
│   ├── prices.py          # Fiyat API route'ları
│   ├── analysis.py        # Analiz API route'ları
│   └── settings.py        # Ayarlar API route'ları
├── templates/             # HTML şablonları
└── static/                # CSS, JS, görseller
    ├── css/
    └── js/
```

## Kurulum

1. Bağımlılıkları yükleyin:
```bash
pip install -r requirements.txt
```

2. `.env` dosyası oluşturun:
```bash
cp .env.example .env
```

3. `.env` dosyasını düzenleyip Gemini API anahtarınızı ekleyin:
```
GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

## Çalıştırma

```bash
python app.py
```

Uygulama `http://localhost:5000` adresinde çalışacaktır.

## API Endpoints

### Fiyat Endpoints
- `GET /api/prices/popular` - Popüler hisse senetleri
- `GET /api/prices/crypto` - Popüler kripto paralar
- `GET /api/prices/borsa-istanbul` - Borsa İstanbul hisseleri
- `GET /api/prices/<symbol>` - Belirli bir sembol için fiyat

### Analiz Endpoints
- `POST /api/analyze` - Gemini AI ile analiz yap
  ```json
  {
    "symbol": "AAPL"
  }
  ```

### Ayarlar Endpoints
- `GET /api/settings` - Mevcut ayarları getir
- `POST /api/settings` - Ayarları güncelle
  ```json
  {
    "api_key": "your_api_key",
    "model": "gemini-2.5-flash"
  }
  ```

## Kullanılan Teknolojiler

- **Flask**: Web framework
- **yfinance**: Yahoo Finance API
- **ccxt**: Kripto para borsaları API
- **Google Generative AI**: Gemini AI entegrasyonu
- **Python-dotenv**: Ortam değişkenleri yönetimi

## Lisans

MIT

