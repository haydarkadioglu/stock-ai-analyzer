// Main page JavaScript
let updateInterval;

document.addEventListener('DOMContentLoaded', function() {
    // Tab switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabButtons.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            btn.classList.add('active');
            document.getElementById(`${tabId}-tab`).classList.add('active');
            
            // Load data for the active tab
            loadTabData(tabId);
        });
    });

    // Load initial data
    loadTabData('popular');

    // Auto-refresh every 30 seconds
    updateInterval = setInterval(() => {
        const activeTab = document.querySelector('.tab-btn.active');
        if (activeTab) {
            const tabId = activeTab.getAttribute('data-tab');
            loadTabData(tabId);
        }
    }, 30000);
});

function loadTabData(tabId) {
    let endpoint;
    let gridId;

    switch(tabId) {
        case 'popular':
            endpoint = '/api/prices/popular';
            gridId = 'popular-grid';
            break;
        case 'crypto':
            endpoint = '/api/prices/crypto';
            gridId = 'crypto-grid';
            break;
        case 'borsa':
            endpoint = '/api/prices/borsa-istanbul';
            gridId = 'borsa-grid';
            break;
    }

    const grid = document.getElementById(gridId);
    grid.innerHTML = `<div class="loading"><i class="fas fa-spinner fa-spin"></i> ${t('loading')}</div>`;

    fetch(endpoint)
        .then(response => response.json())
        .then(data => {
            displayPrices(data, gridId);
        })
        .catch(error => {
            console.error('Error:', error);
            grid.innerHTML = `<div class="error-message">${t('errorAnalyzing')}</div>`;
        });
}

function displayPrices(data, gridId) {
    const grid = document.getElementById(gridId);
    
    if (Object.keys(data).length === 0) {
        grid.innerHTML = `<div class="loading">${t('errorNoData')}</div>`;
        return;
    }

    grid.innerHTML = '';

    Object.entries(data).forEach(([symbol, info]) => {
        const card = createPriceCard(symbol, info);
        grid.appendChild(card);
    });
}

function createPriceCard(symbol, info) {
    const card = document.createElement('div');
    card.className = 'price-card';

    const changeClass = info.change_percent >= 0 ? 'positive' : 'negative';
    const changeIcon = info.change_percent >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';
    const changeSign = info.change_percent >= 0 ? '+' : '';

    const volume = info.volume ? formatNumber(info.volume) : 'N/A';
    const marketCap = info.market_cap ? formatNumber(info.market_cap) : '';

    card.innerHTML = `
        <div class="price-card-header">
            <div>
                <div class="price-card-title">${info.name}</div>
            </div>
            <div class="price-card-symbol">${symbol}</div>
        </div>
        <div class="price-card-price">$${formatNumber(info.price)}</div>
        <div class="price-card-change ${changeClass}">
            <i class="fas ${changeIcon}"></i>
            <span>${changeSign}${info.change_percent.toFixed(2)}%</span>
            <span>(${changeSign}${info.change.toFixed(2)})</span>
        </div>
        ${volume !== 'N/A' ? `<div class="price-card-volume">${t('volume')} ${volume}</div>` : ''}
        ${marketCap ? `<div class="price-card-volume">${t('marketCap')} ${marketCap}</div>` : ''}
    `;

    return card;
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

