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
            // Clear API key field for security
            if (apiKey) {
                document.getElementById('api-key').value = '';
            }
            // Reload current settings
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

