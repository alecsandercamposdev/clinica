# 🛠️ GUIA DE IMPLEMENTAÇÃO - Correções Práticas para SEO e Responsividade

Este arquivo contém **código pronto para copiar e colar** para implementar as melhorias críticas.

---

## 1️⃣ JSON-LD STRUCTURE (Copie para index.html)

Adicione este código no `<head>` do **index.html**, logo após as meta tags:

```html
<!-- ADICIONAR NO <head> de index.html -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "MedicalBusiness",
  "name": "FACCES Clínica Dentária",
  "alternateName": "FACCES",
  "image": "https://seu-site.com/img/Clinica.png",
  "description": "Clínica Dentária Especializada em Saúde Bucal com profissionais qualificados e tecnologia moderna",
  "url": "https://seu-site.com",
  "telephone": "(12) 3133-2286",
  "email": "contato@facces.com.br",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Av Dr Carlos Rebello Jr, 253",
    "addressLocality": "Guaratinguetá",
    "addressRegion": "SP",
    "postalCode": "12515-300",
    "addressCountry": "BR"
  },
  "areaServed": {
    "@type": "City",
    "name": "Guaratinguetá"
  },
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "08:00",
      "closes": "18:00"
    },
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": "Saturday",
      "opens": "08:00",
      "closes": "13:00"
    }
  ],
  "priceRange": "$$",
  "sameAs": [
    "https://www.facebook.com/facces",
    "https://www.instagram.com/facces",
    "https://api.whatsapp.com/send?phone=551299180560"
  ]
}
</script>

<!-- ADICIONAR Schema para ServicoMedico -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Serviços Odontológicos",
  "provider": {
    "@type": "MedicalBusiness",
    "name": "FACCES Clínica Dentária"
  },
  "serviceType": [
    "Odontologia Geral",
    "Ortodontia",
    "Estética Dentária",
    "Implantodontia",
    "Odontopediatria",
    "Periodontia"
  ]
}
</script>
```

---

## 2️⃣ OPEN GRAPH + TWITTER CARDS (Copie para index.html)

Adicione este código no `<head>` do **index.html**, após o meta description:

```html
<!-- ADICIONAR NO <head> de index.html após meta description -->

<!-- Open Graph - Facebook, LinkedIn -->
<meta property="og:title" content="FACCES - Clínica Dentária Especializada em Guaratinguetá">
<meta property="og:description" content="Profissionais qualificados oferecendo odontologia geral, ortodontia, estética e implantes. Saúde bucal é nossa prioridade!">
<meta property="og:image" content="https://seu-site.com/img/Clinica.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:url" content="https://seu-site.com/">
<meta property="og:type" content="website">
<meta property="og:locale" content="pt_BR">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@facces">
<meta name="twitter:title" content="FACCES - Clínica Dentária em Guaratinguetá">
<meta name="twitter:description" content="Saúde bucal é nossa prioridade. Profissionais qualificados e atendimento humanizado.">
<meta name="twitter:image" content="https://seu-site.com/img/Clinica.png">

<!-- Pinterest -->
<meta property="pinterest:media" content="https://seu-site.com/img/Clinica.png">

<!-- WhatsApp -->
<meta property="og:phone_number" content="+5512991806560">
```

---

## 3️⃣ ADICIONAR para profissional.html

No `<head>` de **profissional.html**, após meta description:

```html
<!-- ADICIONAR NO <head> de profissional.html -->

<!-- Open Graph - dinâmico (será preenchido via JS) -->
<meta property="og:title" content="Profissional - FACCES Clínica Dentária">
<meta property="og:description" content="Conheça nosso profissional qualificado">
<meta property="og:image" content="https://seu-site.com/img/Clinica.png">
<meta property="og:url" content="https://seu-site.com/profissional.html">
<meta property="og:type" content="profile">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="Profissional - FACCES">
<meta name="twitter:description" content="Dentista qualificado em Guaratinguetá">

<!-- Canonical (importante para URLs dinâmicas) -->
<link rel="canonical" href="https://seu-site.com/profissional.html">

<!-- Adicione este script para ATUALIZAR dinamicamente -->
<script>
  function atualizarOGTags(nome, especialidade, imagem) {
    document.querySelector('meta[property="og:title"]').setAttribute('content', `${nome} - Dentista | FACCES`);
    document.querySelector('meta[property="og:description"]').setAttribute('content', `${especialidade}. Profissional qualificado da FACCES Clínica Dentária`);
    document.querySelector('meta[property="og:image"]').setAttribute('content', imagem);
    document.title = `${nome} - FACCES Clínica Dentária`;
  }
  
  // Chamar quando dados do profissional são carregados
  // Exemplo: atualizarOGTags('Dr. João Silva', 'Odontologia Geral', '/img/joao.jpg');
</script>
```

---

## 4️⃣ META ROBOTS NOINDEX (Para admin pages)

Adicione no `<head>` de **admin.html**:

```html
<!-- ADICIONAR NO <head> de admin.html -->
<meta name="robots" content="noindex, nofollow, noarchive, nocache">
<meta name="googlebot" content="noindex, nofollow">
```

Adicione no `<head>` de **admin-login.html**:

```html
<!-- ADICIONAR NO <head> de admin-login.html -->
<meta name="robots" content="noindex, nofollow, noarchive, nocache">
<meta name="googlebot" content="noindex, nofollow">
```

---

## 5️⃣ FAVICON (Copie para todas as páginas)

Gerar um favicon simples:

**Opção 1: Use um gerador online**
- https://realfavicongenerator.net/
- Upload uma imagem (use a logo FACCES)
- Download os arquivos

**Opção 2: Use um favicon unicode**

Adicione no `<head>` de **todas as páginas** (após `</title>`):

```html
<!-- FAVICON -->
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90' fill='%23002B2B'>🦷</text></svg>">
<link rel="apple-touch-icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 180 180'><rect fill='%23002B2B' width='180' height='180'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='120' fill='white'>🦷</text></svg>">
```

**Opção 3: Criar arquivo favicon.png (melhor)**
1. Salvar um arquivo 32x32 como `/img/favicon.png`
2. Adicionar no `<head>`:

```html
<link rel="icon" type="image/png" href="/img/favicon.png">
<link rel="apple-touch-icon" href="/img/favicon.png">
```

---

## 6️⃣ CORRIGIR FONT-SIZE EM INPUTS (CSS)

Abra **style.css** e atualize a seção de forms:

```css
/* ============================================
   ATUALIZAR EM style.css
   ============================================ */

/* Encontre e ATUALIZE essa seção */
.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: var(--espaco-md);
    border: 2px solid var(--cor-borda);
    border-radius: 5px;
    font-size: 16px;              /* ✅ MUDADO de 1rem para 16px */
    font-family: var(--fonte-primaria);
    box-sizing: border-box;
    transition: border-color var(--transicao-normal);
}

/* Também em admin.html inline styles - ATUALIZAR: */
.admin-login-card input {
    font-size: 16px;              /* ✅ ADICIONAR esta linha */
}

.admin-login-btn {
    font-size: 16px;              /* ✅ ADICIONAR esta linha */
}
```

---

## 7️⃣ ADICIONAR BREAKPOINT 1024px (CSS)

Abra **style.css** e adicione ANTES das media queries atuais:

```css
/* ============================================
   RESPONSIVIDADE - DESKTOP GRANDE
   ============================================ */

/* Desktop Grande (1024px+) */
@media (min-width: 1024px) {
    .section-container {
        max-width: 1200px;
        padding: 0 var(--espaco-lg);
    }

    .home-container {
        max-width: 1200px;
    }

    .nav-links {
        gap: var(--espaco-2xl);
    }

    /* Specialidades em 3 colunas */
    .especialidades-grid {
        grid-template-columns: repeat(3, 1fr);
    }

    /* Médicos em 4 colunas */
    .medicos-grid {
        grid-template-columns: repeat(4, 1fr);
    }

    /* Vídeos em 3 colunas */
    .videos-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}
```

---

## 8️⃣ ADICIONAR BREAKPOINT 320px (CSS)

Abra **style.css** e adicione APÓS o breakpoint de 375px:

```css
/* ============================================
   RESPONSIVIDADE - EXTRA SMALL
   ============================================ */

/* Extra Small (até 320px) */
@media (max-width: 320px) {
    .home-title {
        font-size: 1.2rem;
        line-height: 1.2;
    }

    .home-subtitle {
        font-size: 0.95rem;
    }

    .home-description {
        font-size: 0.9rem;
    }

    .section-title {
        font-size: 1.2rem;
    }

    .section-subtitle {
        font-size: 0.85rem;
    }

    .navbar-container {
        padding: 0 var(--espaco-xs);
    }

    .logo h1 {
        font-size: 0.9rem;
        letter-spacing: 1px;
    }

    .logo .tagline {
        font-size: 0.55rem;
        letter-spacing: 0.5px;
    }

    .medico-card {
        margin-bottom: var(--espaco-md);
    }

    .especialidade-card {
        padding: var(--espaco-lg);
    }

    .especialidade-icon {
        font-size: 2rem;
    }

    .especialidade-card h3 {
        font-size: 1.1rem;
    }

    .btn-whatsapp {
        padding: var(--espaco-sm) var(--espaco-lg);
        font-size: 0.95rem;
    }

    .contato-mapa {
        height: 250px;
    }
}
```

---

## 9️⃣ CONVERTER px PARA rem (CSS)

Abra **style.css** e atualize essas linhas:

```css
/* ANTES → DEPOIS */

/* Logo e navegação */
.menu-toggle span {
    width: 25px;           → width: 1.5625rem;
    height: 3px;           → height: 0.1875rem;
    gap: 5px;              → gap: 0.3125rem;
}

.nav-links a::after {
    bottom: -5px;          → bottom: -0.3125rem;
    height: 2px;           → height: 0.125rem;
    width: 0;              → width: 0;  /* já está bem */
}

/* Borders */
.placeholder-image {
    border: 2px solid;     → border: 0.125rem solid;  (ou deixar 2px se preferir)
}

.logo h1 {
    letter-spacing: 2px;   → letter-spacing: 0.125rem;
}

.logo .tagline {
    letter-spacing: 1px;   → letter-spacing: 0.0625rem;
}

.especialidade-card {
    border-left: 4px solid transparent;  → border-left: 0.25rem solid transparent;
}

.info-item {
    border-left: 4px solid var(--cor-destaque);  → border-left: 0.25rem solid var(--cor-destaque);
}
```

---

## 🔟 TORNAR SIDEBAR ADMIN COLAPSÁVEL (HTML + CSS + JS)

### Passo 1: Atualizar HTML (admin.html)

Encontre a seção `<aside class="admin-sidebar">` e adicione um ID e botão toggle:

```html
<!-- ATUALIZAR em admin.html -->

<!-- Adicione ANTES da sidebar -->
<button id="sidebarToggle" class="sidebar-toggle-btn" aria-label="Abrir/Fechar menu">
    <span></span>
    <span></span>
    <span></span>
</button>

<!-- A sidebar existente fica igual -->
<aside class="admin-sidebar" id="adminSidebar">
    <!-- Conteúdo existente -->
</aside>
```

### Passo 2: Adicionar CSS (inline em admin.html)

Encontre a seção `@media (max-width: 768px)` e SUBSTITUA por:

```css
/* SUBSTITUIR no admin.html - media query 768px */
@media (max-width: 768px) {
    .sidebar-toggle-btn {
        display: flex;
        flex-direction: column;
        background: var(--cor-primaria);
        border: none;
        cursor: pointer;
        position: fixed;
        top: 1rem;
        left: 1rem;
        z-index: 1100;
        gap: 5px;
        padding: var(--espaco-sm);
        border-radius: 5px;
    }

    .sidebar-toggle-btn span {
        width: 25px;
        height: 3px;
        background: white;
        border-radius: 2px;
        transition: all 0.3s ease;
    }

    .sidebar-toggle-btn.active span:nth-child(1) {
        transform: rotate(45deg) translateY(10px);
    }

    .sidebar-toggle-btn.active span:nth-child(2) {
        opacity: 0;
    }

    .sidebar-toggle-btn.active span:nth-child(3) {
        transform: rotate(-45deg) translateY(-10px);
    }

    .admin-sidebar {
        position: fixed;
        left: 0;
        top: 0;
        width: 250px;
        height: 100vh;
        transform: translateX(-100%);  /* ✅ Escondido por padrão */
        transition: transform 0.3s ease;
        z-index: 1000;
        overflow-y: auto;
        box-shadow: 2px 0 5px rgba(0,0,0,0.1);
    }

    .admin-sidebar.active {
        transform: translateX(0);      /* ✅ Visível ao abrir */
    }

    /* Overlay quando sidebar está aberta */
    body::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
        z-index: 999;
    }

    body.sidebar-open::before {
        opacity: 1;
        pointer-events: all;
    }

    .admin-main {
        margin-left: 0;
        padding: var(--espaco-lg);
        margin-top: 3rem;  /* Espaço para o botão toggle */
    }

    .admin-container {
        grid-template-columns: 1fr;
    }

    .admin-header {
        flex-direction: column;
        text-align: center;
        gap: var(--espaco-lg);
    }

    .profissionais-grid {
        grid-template-columns: 1fr;
    }
}
```

### Passo 3: Adicionar JavaScript

Adicione este script no **admin.html**, antes de `</body>`:

```html
<!-- ADICIONAR antes de </body> em admin.html -->
<script>
document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('adminSidebar');
    const body = document.body;

    // Toggle sidebar
    toggleBtn.addEventListener('click', function() {
        sidebar.classList.toggle('active');
        toggleBtn.classList.toggle('active');
        body.classList.toggle('sidebar-open');
    });

    // Fechar ao clicar em um link da sidebar
    const sidebarLinks = sidebar.querySelectorAll('button, a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function() {
            sidebar.classList.remove('active');
            toggleBtn.classList.remove('active');
            body.classList.remove('sidebar-open');
        });
    });

    // Fechar ao clicar no overlay
    body.addEventListener('click', function(e) {
        if (e.target === body && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
            toggleBtn.classList.remove('active');
            body.classList.remove('sidebar-open');
        }
    });
});
</script>
```

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO RÁPIDA

### CRÍTICO (Fazer AGORA - 30 minutos)

```
☐ 1. Copiar JSON-LD para index.html <head>
☐ 2. Copiar Open Graph tags para index.html <head>
☐ 3. Copiar Open Graph tags para profissional.html <head>
☐ 4. Adicionar <meta name="robots" content="noindex"> em admin.html
☐ 5. Adicionar <meta name="robots" content="noindex"> em admin-login.html
☐ 6. Adicionar Favicon em todas as páginas
```

### ALTO IMPACTO (Fazer HOJE - 1 hora)

```
☐ 7. Atualizar font-size inputs para 16px em style.css
☐ 8. Adicionar breakpoint 1024px em style.css
☐ 9. Adicionar breakpoint 320px em style.css
☐ 10. Converter px para rem em style.css
```

### MÉDIA PRIORIDADE (Fazer ESTA SEMANA - 2 horas)

```
☐ 11. Implementar sidebar colapsável em admin.html (HTML + CSS + JS)
☐ 12. Testar em deviceos reais: iPhone 12, iPad, Samsung Galaxy
☐ 13. Validar com Google Rich Results Test
```

---

## 🧪 TESTES APÓS IMPLEMENTAÇÃO

```bash
# 1. Validar JSON-LD
# https://search.google.com/test/rich-results
# Cole o HTML ou URL e valide

# 2. Testar Mobile
# https://search.google.com/test/mobile-friendly
# Cole a URL

# 3. PageSpeed
# https://pagespeed.web.dev/
# Verifique performance

# 4. Validar HTML
# https://validator.w3.org/
# Upload o arquivo

# 5. Responsividade Local
# Chrome DevTools > F12 > Ctrl+Shift+M
# Teste em 320px, 768px, 1024px
```

---

## 📝 EXEMPLO: Como o index.html ficará

```html
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="FACCES - Clínica Dentária Especializada em Saúde Bucal">
    <meta name="keywords" content="dentista, clínica, odontologia, saúde bucal">
    
    <!-- ✅ ADICIONADO: JSON-LD -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "MedicalBusiness",
      "name": "FACCES Clínica Dentária",
      ...
    }
    </script>

    <!-- ✅ ADICIONADO: Open Graph -->
    <meta property="og:title" content="FACCES - Clínica Dentária Especializada em Guaratinguetá">
    <meta property="og:description" content="Profissionais qualificados...">
    ...

    <!-- ✅ ADICIONADO: Favicon -->
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,...">

    <title>FACCES - Clínica Dentária</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <!-- Resto do HTML... -->
</body>
</html>
```

---

**Última atualização**: 2026-06-05  
**Próxima revisão**: Após implementar todas as mudanças
