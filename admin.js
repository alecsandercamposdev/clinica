/**
 * FACCES Admin Panel - JavaScript
 * Gerenciar profissionais com CRUD completo
 * Integração com API REST
 *
 * Depende de: utils.js (fetchApi, enviarApi, mostrarErro,
 *             mostrarMensagemSucesso, renderizarVazio, converterParaBase64)
 */

let profissionalEditId = null;
let videoEditId = null;
let fotoOriginalProfissional = null;

/**
 * Verificar se usuário está autenticado
 */
function verificarAutenticacao() {
    if (localStorage.getItem('adminAutenticado') !== 'true') {
        window.location.href = 'admin-login.html';
    }
    
    const usuario = localStorage.getItem('adminUsuario');
    document.getElementById('usuarioLogado').textContent = usuario || 'admin';
}

/**
 * Logout
 */
function logout() {
    if (confirm('Tem certeza que deseja sair?')) {
        localStorage.removeItem('adminAutenticado');
        localStorage.removeItem('adminUsuario');
        window.location.href = 'admin-login.html';
    }
}

// ================================================
// CARREGAMENTO DE DADOS
// ================================================

async function carregarProfissionais() {
    try {
        return await fetchApi('/profissionais');
    } catch (erro) {
        console.error('Erro ao carregar profissionais:', erro);
        mostrarErro('Erro ao conectar com o banco de dados. Verifique se o servidor está rodando.');
        return [];
    }
}

async function carregarVideos() {
    try {
        return await fetchApi('/videos');
    } catch (erro) {
        console.error('Erro ao carregar vídeos:', erro);
        mostrarErro('Erro ao conectar com o banco de dados');
        return [];
    }
}

// ================================================
// DASHBOARD
// ================================================

async function atualizarDashboard() {
    try {
        const profissionais = await carregarProfissionais();
        const elemProf = document.getElementById('totalProfissionais');
        if (elemProf) elemProf.textContent = profissionais.length;
        
        const metricas = await fetchApi('/metricas/total/geral');
        
        const elemAcessos = document.getElementById('totalAcessos');
        const elemConversoes = document.getElementById('totalConversoes');
        const elemTaxa = document.getElementById('taxaConversao');
        
        if (elemAcessos) elemAcessos.textContent = metricas.totalAcessos;
        if (elemConversoes) elemConversoes.textContent = metricas.totalConversoes;
        if (elemTaxa) elemTaxa.textContent = metricas.taxaConversao + '%';
    } catch (erro) {
        console.error('Erro ao atualizar dashboard:', erro);
    }
}

// ================================================
// PROFISSIONAIS - CRUD
// ================================================

async function listarProfissionais() {
    const profissionais = await carregarProfissionais();
    const lista = document.getElementById('profissionaisList');
    
    if (profissionais.length === 0) {
        lista.innerHTML = renderizarVazio('Nenhum profissional cadastrado ainda.') +
            '<p style="text-align:center;color:var(--cor-texto-light);">Use a opção "Novo Profissional" para adicionar.</p>';
        return;
    }
    
    lista.innerHTML = profissionais.map(prof => `
        <div class="profissional-item">
            <div class="profissional-item-img">
                ${prof.foto ? `<img src="${prof.foto}" alt="${prof.nome}">` : '👤'}
            </div>
            <div class="profissional-item-info">
                <div class="profissional-item-name">${prof.nome}</div>
                <div class="profissional-item-specialty">${prof.especialidade}</div>
                <div class="profissional-item-cro">${prof.cadastroMedico}</div>
                <div class="profissional-item-actions">
                    <button class="btn-edit" onclick="editarProfissional(${prof.id})">✏️ Editar</button>
                    <button class="btn-delete" onclick="deletarProfissional(${prof.id})">🗑️ Deletar</button>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Preview da foto ao adicionar
 */
document.getElementById('foto')?.addEventListener('change', async function(e) {
    const file = e.target.files[0];
    if (file) {
        const preview = document.getElementById('fotoPreview');
        const base64 = await converterParaBase64(file);
        preview.innerHTML = `<img src="${base64}" alt="Preview">`;
    }
});

/**
 * Preview da foto ao editar
 */
document.getElementById('editFoto')?.addEventListener('change', async function(e) {
    const file = e.target.files[0];
    if (file) {
        const preview = document.getElementById('editFotoPreview');
        const base64 = await converterParaBase64(file);
        preview.innerHTML = `<img src="${base64}" alt="Preview">`;
    }
});

/**
 * Adicionar novo profissional
 */
document.getElementById('profissionalForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const fotoFile = document.getElementById('foto').files[0];
    if (!fotoFile) {
        mostrarErro('Por favor, selecione uma foto!');
        return;
    }
    
    const fotoBase64 = await converterParaBase64(fotoFile);
    
    const novoProfissional = {
        nome: document.getElementById('nome').value,
        especialidade: document.getElementById('especialidade').value,
        cadastroMedico: document.getElementById('cadastro').value,
        apresentacao: document.getElementById('apresentacao').value,
        atuacao: document.getElementById('atuacao').value,
        foto: fotoBase64
    };
    
    try {
        await enviarApi('/profissionais', 'POST', novoProfissional);

        mostrarMensagemSucesso('successMsg', '✅ Profissional cadastrado com sucesso!');
        
        document.getElementById('profissionalForm').reset();
        document.getElementById('fotoPreview').innerHTML = '';
        
        atualizarDashboard();
        listarProfissionais();
    } catch (erro) {
        mostrarErro('Erro ao cadastrar profissional: ' + erro.message);
    }
});

/**
 * Editar profissional
 */
async function editarProfissional(id) {
    const profissionais = await carregarProfissionais();
    const profissional = profissionais.find(p => p.id === id);
    
    if (!profissional) return;
    
    profissionalEditId = id;
    fotoOriginalProfissional = profissional.foto;
    // Preencher formulário de edição
    document.getElementById('editNome').value = profissional.nome;
    document.getElementById('editEspecialidade').value = profissional.especialidade;
    document.getElementById('editCadastro').value = profissional.cadastromedico;
    document.getElementById('editApresentacao').value = profissional.apresentacao;
    document.getElementById('editAtuacao').value = profissional.atuacao;
    document.getElementById('editNome').value = profissional.nome;
    // Mostrar preview da foto atual
    if (profissional.foto) {
        document.getElementById('editFotoPreview').innerHTML = `<img src="${profissional.foto}" alt="Preview">`;
    }
    
    // Mudar para seção de edição
    mostrarSecao('editar');
    window.scrollTo(0, 0);
}

/**
 * Cancelar edição
 */
function cancelarEdicao() {
    profissionalEditId = null;
    document.getElementById('profissionalEditForm').reset();
    document.getElementById('editFotoPreview').innerHTML = '';
    mostrarSecao('profissionais');
}

/**
 * Atualizar profissional
 */
document.getElementById('profissionalEditForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (!profissionalEditId) return;

    const novaFoto = document.getElementById('editFoto').files[0];
    let fotoAtualizada = null;
    
    if (novaFoto) {
        fotoAtualizada = await converterParaBase64(novaFoto);
    }

    const profissionalAtualizado = {
        nome: document.getElementById('editNome').value,
        especialidade: document.getElementById('editEspecialidade').value,
        cadastroMedico: document.getElementById('editCadastro').value,
        apresentacao: document.getElementById('editApresentacao').value,
        atuacao: document.getElementById('editAtuacao').value,
        foto: fotoAtualizada ? fotoAtualizada : fotoOriginalProfissional
    };

    try {
        await enviarApi(`/profissionais/${profissionalEditId}`, 'PUT', profissionalAtualizado);

        mostrarMensagemSucesso('editSuccessMsg', '✅ Profissional atualizado com sucesso!');

        setTimeout(() => cancelarEdicao(), 3000);

        atualizarDashboard();
        listarProfissionais();
    } catch (erro) {
        mostrarErro('Erro ao atualizar profissional: ' + erro.message);
    }
});

/**
 * Deletar profissional
 */
async function deletarProfissional(id) {
    if (!confirm('Tem certeza que deseja deletar este profissional? Esta ação não pode ser desfeita!')) {
        return;
    }

    try {
        await enviarApi(`/profissionais/${id}`, 'DELETE', {});

        atualizarDashboard();
        listarProfissionais();
        
        mostrarMensagemSucesso('successMsg', '✅ Profissional deletado com sucesso!');
    } catch (erro) {
        mostrarErro('Erro ao deletar profissional: ' + erro.message);
    }
}

// ================================================
// VÍDEOS - CRUD
// ================================================

async function listarVideos() {
    const videos = await carregarVideos();
    const lista = document.getElementById('videosList');
    
    if (videos.length === 0) {
        lista.innerHTML = renderizarVazio('Nenhum vídeo cadastrado ainda.') +
            '<p style="text-align:center;color:var(--cor-texto-light);">Use o formulário acima para adicionar um novo vídeo!</p>';
        return;
    }
    
    lista.innerHTML = videos.map(video => `
        <div class="video-item">
            <div class="video-item-preview">
                📹
            </div>
            <div class="video-item-info">
                <div class="video-item-title">${video.titulo}</div>
                <div class="video-item-id">ID: ${video.youtubeid}</div>
                ${video.descricao ? `<p style="font-size: 0.9rem; color: var(--cor-texto-light); margin-bottom: var(--espaco-md);">${video.descricao}</p>` : ''}
                <div class="video-item-actions" style="display: flex; gap: var(--espaco-md);">
                    <button class="btn-edit" onclick="editarVideo(${video.id})" style="flex: 1; padding: var(--espaco-md); background: var(--cor-destaque); color: var(--cor-branco); border: none; border-radius: 5px; cursor: pointer; font-weight: bold; transition: all var(--transicao-normal);">✏️ Editar</button>
                    <button class="btn-delete" onclick="deletarVideo(${video.id})" style="flex: 1; padding: var(--espaco-md); background: var(--cor-erro); color: var(--cor-branco); border: none; border-radius: 5px; cursor: pointer; font-weight: bold; transition: all var(--transicao-normal);">🗑️ Deletar</button>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Adicionar novo vídeo
 */
document.getElementById('videoForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const novoVideo = {
        titulo: document.getElementById('videoTitulo').value,
        descricao: document.getElementById('videoDescricao').value,
        youtubeid: document.getElementById('videoID').value
    };
    
    try {
        await enviarApi('/videos', 'POST', novoVideo);

        mostrarMensagemSucesso('videoSuccessMsg', '✅ Vídeo cadastrado com sucesso!');
        
        document.getElementById('videoForm').reset();
        
        listarVideos();
    } catch (erro) {
        mostrarErro('Erro ao cadastrar vídeo: ' + erro.message);
    }
});

/**
 * Editar vídeo
 */
async function editarVideo(id) {
    const videos = await carregarVideos();
    const video = videos.find(v => v.id === id);
    
    if (!video) return;
    
    videoEditId = id;
    
    // Preencher formulário de edição
    document.getElementById('editVideoTitulo').value = video.titulo;
    document.getElementById('editVideoDescricao').value = video.descricao || '';
    document.getElementById('editVideoID').value = video.youtubeid;
    
    // Mudar para seção de edição
    mostrarSecao('editar-video');
    window.scrollTo(0, 0);
}

/**
 * Cancelar edição de vídeo
 */
function cancelarEdicaoVideo() {
    videoEditId = null;
    document.getElementById('videoEditForm').reset();
    mostrarSecao('videos');
}

/**
 * Atualizar vídeo
 */
document.getElementById('videoEditForm')?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (!videoEditId) return;

    const videoAtualizado = {
        titulo: document.getElementById('editVideoTitulo').value,
        descricao: document.getElementById('editVideoDescricao').value,
        youtubeid: document.getElementById('editVideoID').value
    };

    try {
        await enviarApi(`/videos/${videoEditId}`, 'PUT', videoAtualizado);

        mostrarMensagemSucesso('editVideoSuccessMsg', '✅ Vídeo atualizado com sucesso!');

        setTimeout(() => cancelarEdicaoVideo(), 3000);

        listarVideos();
    } catch (erro) {
        mostrarErro('Erro ao atualizar vídeo: ' + erro.message);
    }
});

/**
 * Deletar vídeo
 */
async function deletarVideo(id) {
    if (!confirm('Tem certeza que deseja deletar este vídeo? Esta ação não pode ser desfeita!')) {
        return;
    }

    try {
        await enviarApi(`/videos/${id}`, 'DELETE', {});

        listarVideos();
        
        mostrarMensagemSucesso('videoSuccessMsg', '✅ Vídeo deletado com sucesso!');
    } catch (erro) {
        mostrarErro('Erro ao deletar vídeo: ' + erro.message);
    }
}

// ================================================
// NAVEGAÇÃO DO PAINEL
// ================================================

function mostrarSecao(secaoId) {
    document.querySelectorAll('.admin-section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.menu-btn').forEach(b => b.classList.remove('active'));
    
    const secao = document.getElementById(secaoId);
    if (secao) {
        secao.classList.add('active');
    }
    
    const botao = document.querySelector(`[data-section="${secaoId}"]`);
    if (botao) {
        botao.classList.add('active');
    }
    
    if (secaoId === 'profissionais') {
        listarProfissionais();
    } else if (secaoId === 'videos') {
        listarVideos();
    }
}

function inicializarMenuBotoes() {
    document.querySelectorAll('.menu-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const secao = this.getAttribute('data-section');
            mostrarSecao(secao);
        });
    });
}

/**
 * Inicialização ao carregar a página
 */
document.addEventListener('DOMContentLoaded', function() {
    verificarAutenticacao();
    inicializarMenuBotoes();
    atualizarDashboard();
    
    setInterval(() => {
        atualizarDashboard();
    }, 5000);
});
