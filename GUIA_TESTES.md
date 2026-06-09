# 🧪 GUIA DE TESTES - FACCES Website

## URLs Principais para Testar

### 🏠 Público (Indexável)
- `http://localhost:3000/` - Landing page (index.html)
- `http://localhost:3000/profissional.html?id=1` - Página de profissional
- `http://localhost:3000/profissional.html?id=2` - Outro profissional

### 🔐 Admin (Não-Indexável)
- `http://localhost:3000/admin-login.html` - Login (user: admin, pass: admin123)
- `http://localhost:3000/admin.html` - Painel admin

### 📋 Arquivos de Configuração
- `http://localhost:3000/robots.txt` - Regras de crawling
- `http://localhost:3000/sitemap.xml` - Mapa do site
- `http://localhost:3000/manifest.json` - Configuração PWA

---

## 📱 Testes de Responsividade

### Breakpoints a Testar

#### 1. **Extra Small (≤375px)** - iPhone SE
```
- ✅ Hambúrguer menu deve estar visível
- ✅ Logo deve ser responsivo
- ✅ Botões devem ter ≥44px altura
- ✅ Grids devem ter 1 coluna
- ✅ Padding reduzido
- ✅ Fonte reduzida mas legível
```

Viewport: `375x667`

#### 2. **Mobile (≤480px)** - Smartphone moderno
```
- ✅ Menu hambúrguer animado
- ✅ Conteúdo centralizado
- ✅ Cards empilhados (1 coluna)
- ✅ Imagens ocupam 100% de largura
- ✅ Formulário otimizado para toque
```

Viewport: `480x800`

#### 3. **Mobile Large (481-768px)** - Tablet portrait
```
- ✅ Grids em 2 colunas (profissionais, vídeos)
- ✅ Menu pode expandir
- ✅ Imagens maiores
- ✅ Melhor espaçamento
```

Viewport: `600x800`

#### 4. **Tablet (769-1024px)** - iPad
```
- ✅ Navegação no topo (desktop)
- ✅ Grids em 2 colunas
- ✅ Conteúdo bem distribuído
- ✅ Sidebar pode aparecer
```

Viewport: `768x1024`

#### 5. **Tablet Large (1024-1200px)** - iPad Pro
```
- ✅ Layout semelhante ao desktop
- ✅ Grids em 3 colunas
- ✅ Espaçamento generoso
```

Viewport: `1024x768`

#### 6. **Desktop (1200px+)** - Monitor
```
- ✅ Layout completo otimizado
- ✅ Grids em 3+ colunas
- ✅ Hover effects funcionando
- ✅ Navegação completa visível
```

Viewport: `1366x768`, `1920x1080`

---

## 🔍 Testes de SEO

### Validação de Meta Tags

#### No Browser Console (F12):
```javascript
// Verificar meta tags
document.querySelectorAll('meta').forEach(m => {
  console.log(m.name, m.content || m.getAttribute('property'));
});

// Verificar canonical
console.log('Canonical:', document.querySelector('link[rel=canonical]')?.href);

// Verificar Open Graph
console.log('OG Title:', document.querySelector('meta[property="og:title"]')?.content);

// Verificar JSON-LD
console.log('Schema:', document.querySelectorAll('script[type="application/ld+json"]'));
```

#### Validadores Google:
1. **Mobile-Friendly Test**
   - URL: https://search.google.com/test/mobile-friendly
   - Testar: `http://seu-site.com`
   - Esperar: "Página é compatível com dispositivos móveis"

2. **Rich Results Test**
   - URL: https://search.google.com/test/rich-results
   - Testar: `http://seu-site.com`
   - Esperar: MedicalBusiness e Organization schemas

3. **PageSpeed Insights**
   - URL: https://pagespeed.web.dev/
   - Testar: `http://seu-site.com`
   - Analisar: Performance, SEO, Acessibilidade

### Manual Inspection
- ✅ Title tag muda ao navegar (por página)
- ✅ Meta description presente
- ✅ Canonical URL correto
- ✅ Open Graph image valida
- ✅ Favicon SVG mostra 🦷
- ✅ robots.txt bloqueia `/admin*`
- ✅ sitemap.xml contém URLs

---

## 📹 Testes de Funcionalidade

### Profissionais
- [ ] Carregar lista de profissionais da API
- [ ] Clique em profissional abre página dinâmica
- [ ] Foto do profissional exibe corretamente
- [ ] Especialidade mostra corretamente

### Vídeos
- [ ] Vídeos carregam da API
- [ ] Iframe dos vídeos renderiza
- [ ] Responsivo (resize iframe)
- [ ] Título e descrição visível

### Navegação
- [ ] Links anchor funcionam (#medicos, #especialidades, etc)
- [ ] Scroll suave ativado
- [ ] Menu mobile abre/fecha
- [ ] Clique em link fecha menu automaticamente

### Contato
- [ ] WhatsApp button funciona
- [ ] Link de email valido
- [ ] Telefone é string válida
- [ ] Endereço correto

---

## 🎨 Testes de Design

### Cores & Contraste
- [ ] Cor primária (#002B2B) legível
- [ ] Cor secundária (#00796B) legível
- [ ] Botões com alto contraste
- [ ] Texto em fundo escuro legível

### Tipografia
- [ ] Font-size 16px em inputs (iOS)
- [ ] Headlines hierárquicos (h1 > h2 > h3)
- [ ] Line-height adequado (1.5+)
- [ ] Espaçamento entre parágrafos

### Consistência
- [ ] Espaçamento uniforme
- [ ] Sombras consistentes
- [ ] Bordas arredondadas consistentes
- [ ] Alinhamento de grid

---

## ⚡ Testes de Performance

### Chrome DevTools - Lighthouse
```
1. F12 → Lighthouse
2. Categories: Performance, SEO, Accessibility, Best Practices
3. Device: Mobile
4. Alvo: Scores > 90
```

### Network Tab
- [ ] CSS: < 50KB
- [ ] JS: < 100KB
- [ ] Imagens: Otimizadas
- [ ] API calls: < 200ms

### Verificar:
- [ ] Sem erros em console
- [ ] Sem warnings em console
- [ ] Carregamento completo < 3s

---

## 🔐 Testes de Segurança

### Admin Page
- [ ] Login requer credenciais
- [ ] Credenciais atualizadas (não admin/admin123)
- [ ] Meta `robots: noindex, nofollow` presente
- [ ] Admin.html não indexável

### robots.txt
- [ ] `/admin*` bloqueado
- [ ] `/admin-login*` bloqueado
- [ ] Páginas públicas permitidas

### Headers
- [ ] `Content-Type: text/html; charset=utf-8` correto
- [ ] `X-Content-Type-Options: nosniff` recomendado
- [ ] CORS configurado se necessário

---

## 📊 Checklist Final

### SEO
- [ ] Meta tags em todas as páginas
- [ ] Canonical URLs definidas
- [ ] robots.txt criado
- [ ] sitemap.xml criado
- [ ] JSON-LD estruturado
- [ ] Open Graph tags
- [ ] Twitter Cards
- [ ] Title tags únicos

### Responsividade
- [ ] 5 breakpoints implementados
- [ ] Hambúrguer menu em mobile
- [ ] Grids adaptativos
- [ ] Imagens responsivas
- [ ] Testado em 6+ tamanhos

### Funcionalidade
- [ ] API loading profissionais ✅
- [ ] API loading vídeos ✅
- [ ] Admin CRUD completo ✅
- [ ] Navegação suave ✅
- [ ] WhatsApp integrado ✅

### Acessibilidade
- [ ] Font-size 16px inputs ✅
- [ ] Touch targets 44px+ ✅
- [ ] Contraste adequado ✅
- [ ] Alt text em imagens ✅

### Performance
- [ ] Lighthouse Score > 90
- [ ] Carregamento < 3s
- [ ] Sem erros console
- [ ] Imagens otimizadas

---

## 🚀 Deployment Checklist

Antes de ir para produção:

- [ ] Domínio registrado
- [ ] SSL/TLS ativo (HTTPS)
- [ ] DNS apontando correto
- [ ] Sitemap submetido no GSC
- [ ] robots.txt correto na raiz
- [ ] Analytics (Google Analytics/Matomo)
- [ ] Backup database configurado
- [ ] Logs habilitados
- [ ] Monitoring ativo
- [ ] Credenciais admin alteradas (produção)

---

**Data:** 2026-06-05  
**Versão:** 1.5.0  
**Testador:** QA FACCES  
**Status:** Pronto para Validação
