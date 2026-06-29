/**
 * FACCES - Utilitários compartilhados
 * Funções reutilizáveis entre script.js, admin.js e páginas inline
 */

const API_URL = '/api';

// ================================================
// API - Fetch genérico
// ================================================

async function fetchApi(endpoint) {
    const response = await fetch(`${API_URL}${endpoint}`);
    if (!response.ok) throw new Error(`Erro ao carregar ${endpoint}`);
    return response.json();
}

async function enviarApi(endpoint, method, body) {
    const response = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });
    if (!response.ok) throw new Error(`Erro na requisição ${method} ${endpoint}`);
    return response.json();
}

// ================================================
// UI - Notificações
// ================================================

function mostrarErro(mensagem) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #FF6B6B;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        font-weight: bold;
    `;
    errorDiv.textContent = mensagem;
    document.body.appendChild(errorDiv);

    setTimeout(() => errorDiv.remove(), 5000);
}

function mostrarMensagemSucesso(elementId, mensagem, duracao) {
    const el = document.getElementById(elementId);
    if (!el) return;
    el.textContent = mensagem;
    el.classList.add('show');
    setTimeout(() => el.classList.remove('show'), duracao || 3000);
}

// ================================================
// UI - Estados vazios
// ================================================

function renderizarVazio(mensagem) {
    return `
        <div class="admin-empty" style="grid-column: 1/-1;">
            <p>${mensagem}</p>
        </div>
    `;
}

// ================================================
// Conversão de arquivos
// ================================================

function converterParaBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
