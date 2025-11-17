// Analyze page JavaScript
let priceChart = null;
let currentSymbol = null;

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
            showError(t('errorNoSymbol'));
            return;
        }

        // Get selected analysis type
        const selectedType = document.querySelector('input[name="analysis-type"]:checked').value;
        analyzeStock(symbol, selectedType);
    });

    // Question asking functionality
    const askBtn = document.getElementById('ask-btn');
    const questionInput = document.getElementById('question-input');
    const closeSidebarBtn = document.getElementById('close-sidebar');
    const questionSidebar = document.getElementById('question-sidebar');
    
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

    // Close sidebar (minimize)
    if (closeSidebarBtn && questionSidebar) {
        closeSidebarBtn.addEventListener('click', function() {
            questionSidebar.classList.add('hidden');
        });
    }
    
    // Chart period selector
    const periodButtons = document.querySelectorAll('.period-btn');
    periodButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            periodButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const period = this.getAttribute('data-period');
            if (currentSymbol) {
                loadChart(currentSymbol, period);
            }
        });
    });
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
            analysis_type: analysisType,
            language: currentLang
        })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.error || t('errorNoData'));
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
        showError(error.message || t('errorNoData'));
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
        'daily': currentLang === 'tr' ? 'Günlük Analiz' : 'Daily Analysis',
        'weekly': currentLang === 'tr' ? 'Haftalık Analiz' : 'Weekly Analysis',
        'short_term': currentLang === 'tr' ? 'Kısa Vade Analizi' : 'Short Term Analysis',
        'long_term': currentLang === 'tr' ? 'Uzun Vade Analizi' : 'Long Term Analysis'
    };
    const typeLabel = analysisTypeLabels[data.analysis_type] || (currentLang === 'tr' ? 'Analiz' : 'Analysis');

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
    
    // Show sidebar directly (no toggle needed)
    const questionSidebar = document.getElementById('question-sidebar');
    if (questionSidebar) {
        questionSidebar.classList.remove('hidden');
    }
    
    // Load and display chart
    currentSymbol = data.symbol;
    loadChart(data.symbol, '1d');
    
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
        showError(t('errorNoAnalysis'));
        return;
    }
    
    // Disable input and button
    questionInput.disabled = true;
    const askBtn = document.getElementById('ask-btn');
    askBtn.disabled = true;
        askBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${t('answering')}`;
    
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
            price_data: currentAnalysisData.price_data,
            language: currentLang
        })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw new Error(err.error || t('errorAnswering'));
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
        askBtn.innerHTML = `<i class="fas fa-paper-plane"></i> ${t('askBtn')}`;
        questionInput.focus();
    })
    .catch(error => {
        console.error('Error:', error);
        showError(error.message || t('errorAnswering'));
        
        // Re-enable input and button
        questionInput.disabled = false;
        askBtn.disabled = false;
        askBtn.innerHTML = `<i class="fas fa-paper-plane"></i> ${t('askBtn')}`;
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
        </div>` : `<div class="answer-bubble loading-answer"><i class="fas fa-spinner fa-spin"></i> ${t('answering')}</div>`}
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

function loadChart(symbol, period = '1mo') {
    fetch(`/api/history/${symbol}?period=${period}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Chart data not available');
            }
            return response.json();
        })
        .then(data => {
            if (data.error) {
                console.error('Chart error:', data.error);
                return;
            }
            renderChart(data);
        })
        .catch(error => {
            console.error('Error loading chart:', error);
        });
}

function renderChart(data) {
    const ctx = document.getElementById('price-chart');
    if (!ctx) return;
    
    // Destroy existing chart if it exists
    if (priceChart) {
        priceChart.destroy();
    }
    
    // Prepare data
    const labels = data.dates;
    const prices = data.prices;
    
    // Determine color based on price trend
    const firstPrice = prices[0];
    const lastPrice = prices[prices.length - 1];
    const isPositive = lastPrice >= firstPrice;
    const chartColor = isPositive ? '#10b981' : '#ef4444'; // Green or Red
    
    priceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Price',
                data: prices,
                borderColor: chartColor,
                backgroundColor: chartColor + '20',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14
                    },
                    bodyFont: {
                        size: 13
                    },
                    callbacks: {
                        label: function(context) {
                            return `$${context.parsed.y.toFixed(2)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    display: true,
                    grid: {
                        display: false
                    },
                    ticks: {
                        maxTicksLimit: 10,
                        font: {
                            size: 11
                        },
                        color: '#9ca3af'
                    }
                },
                y: {
                    display: true,
                    grid: {
                        color: 'rgba(156, 163, 175, 0.1)'
                    },
                    ticks: {
                        font: {
                            size: 11
                        },
                        color: '#9ca3af',
                        callback: function(value) {
                            return '$' + value.toFixed(2);
                        }
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

