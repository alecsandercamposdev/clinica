/**
 * FACCES - Clínica Dentária
 * TypeScript Funcional
 * Navegação suave, menu responsivo e validação de formulário
 */

// ================================================
// FUNCIONALIDADES DE NAVEGAÇÃO
// ================================================

/**
 * Inicializa os eventos de navegação suave
 */
function inicializarNavegacaoSuave(): void {
    const links = document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(this: HTMLAnchorElement, evento: MouseEvent) {
            const href = this.getAttribute('href');

            if (href && href !== '#' && document.querySelector<HTMLElement>(href)) {
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
function navegarParaSecao(selectorId: string): void {
    const elemento = document.querySelector<HTMLElement>(selectorId);
    const header = document.querySelector<HTMLElement>('.header');

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
function inicializarMenuMobile(): void {
    const menuToggle = document.getElementById('menuToggle') as HTMLButtonElement | null;
    const navLinks = document.getElementById('navLinks') as HTMLElement | null;

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function(this: HTMLButtonElement) {
            navLinks.classList.toggle('active');
            animarMenuToggle(this);
        });
    }

    const links = document.querySelectorAll<HTMLAnchorElement>('.nav-links a');
    links.forEach(link => {
        link.addEventListener('click', () => {
            fecharMenuMobile();
        });
    });

    document.addEventListener('click', function(evento: MouseEvent) {
        const navbar = document.querySelector<HTMLElement>('.navbar-container');
        const target = evento.target;

        if (navbar && target instanceof Node && navLinks?.classList.contains('active') && !navbar.contains(target)) {
            fecharMenuMobile();
        }
    });
}

/**
 * Anima o botão do menu
 * @param botao - Elemento do botão toggle
 */
function animarMenuToggle(botao: HTMLElement): void {
    const spans = botao.querySelectorAll<HTMLSpanElement>('span');
    const navLinks = botao.parentElement?.querySelector<HTMLElement>('#navLinks');

    if (navLinks?.classList.contains('active')) {
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
function fecharMenuMobile(): void {
    const navLinks = document.getElementById('navLinks') as HTMLElement | null;
    const menuToggle = document.getElementById('menuToggle') as HTMLElement | null;

    navLinks?.classList.remove('active');

    if (menuToggle) {
        const spans = menuToggle.querySelectorAll<HTMLSpanElement>('span');
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
function adicionarAnimacoes(): void {
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
function inicializarDestaqueScroll(): void {
    const secoes = document.querySelectorAll<HTMLElement>('section');

    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                const alvo = entrada.target as HTMLElement;
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
function inicializarCardsProf(): void {
    const cards = document.querySelectorAll<HTMLElement>('.medico-card[data-profissional-id]');

    cards.forEach(card => {
        card.addEventListener('click', function(this: HTMLElement) {
            const profissionalId = this.getAttribute('data-profissional-id');
            if (profissionalId) {
                window.location.href = `profissional.html?id=${profissionalId}`;
            }
        });

        // Efeito visual ao passar o mouse
        card.addEventListener('mouseenter', function(this: HTMLElement) {
            this.style.transform = 'translateY(-12px)';
        });

        card.addEventListener('mouseleave', function(this: HTMLElement) {
            this.style.transform = 'translateY(0)';
        });
    });
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

    console.log('🦷 FACCES - Clínica Dentária iniciada com sucesso!');
});

// ================================================
// FUNÇÕES UTILITÁRIAS
// ================================================

function ehMobile(): boolean {
    return window.innerWidth <= 768;
}

function debug(mensagem: string): void {
    console.log(`[FACCES] ${mensagem}`);
}

window.addEventListener('resize', () => {
    const navLinks = document.getElementById('navLinks');
    if (!ehMobile() && navLinks?.classList.contains('active')) {
        fecharMenuMobile();
    }
});
