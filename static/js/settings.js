// Settings page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const settingsForm = document.getElementById('settings-form');
    const statusMessage = document.getElementById('status-message');

    // Load current settings
    loadCurrentSettings();

    settingsForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const apiKey = document.getElementById('api-key').value.trim();
        const modelName = document.getElementById('model-name').value.trim();

        if (!apiKey && !modelName) {
            showStatus(t('errorNoSettings'), 'error');
            return;
        }

        saveSettings(apiKey, modelName);
    });
});

function loadCurrentSettings() {
    const currentSettings = document.getElementById('current-settings');
    currentSettings.innerHTML = `<div class="loading"><i class="fas fa-spinner fa-spin"></i> ${t('loading')}</div>`;

    fetch('/api/settings')
        .then(response => response.json())
        .then(data => {
            displayCurrentSettings(data);
        })
        .catch(error => {
            console.error('Error:', error);
            currentSettings.innerHTML = `<div class="error-message">${t('errorLoadingSettings')}</div>`;
        });
}

function displayCurrentSettings(data) {
    const currentSettings = document.getElementById('current-settings');
    const apiKeyDisplay = document.getElementById('api-key-display');
    
    // Set model input value from env
    const modelInput = document.getElementById('model-name');
    if (modelInput && data.model) {
        modelInput.value = data.model;
    }
    
    // Store API key configuration status for test functions
    window.apiKeyConfigured = data.api_key_configured;
    
    // Display masked API key if configured
    if (apiKeyDisplay && data.api_key_configured && data.api_key_masked) {
        apiKeyDisplay.innerHTML = `
            <div class="api-key-masked">
                <i class="fas fa-key"></i>
                <span class="masked-key">${data.api_key_masked}</span>
                <small>${t('currentApiKey')}</small>
            </div>
        `;
        apiKeyDisplay.classList.remove('hidden');
    } else if (apiKeyDisplay) {
        apiKeyDisplay.classList.add('hidden');
    }
    
    currentSettings.innerHTML = `
        <div class="setting-item">
            <span class="label">${t('apiKeyStatus')}:</span>
            <span class="status ${data.api_key_configured}">
                ${data.api_key_configured ? t('configured') : t('notConfigured')}
            </span>
        </div>
        <div class="setting-item">
            <span class="label">${t('currentModel')}:</span>
            <span class="value">${data.model}</span>
        </div>
    `;
}

function saveSettings(apiKey, modelName) {
    const statusMessage = document.getElementById('status-message');
    statusMessage.textContent = t('saving');
    statusMessage.className = 'status-message';
    statusMessage.style.display = 'block';

    const payload = {};
    if (apiKey) payload.api_key = apiKey;
    if (modelName) payload.model = modelName;

    fetch('/api/settings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            showStatus(data.error, 'error');
        } else {
            showStatus(data.message || t('saveSuccess'), 'success');
            // Clear API key field for security (only if it was entered)
            if (apiKey) {
                document.getElementById('api-key').value = '';
                // Hide test result
                const apiKeyTestResult = document.getElementById('api-key-test-result');
                if (apiKeyTestResult) {
                    apiKeyTestResult.classList.add('hidden');
                }
            }
            // Reload current settings to show masked API key
            loadCurrentSettings();
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showStatus(`${t('errorSavingSettings')}: ${error.message}`, 'error');
    });
}

function showStatus(message, type) {
    const statusMessage = document.getElementById('status-message');
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    statusMessage.style.display = 'block';

    // Auto-hide after 5 seconds
    setTimeout(() => {
        statusMessage.style.display = 'none';
    }, 5000);
}

function testApiKey() {
    const apiKeyInput = document.getElementById('api-key').value.trim();
    const testResult = document.getElementById('api-key-test-result');
    const testBtn = document.getElementById('test-api-key-btn');
    
    // Check if we have API key in input or env
    const apiKeyConfigured = window.apiKeyConfigured || false;
    if (!apiKeyInput && !apiKeyConfigured) {
        testResult.className = 'test-result error';
        testResult.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${typeof t !== 'undefined' ? t('errorApiKeyRequired') : 'Please enter API key first'}`;
        testResult.classList.remove('hidden');
        return;
    }
    
    // Disable button and show loading
    testBtn.disabled = true;
    testBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${typeof t !== 'undefined' ? t('testing') : 'Testing...'}`;
    testResult.className = 'test-result info';
    testResult.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${typeof t !== 'undefined' ? t('testingApiKey') : 'Testing API key...'}`;
    testResult.classList.remove('hidden');
    
    // Prepare payload - if input has value, use it; otherwise backend will use env
    const payload = {};
    if (apiKeyInput) {
        payload.api_key = apiKeyInput;
    }
    
    // Test API key via API
    fetch('/api/settings/test-api-key', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        testBtn.disabled = false;
        testBtn.innerHTML = `<i class="fas fa-vial"></i> <span>${typeof t !== 'undefined' ? t('testApiKeyBtn') : 'Test'}</span>`;
        
        if (data.error) {
            testResult.className = 'test-result error';
            testResult.innerHTML = `<i class="fas fa-times-circle"></i> ${data.error}`;
        } else if (data.success) {
            testResult.className = 'test-result success';
            testResult.innerHTML = `<i class="fas fa-check-circle"></i> ${data.message || (typeof t !== 'undefined' ? t('testApiKeySuccess') : 'API key is valid!')}`;
        } else {
            testResult.className = 'test-result error';
            testResult.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${typeof t !== 'undefined' ? t('testUnknownError') : 'Unknown error occurred'}`;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        testBtn.disabled = false;
        testBtn.innerHTML = `<i class="fas fa-vial"></i> <span>${typeof t !== 'undefined' ? t('testApiKeyBtn') : 'Test'}</span>`;
        testResult.className = 'test-result error';
        testResult.innerHTML = `<i class="fas fa-times-circle"></i> ${typeof t !== 'undefined' ? t('testApiKeyError') : 'Error testing API key'}: ${error.message}`;
    });
}

function testModel() {
    const apiKeyInput = document.getElementById('api-key').value.trim();
    const modelInput = document.getElementById('model-name');
    const modelName = modelInput ? modelInput.value.trim() : '';
    const testResult = document.getElementById('test-result');
    const testBtn = document.getElementById('test-model-btn');
    
    // Use model from input value (should be set from env if available)
    const modelToTest = modelName || 'gemini-2.5-flash';
    
    if (!modelToTest) {
        testResult.className = 'test-result error';
        testResult.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${typeof t !== 'undefined' ? 'Lütfen model adı girin' : 'Please enter model name'}`;
        testResult.classList.remove('hidden');
        return;
    }
    
    // Get API key from input (optional if already configured in env)
    const apiKeyConfigured = window.apiKeyConfigured || false;
    let apiKey = apiKeyInput;
    if (!apiKey && !apiKeyConfigured) {
        testResult.className = 'test-result error';
        testResult.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${typeof t !== 'undefined' ? t('errorApiKeyRequired') : 'Please enter API key first'}`;
        testResult.classList.remove('hidden');
        return;
    }
    
    // Disable button and show loading
    testBtn.disabled = true;
    testBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${typeof t !== 'undefined' ? t('testing') : 'Testing...'}`;
    testResult.className = 'test-result info';
    testResult.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${typeof t !== 'undefined' ? t('testingModel') : 'Testing model...'}`;
    testResult.classList.remove('hidden');
    
    // Test model via API (API key is optional if already configured)
    const payload = { model: modelToTest };
    if (apiKey) {
        payload.api_key = apiKey;
    }
    
    fetch('/api/settings/test-model', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        testBtn.disabled = false;
        testBtn.innerHTML = `<i class="fas fa-vial"></i> <span>${typeof t !== 'undefined' ? t('testBtn') : 'Test'}</span>`;
        
        if (data.error) {
            testResult.className = 'test-result error';
            testResult.innerHTML = `<i class="fas fa-times-circle"></i> ${data.error}`;
        } else if (data.success) {
            testResult.className = 'test-result success';
            testResult.innerHTML = `<i class="fas fa-check-circle"></i> ${data.message || (typeof t !== 'undefined' ? t('testSuccess') : 'Model test successful!')}`;
        } else {
            testResult.className = 'test-result error';
            testResult.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${typeof t !== 'undefined' ? t('testUnknownError') : 'Unknown error occurred'}`;
        }
    })
    .catch(error => {
        console.error('Error:', error);
        testBtn.disabled = false;
        testBtn.innerHTML = `<i class="fas fa-vial"></i> <span>${typeof t !== 'undefined' ? t('testBtn') : 'Test'}</span>`;
        testResult.className = 'test-result error';
        testResult.innerHTML = `<i class="fas fa-times-circle"></i> ${typeof t !== 'undefined' ? t('testError') : 'Error testing model'}: ${error.message}`;
    });
}

