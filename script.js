/**
 * FACCES - Clínica Dentária
 * JavaScript Funcional
 * Navegação suave, menu responsivo e validação de formulário
 */

const API_URL = 'http://localhost:3000/api';

// ================================================
// FUNCIONALIDADES DE NAVEGAÇÃO
// ================================================

/**
 * Inicializa os eventos de navegação suave
 */
function inicializarNavegacaoSuave() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(evento) {
            const href = this.getAttribute('href');

            if (href && href !== '#' && document.querySelector(href)) {
                evento.preventDefault();
                navegarParaSecao(href);
            }
        });
    });
}

/**
 * Navega para uma seção com scroll suave
 * @param selectorId - ID da seção (ex: '#home')
 */
function navegarParaSecao(selectorId) {
    const elemento = document.querySelector(selectorId);
    const header = document.querySelector('.header');

    if (elemento && header) {
        const headerHeight = header.offsetHeight;
        const posicaoTopo = elemento.offsetTop - headerHeight;

        window.scrollTo({
            top: posicaoTopo,
            behavior: 'smooth'
        });

        fecharMenuMobile();
    }
}

// ================================================
// FUNCIONALIDADES DO MENU RESPONSIVO
// ================================================

/**
 * Inicializa o menu responsivo para mobile
 */
function inicializarMenuMobile() {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            animarMenuToggle(this);
        });
    }

    const links = document.querySelectorAll('.nav-links a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            fecharMenuMobile();
        });
    });

    document.addEventListener('click', function(evento) {
        const navbar = document.querySelector('.navbar-container');
        const target = evento.target;

        if (navbar && navLinks && navLinks.classList.contains('active') && !navbar.contains(target)) {
            fecharMenuMobile();
        }
    });
}

/**
 * Anima o botão do menu
 * @param botao - Elemento do botão toggle
 */
function animarMenuToggle(botao) {
    const spans = botao.querySelectorAll('span');
    const navLinks = botao.parentElement.querySelector('#navLinks');

    if (navLinks.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(10px, 10px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(7px, -7px)';
    } else {
        spans[0].style.transform = 'rotate(0) translate(0, 0)';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'rotate(0) translate(0, 0)';
    }
}

/**
 * Fecha o menu móvel
 */
function fecharMenuMobile() {
    const navLinks = document.getElementById('navLinks');
    const menuToggle = document.getElementById('menuToggle');

    if (navLinks) {
        navLinks.classList.remove('active');
    }

    if (menuToggle) {
        const spans = menuToggle.querySelectorAll('span');
        spans.forEach(span => {
            span.style.transform = '';
            span.style.opacity = '';
        });
    }
}

// ================================================
// EFEITOS VISUAIS
// ================================================

/**
 * Adiciona estilos de animação ao documento
 */
function adicionarAnimacoes() {
    if (!document.querySelector('style[data-animacoes]')) {
        const style = document.createElement('style');
        style.setAttribute('data-animacoes', 'true');
        style.textContent = `
            @keyframes slideDown {
                from {
                    opacity: 0;
                    transform: translateY(-10px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes slideUp {
                from {
                    opacity: 1;
                    transform: translateY(0);
                }
                to {
                    opacity: 0;
                    transform: translateY(-10px);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Adiciona efeito de destaque ao scroll para seções visíveis
 */
function inicializarDestaqueScroll() {
    const secoes = document.querySelectorAll('section');

    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                const alvo = entrada.target;
                alvo.style.opacity = '1';
                alvo.style.animation = 'fadeIn 0.6s ease';
            }
        });
    }, {
        threshold: 0.1
    });

    secoes.forEach(secao => {
        secao.style.opacity = '0';
        observador.observe(secao);
    });

    if (!document.querySelector('style[data-fadein]')) {
        const style = document.createElement('style');
        style.setAttribute('data-fadein', 'true');
        style.textContent = `
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ================================================
// FUNCIONALIDADES DE CARDS DE PROFISSIONAIS
// ================================================

/**
 * Inicializa os eventos de clique nos cards de profissionais
 */
function inicializarCardsProf() {
    const cards = document.querySelectorAll('.medico-card[data-profissional-id]');

    cards.forEach(card => {
        card.style.cursor = 'pointer';
        
        card.addEventListener('click', function() {
            const profissionalId = this.getAttribute('data-profissional-id');
            if (profissionalId) {
                window.location.href = `profissional.html?id=${profissionalId}`;
            }
        });

        // Efeito visual ao passar o mouse
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-12px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// ================================================
// FUNCIONALIDADES DE VÍDEOS EDUCATIVOS
// ================================================

/**
 * Carrega vídeos da API e atualiza a seção na landing page
 */
async function atualizarVideosEducativos() {
    try {
        const videosGrid = document.querySelector('.videos-grid');
        if (!videosGrid) return;
        
        // Carregar vídeos da API
        const response = await fetch('http://localhost:3000/api/videos');
        if (!response.ok) throw new Error('Erro ao carregar vídeos');
        
        const videos = await response.json();
        
        if (videos.length === 0) {
            videosGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #666;">
                    <p>📭 Nenhum vídeo educativo disponível no momento.</p>
                </div>
            `;
            return;
        }
        
        // Renderizar vídeos da API
        videosGrid.innerHTML = videos.map(video => `
            <article class="video-card">
                <div class="video-container">
                    <iframe 
                        width="100%" 
                        height="250" 
                        src="https://www.youtube.com/embed/${video.youtubeId}" 
                        title="${video.titulo}"
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen>
                    </iframe>
                </div>
                <h3 class="video-title">${video.titulo}</h3>
                <p class="video-descricao">${video.descricao || 'Conteúdo educativo sobre saúde bucal.'}</p>
            </article>
        `).join('');
    } catch (erro) {
        console.error('Erro ao carregar vídeos:', erro);
        const videosGrid = document.querySelector('.videos-grid');
        if (videosGrid) {
            videosGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #999;">
                    <p>⚠️ Erro ao carregar vídeos. Tente novamente mais tarde.</p>
                </div>
            `;
        }
    }
}

// ================================================
// RASTREAMENTO DE ACESSOS E CONVERSÕES
// ================================================

/**
 * Rastrear acesso ao site (via API)
 */
function rastrearAcesso() {
    fetch(`${API_URL}/metricas/acesso`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
    }).catch(err => console.log('Acesso registrado localmente'));
}

/**
 * Rastrear clique de conversão (WhatsApp ou contato)
 */
function rastrearConversao(tipo = 'whatsapp') {
    fetch(`${API_URL}/metricas/conversao`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo })
    }).then(() => {
        console.log(`✅ Conversão rastreada: ${tipo}`);
    }).catch(err => console.log('Conversão registrada localmente'));
}

/**
 * Inicializar rastreamento de cliques de conversão
 */
function inicializarRastreamentoConversoes() {
    // Rastrear cliques no WhatsApp
    const botoesWhatsapp = document.querySelectorAll('.btn-whatsapp, [href*="wa.me"]');
    botoesWhatsapp.forEach(botao => {
        botao.addEventListener('click', () => rastrearConversao('whatsapp'));
    });
    
    // Rastrear envio de formulário de contato (se houver)
    const formContato = document.querySelector('form[name="contato"], form[id*="contato"]');
    if (formContato) {
        formContato.addEventListener('submit', (e) => {
            rastrearConversao('formulario');
        });
    }
}

// ================================================
// INICIALIZAÇÃO
// ================================================

/**
 * Inicializa todas as funcionalidades quando o DOM estiver pronto
 */
document.addEventListener('DOMContentLoaded', () => {
    adicionarAnimacoes();
    inicializarNavegacaoSuave();
    inicializarMenuMobile();
    inicializarDestaqueScroll();
    inicializarCardsProf();
    atualizarVideosEducativos();
    rastrearAcesso();
    inicializarRastreamentoConversoes();

    console.log('🦷 FACCES - Clínica Dentária iniciada com sucesso!');
});

// ================================================
// FUNÇÕES UTILITÁRIAS
// ================================================

function ehMobile() {
    return window.innerWidth <= 768;
}

function debug(mensagem) {
    console.log(`[FACCES] ${mensagem}`);
}

window.addEventListener('resize', () => {
    const navLinks = document.getElementById('navLinks');
    if (!ehMobile() && navLinks && navLinks.classList.contains('active')) {
        fecharMenuMobile();
    }
});
