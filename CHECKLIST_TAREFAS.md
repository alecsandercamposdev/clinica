# ✅ CHECKLIST EXECUTIVO - Tarefas Práticas

**Instruções**: Marque com ✅ conforme completa cada tarefa. Salve este arquivo para acompanhamento.

---

## 🔴 CRÍTICO - FAZER HOJE (17 minutos)

Estas são as tarefas que **IMPEDEM PUBLICAÇÃO**. Sem fazer isso, o site terá baixa visibilidade em Google.

### Tarefa 1: Adicionar JSON-LD em index.html ⏱️ 5 min
- [ ] Abrir arquivo: `index.html`
- [ ] Localizar: `<title>FACCES - Clínica Dentária</title>`
- [ ] Copiar JSON-LD completo de: `GUIA_IMPLEMENTACAO.md` seção 1️⃣
- [ ] Colar após `</title>` no `<head>`
- [ ] Salvar arquivo
- [ ] Testar em: https://search.google.com/test/rich-results
- [ ] Resultado esperado: ✅ "Valid structured data found"

**Arquivo**: `index.html`  
**Duração**: 5 minutos  
**Impacto SEO**: +30%

---

### Tarefa 2: Adicionar Open Graph Tags em index.html ⏱️ 3 min
- [ ] Abrir arquivo: `index.html`
- [ ] Localizar: `<meta name="keywords" content="..."`
- [ ] Copiar seção "Open Graph" de: `GUIA_IMPLEMENTACAO.md` seção 2️⃣
- [ ] Colar logo após meta keywords
- [ ] Salvar arquivo
- [ ] Testar compartilhando: facces.com no WhatsApp

**Arquivo**: `index.html`  
**Duração**: 3 minutos  
**Impacto SEO**: +15%

---

### Tarefa 3: Adicionar Open Graph Tags em profissional.html ⏱️ 2 min
- [ ] Abrir arquivo: `profissional.html`
- [ ] Localizar: `<title>Profissional - FACCES</title>`
- [ ] Copiar seção de: `GUIA_IMPLEMENTACAO.md` seção 3️⃣
- [ ] Colar no `<head>` após `</title>`
- [ ] Salvar arquivo

**Arquivo**: `profissional.html`  
**Duração**: 2 minutos  
**Impacto SEO**: +10%

---

### Tarefa 4: Adicionar Meta Robots Noindex em admin.html ⏱️ 1 min
- [ ] Abrir arquivo: `admin.html`
- [ ] Localizar: `<title>Painel Admin - FACCES</title>`
- [ ] Copiar linha de: `GUIA_IMPLEMENTACAO.md` seção 4️⃣
- [ ] Colar no `<head>` após `</title>`
- [ ] **Importante**: Usar EXATAMENTE: `<meta name="robots" content="noindex, nofollow">`
- [ ] Salvar arquivo

**Arquivo**: `admin.html`  
**Duração**: 1 minuto  
**Impacto Segurança**: +10%

---

### Tarefa 5: Adicionar Meta Robots Noindex em admin-login.html ⏱️ 1 min
- [ ] Abrir arquivo: `admin-login.html`
- [ ] Localizar: `<title>Login - Painel Admin FACCES</title>`
- [ ] Copiar linha de: `GUIA_IMPLEMENTACAO.md` seção 4️⃣
- [ ] Colar no `<head>` após `</title>`
- [ ] Salvar arquivo

**Arquivo**: `admin-login.html`  
**Duração**: 1 minuto  
**Impacto Segurança**: +10%

---

### Tarefa 6: Adicionar Favicon em TODAS as páginas ⏱️ 5 min
- [ ] Escolher opção de favicon: `GUIA_IMPLEMENTACAO.md` seção 5️⃣
  - [ ] Opção 1: Usar gerador online (realfavicongenerator.net)
  - [ ] Opção 2: Usar emoji unicode (mais rápido)
  - [ ] Opção 3: Usar arquivo PNG (mais profissional)
- [ ] Se usar PNG: Salvar como `img/favicon.png`
- [ ] Copiar código favicon
- [ ] Adicionar em `index.html` após `</title>` ✅
- [ ] Adicionar em `profissional.html` após `</title>` ✅
- [ ] Adicionar em `admin.html` após `</title>` ✅
- [ ] Adicionar em `admin-login.html` após `</title>` ✅
- [ ] Fazer F5 refresh em navegador para ver ícone
- [ ] Verificar em aba do navegador

**Arquivos**: TODAS as `.html`  
**Duração**: 5 minutos  
**Impacto Branding**: +10%

---

### ✅ VERIFICAÇÃO CRÍTICA

Após completar estas 6 tarefas:

- [ ] Abrir Chrome DevTools (F12)
- [ ] Console deve estar limpo (sem red errors)
- [ ] Validar em: https://search.google.com/test/rich-results
- [ ] Todos os `<meta>` tags estão presentes
- [ ] Commit Git com mensagem: "SEO: Add JSON-LD, OG tags, noindex, favicon"
- [ ] Deploy em produção

**⏱️ Tempo total CRÍTICO: 17 minutos**

---

## 🟡 ALTO - FAZER AMANHÃ (40 minutos)

Estas tarefas melhoram **muito** a experiência mobile e responsividade.

### Tarefa 7: Corrigir Font-Size em Inputs ⏱️ 10 min
- [ ] Abrir arquivo: `style.css`
- [ ] Procurar: `.form-group input`
- [ ] Encontrar a linha: `font-size: 1rem;`
- [ ] Alterar para: `font-size: 16px;`
- [ ] Buscar TODAS as ocorrências de `.form-group` (podem ser várias)
- [ ] Verificar em: `admin.html` inline styles também
- [ ] Testar em iPhone real (se possível)
- [ ] Verificar: Input NÃO faz zoom ao focar em iOS

**Arquivo**: `style.css` + inline styles  
**Duração**: 10 minutos  
**Impacto UX Mobile**: +20%

---

### Tarefa 8: Adicionar Breakpoint 1024px ⏱️ 15 min
- [ ] Abrir arquivo: `style.css`
- [ ] Localizar: primeira `@media` query (buscar `@media (max-width: 768px)`)
- [ ] **ANTES** dela, adicionar novo bloco de: `GUIA_IMPLEMENTACAO.md` seção 7️⃣
- [ ] Copiar EXATAMENTE conforme está no guia
- [ ] Salvar arquivo
- [ ] Testar responsividade:
  - [ ] Chrome DevTools (F12)
  - [ ] Simular viewport 1024px
  - [ ] Verificar se layout melhora (colunas aumentam)
  - [ ] Especialidades em 3 colunas ✅
  - [ ] Médicos em 4 colunas ✅

**Arquivo**: `style.css`  
**Duração**: 15 minutos  
**Impacto Desktop**: +15%

---

### Tarefa 9: Adicionar Breakpoint 320px ⏱️ 10 min
- [ ] Abrir arquivo: `style.css`
- [ ] Localizar: último `@media` (buscar `@media (max-width: 375px)`)
- [ ] **DEPOIS** dele, adicionar novo bloco de: `GUIA_IMPLEMENTACAO.md` seção 8️⃣
- [ ] Copiar EXATAMENTE conforme está no guia
- [ ] Salvar arquivo
- [ ] Testar responsividade:
  - [ ] Chrome DevTools (F12)
  - [ ] Simular viewport 320px
  - [ ] Verificar se texto fica legível
  - [ ] Verificar se elementos não se sobrepõem
  - [ ] Testar scroll é suave

**Arquivo**: `style.css`  
**Duração**: 10 minutos  
**Impacto Mobile**: +15%

---

### Tarefa 10: Testar Responsividade em Todos Breakpoints ⏱️ 5 min
- [ ] Abrir `index.html` no navegador
- [ ] Abrir Chrome DevTools (F12)
- [ ] Ativar Device Emulation (Ctrl+Shift+M)
- [ ] Testar em cada resolução:

| Resolução | Device | Teste |
|-----------|--------|-------|
| 320px | iPhone SE | [ ] Sem overflow |
| 375px | iPhone 12 | [ ] Legível |
| 568px | iPhone sem max | [ ] OK |
| 768px | iPad | [ ] Bom layout |
| 1024px | iPad Pro | [ ] Colunas 3+ |
| 1920px | Desktop | [ ] Máximo 1200px |

- [ ] Todos os testes passaram ✅
- [ ] Commit: "Responsive: Add 320px and 1024px breakpoints"

**Arquivo**: `style.css`  
**Duração**: 5 minutos  
**Impacto QA**: Essencial

---

### ✅ VERIFICAÇÃO ALTO

Após completar estas 4 tarefas:

- [ ] Site responsivo em TODOS os breakpoints
- [ ] Inputs não fazem zoom em iOS
- [ ] PageSpeed melhorou
- [ ] Commit & Deploy

**⏱️ Tempo total ALTO: 40 minutos**

---

## 🟢 MÉDIO - FAZER ESTA SEMANA (90 minutos)

Estas tarefas completam as otimizações e servem para melhorias futuras.

### Tarefa 11: Converter px para rem em CSS ⏱️ 20 min
- [ ] Abrir arquivo: `style.css`
- [ ] Usar busca (Ctrl+H) para encontrar e substituir:

```
Procurar: 5px
Substituir: 0.3125rem

Procurar: 3px
Substituir: 0.1875rem

Procurar: 2px
Substituir: 0.125rem

Procurar: 1px
Substituir: 0.0625rem
```

- [ ] Fazer TODAS as substituições conforme `GUIA_IMPLEMENTACAO.md` seção 9️⃣
- [ ] Testar que nada quebrou
- [ ] Verificar borders e gaps

**Arquivo**: `style.css`  
**Duração**: 20 minutos  
**Impacto Escalabilidade**: +20%

---

### Tarefa 12: Implementar Sidebar Colapsável em Admin ⏱️ 45 min

#### 12a: Atualizar HTML
- [ ] Abrir arquivo: `admin.html`
- [ ] Encontrar: `<div class="admin-container">`
- [ ] **ANTES** dela, adicionar botão de: `GUIA_IMPLEMENTACAO.md` seção 🔟
- [ ] Adicionar após `<body>`:
```html
<button id="sidebarToggle" class="sidebar-toggle-btn" aria-label="Abrir/Fechar menu">
    <span></span>
    <span></span>
    <span></span>
</button>
```
- [ ] Salvar

**Arquivo**: `admin.html`  
**Duração**: 5 minutos

---

#### 12b: Atualizar CSS
- [ ] Abrir arquivo: `admin.html`
- [ ] Encontrar: `@media (max-width: 768px) {`
- [ ] **Substituir completamente** esta seção pelo código de: `GUIA_IMPLEMENTACAO.md` seção 🔟 (CSS)
- [ ] Salvar
- [ ] Verificar que aplicou corretamente

**Arquivo**: `admin.html` (inline style)  
**Duração**: 15 minutos

---

#### 12c: Atualizar JavaScript
- [ ] Abrir arquivo: `admin.html`
- [ ] Encontrar: `</body>` (final do arquivo)
- [ ] **ANTES** de `</body>`, adicionar script de: `GUIA_IMPLEMENTACAO.md` seção 🔟
- [ ] Colar exatamente conforme está
- [ ] Salvar

**Arquivo**: `admin.html`  
**Duração**: 5 minutos

---

#### 12d: Testar Sidebar
- [ ] Abrir `admin.html` no navegador
- [ ] Fazer login (se necessário)
- [ ] Desktop (1024px): Sidebar visível ✅
- [ ] Tablet (768px): Botão hamburger aparece ✅
- [ ] Clicar hamburger: Sidebar desliza ✅
- [ ] Clicar um menu item: Sidebar fecha ✅
- [ ] Clicar overlay (fundo escuro): Sidebar fecha ✅

**Teste**: Desktop + Mobile  
**Duração**: 10 minutos

---

### Tarefa 13: Adicionar Canonical URLs ⏱️ 15 min
- [ ] Abrir arquivo: `profissional.html`
- [ ] Encontrar: `<title>Profissional - FACCES</title>`
- [ ] Copiar de: `GUIA_IMPLEMENTACAO.md` seção 3️⃣ - a linha `<link rel="canonical"`
- [ ] Colar no `<head>` após `</title>`
- [ ] Verificar que está: `<link rel="canonical" href="https://seu-site.com/profissional.html">`
- [ ] Salvar

**Arquivo**: `profissional.html`  
**Duração**: 5 minutos  
**Impacto SEO**: +5%

---

### Tarefa 14: Criar Manifest.json para PWA ⏱️ 20 min
- [ ] Criar novo arquivo: `manifest.json` (na raiz)
- [ ] Copiar conteúdo de: `GUIA_IMPLEMENTACAO.md` seção 3️⃣
- [ ] Editar:
  - [ ] Substituir `/seu-site.com` pelo seu domínio real
  - [ ] Certifique-se de ter icons 192x192 e outros
- [ ] Salvar arquivo
- [ ] Adicionar link em TODAS as páginas (no `<head>`):
```html
<link rel="manifest" href="/manifest.json">
```

**Arquivo**: `manifest.json` + atualizar todas `.html`  
**Duração**: 20 minutos  
**Impacto PWA**: +10%

---

### Tarefa 15: Adicionar Preconnect Tags ⏱️ 10 min
- [ ] Se usar Google Fonts:
  - [ ] Adicionar em `<head>` de todas páginas:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

- [ ] Se usar CDN de ícones (Font Awesome, etc.):
  - [ ] Adicionar `<link rel="preconnect" href="...">`

**Arquivo**: Todas `.html`  
**Duração**: 10 minutos  
**Impacto Performance**: +5%

---

### ✅ VERIFICAÇÃO MÉDIO

Após completar estas tarefas:

- [ ] Sidebar admin funciona perfeitamente
- [ ] CSS completamente em rem
- [ ] Canonical URLs adicionadas
- [ ] Manifest.json criado
- [ ] Preconnect adicionado
- [ ] Todos os testes passam
- [ ] Commit: "Refactor: Complete responsiveness and PWA setup"
- [ ] Deploy em produção

**⏱️ Tempo total MÉDIO: 90 minutos**

---

## 📊 PROGRESSO GERAL

```
CRÍTICO (17 min)
├─ [ ] Tarefa 1: JSON-LD
├─ [ ] Tarefa 2: Open Graph (index)
├─ [ ] Tarefa 3: Open Graph (profissional)
├─ [ ] Tarefa 4: Noindex (admin)
├─ [ ] Tarefa 5: Noindex (admin-login)
└─ [ ] Tarefa 6: Favicon

ALTO (40 min)
├─ [ ] Tarefa 7: Font 16px
├─ [ ] Tarefa 8: Breakpoint 1024px
├─ [ ] Tarefa 9: Breakpoint 320px
└─ [ ] Tarefa 10: Testar responsividade

MÉDIO (90 min)
├─ [ ] Tarefa 11: px → rem
├─ [ ] Tarefa 12: Sidebar colapsável
├─ [ ] Tarefa 13: Canonical URLs
├─ [ ] Tarefa 14: Manifest.json
└─ [ ] Tarefa 15: Preconnect

TOTAL: 147 minutos (~2.5 horas)
```

---

## 🎯 PRÓXIMAS ETAPAS

Após completar TUDO acima:

### 1️⃣ Testar com Ferramentas Google
- [ ] https://search.google.com/test/rich-results → ✅ Valid
- [ ] https://search.google.com/test/mobile-friendly → ✅ Mobile friendly
- [ ] https://pagespeed.web.dev/ → Score > 80

### 2️⃣ Submeter em Google Search Console
- [ ] Adicionar propriedade do site
- [ ] Submeter sitemap
- [ ] Solicitar indexação

### 3️⃣ Monitorar por 2-4 Semanas
- [ ] Acompanhar posições em GSC
- [ ] Monitorar conversões
- [ ] Coletar feedback de usuários

### 4️⃣ Considerar Server-Side Rendering (Futuro)
- [ ] Implementar SSR para profissional.html
- [ ] Melhorar ainda mais o SEO dinâmico

---

## 📝 ANOTAÇÕES IMPORTANTES

### Se você ficar travado:
1. Consulte: `RELATORIO_SEO_RESPONSIVIDADE.md` (análise completa)
2. Procure na seção correspondente em: `GUIA_IMPLEMENTACAO.md`
3. Veja um diagrama em: `DIAGRAMS.md`
4. Referência rápida: `RESUMO_VISUAL.md`

### Se algo quebrar após uma mudança:
1. Abrir Chrome DevTools (F12)
2. Verificar Console por errors em red
3. Ler mensagem de erro
4. Copiar mensagem exata do error
5. Buscar no `GUIA_IMPLEMENTACAO.md`

### Se responsividade não funcionar:
1. Abrir DevTools (F12)
2. Ativar "Toggle device emulation" (Ctrl+Shift+M)
3. Testar em cada breakpoint (320, 568, 768, 1024, 1920)
4. Se algo está errado, revisar CSS do breakpoint

---

## ✅ CHECKLIST FINAL

Antes de considerar "pronto":

- [ ] Todas as 6 tarefas CRÍTICO completadas ✅
- [ ] Todas as 4 tarefas ALTO completadas ✅
- [ ] Todas as 5 tarefas MÉDIO completadas ✅
- [ ] Site responsivo em ALL breakpoints
- [ ] Google Rich Results Test passou
- [ ] Mobile-Friendly Test passou
- [ ] PageSpeed > 80
- [ ] Zero console errors (F12)
- [ ] Admin sidebar funciona em mobile
- [ ] All commits feitos com mensagens claras
- [ ] Código em produção
- [ ] Monitorando em Google Search Console

---

## 📞 SUPORTE RÁPIDO

**Arquivo com análise completa:**  
📄 `RELATORIO_SEO_RESPONSIVIDADE.md`

**Arquivo com código pronto:**  
📄 `GUIA_IMPLEMENTACAO.md`

**Arquivo com referência visual:**  
📄 `RESUMO_VISUAL.md`

**Arquivo com diagramas:**  
📄 `DIAGRAMS.md`

---

**Data de início**: ___/___/______  
**Data de conclusão**: ___/___/______  
**Pontuação SEO Inicial**: 5.8/10  
**Pontuação SEO Final**: ___/10  

---

**Salve este arquivo para acompanhamento!** 📋
