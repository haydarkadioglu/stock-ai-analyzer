// Analyze page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const analyzeBtn = document.getElementById('analyze-btn');
    const symbolInput = document.getElementById('symbol-input');
    const analysisResult = document.getElementById('analysis-result');
    const errorMessage = document.getElementById('error-message');
    const loadingOverlay = document.getElementById('loading');

    // Enter key to analyze
    symbolInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            analyzeBtn.click();
        }
    });

    analyzeBtn.addEventListener('click', function() {
        const symbol = symbolInput.value.trim().toUpperCase();
        
        if (!symbol) {
            showError('Lütfen bir borsa kodu girin.');
            return;
        }

        // Get selected analysis type
        const selectedType = document.querySelector('input[name="analysis-type"]:checked').value;
        analyzeStock(symbol, selectedType);
    });

    // Question asking functionality
    const askBtn = document.getElementById('ask-btn');
    const questionInput = document.getElementById('question-input');
    
    if (askBtn && questionInput) {
        askBtn.addEventListener('click', function() {
            askQuestion();
        });
        
        questionInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                askQuestion();
            }
        });
    }
});

// Store current analysis data for questions
let currentAnalysisData = null;

function analyzeStock(symbol, analysisType = 'short_term') {
    const analysisResult = document.getElementById('analysis-result');
    const errorMessage = document.getElementById('error-message');
    const loadingOverlay = document.getElementById('loading');

    // Hide previous results
    analysisResult.classList.add('hidden');
    errorMessage.classList.add('hidden');
    loadingOverlay.classList.remove('hidden');

    fetch('/api/analyze', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            symbol: symbol,
            analysis_type: analysisType
        })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.error || 'Veri bulunamadı');
            });
        }
        return response.json();
    })
    .then(data => {
        loadingOverlay.classList.add('hidden');
        
        if (data.error) {
            showError(data.error);
            return;
        }

        displayAnalysis(data);
    })
    .catch(error => {
        loadingOverlay.classList.add('hidden');
        console.error('Error:', error);
        showError(error.message || 'Bu sembol için veri bulunamadı. Lütfen farklı bir sembol deneyin.');
    });
}

function displayAnalysis(data) {
    const analysisResult = document.getElementById('analysis-result');
    const symbolName = document.getElementById('symbol-name');
    const currentPrice = document.getElementById('current-price');
    const priceChange = document.getElementById('price-change');
    const priceChangePercent = document.getElementById('price-change-percent');
    const analysisText = document.getElementById('analysis-text');

    // Get analysis type label
    const analysisTypeLabels = {
        'daily': 'Günlük Analiz',
        'weekly': 'Haftalık Analiz',
        'short_term': 'Kısa Vade Analizi',
        'long_term': 'Uzun Vade Analizi'
    };
    const typeLabel = analysisTypeLabels[data.analysis_type] || 'Analiz';

    // Display price info with analysis type
    symbolName.textContent = `${data.symbol} - ${typeLabel}`;
    currentPrice.textContent = `$${formatNumber(data.price_data.price)}`;
    
    const change = data.price_data.change || 0;
    const changePercent = data.price_data.change_percent || 0;
    const changeClass = changePercent >= 0 ? 'positive' : 'negative';
    const changeSign = changePercent >= 0 ? '+' : '';

    priceChange.innerHTML = `<span class="${changeClass}">${changeSign}${change.toFixed(2)}</span>`;
    priceChangePercent.innerHTML = `<span class="${changeClass}">${changeSign}${changePercent.toFixed(2)}%</span>`;

    // Display analysis
    analysisText.innerHTML = formatAnalysisText(data.analysis);

    // Store analysis data for questions
    currentAnalysisData = {
        symbol: data.symbol,
        price_data: data.price_data,
        analysis: data.analysis
    };

    // Clear previous questions
    const questionsContainer = document.getElementById('questions-container');
    if (questionsContainer) {
        questionsContainer.innerHTML = '';
    }

    // Show result
    analysisResult.classList.remove('hidden');
    analysisResult.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function formatAnalysisText(text) {
    // Format the analysis text with proper HTML
    let formatted = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');

    // Add headings
    formatted = formatted.replace(/(\d+\.\s+[A-ZÇĞİÖŞÜ][^:]+:)/g, '<h4>$1</h4>');

    return '<p>' + formatted + '</p>';
}

function showError(message) {
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}

function askQuestion() {
    const questionInput = document.getElementById('question-input');
    const question = questionInput.value.trim();
    
    if (!question) {
        return;
    }
    
    if (!currentAnalysisData) {
        showError('Önce bir analiz yapmalısınız.');
        return;
    }
    
    // Disable input and button
    questionInput.disabled = true;
    const askBtn = document.getElementById('ask-btn');
    askBtn.disabled = true;
    askBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Yanıtlanıyor...';
    
    // Add question to UI
    addQuestionToUI(question, null);
    
    // Clear input
    questionInput.value = '';
    
    fetch('/api/ask-question', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            symbol: currentAnalysisData.symbol,
            question: question,
            analysis_text: currentAnalysisData.analysis,
            price_data: currentAnalysisData.price_data
        })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.error || 'Soru yanıtlanırken bir hata oluştu');
            });
        }
        return response.json();
    })
    .then(data => {
        // Update answer in UI
        updateQuestionAnswer(question, data.answer);
        
        // Re-enable input and button
        questionInput.disabled = false;
        askBtn.disabled = false;
        askBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Sor';
        questionInput.focus();
    })
    .catch(error => {
        console.error('Error:', error);
        showError(error.message || 'Soru yanıtlanırken bir hata oluştu.');
        
        // Re-enable input and button
        questionInput.disabled = false;
        askBtn.disabled = false;
        askBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Sor';
    });
}

function addQuestionToUI(question, answer) {
    const questionsContainer = document.getElementById('questions-container');
    if (!questionsContainer) return;
    
    const questionDiv = document.createElement('div');
    questionDiv.className = 'question-item';
    questionDiv.innerHTML = `
        <div class="question-bubble">
            <i class="fas fa-user"></i>
            <div class="question-text">${question}</div>
        </div>
        ${answer ? `<div class="answer-bubble">
            <i class="fas fa-robot"></i>
            <div class="answer-text">${formatAnalysisText(answer)}</div>
        </div>` : '<div class="answer-bubble loading-answer"><i class="fas fa-spinner fa-spin"></i> Yanıtlanıyor...</div>'}
    `;
    
    questionsContainer.appendChild(questionDiv);
    questionDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function updateQuestionAnswer(question, answer) {
    const questionsContainer = document.getElementById('questions-container');
    if (!questionsContainer) return;
    
    const questionItems = questionsContainer.querySelectorAll('.question-item');
    questionItems.forEach(item => {
        const questionText = item.querySelector('.question-text');
        if (questionText && questionText.textContent.trim() === question.trim()) {
            const answerDiv = item.querySelector('.answer-bubble');
            if (answerDiv) {
                answerDiv.className = 'answer-bubble';
                answerDiv.innerHTML = `
                    <i class="fas fa-robot"></i>
                    <div class="answer-text">${formatAnalysisText(answer)}</div>
                `;
            }
        }
    });
}

function formatNumber(num) {
    if (num >= 1e12) {
        return (num / 1e12).toFixed(2) + 'T';
    } else if (num >= 1e9) {
        return (num / 1e9).toFixed(2) + 'B';
    } else if (num >= 1e6) {
        return (num / 1e6).toFixed(2) + 'M';
    } else if (num >= 1e3) {
        return (num / 1e3).toFixed(2) + 'K';
    }
    return num.toFixed(2);
}

