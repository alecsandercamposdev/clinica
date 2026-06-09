# 🦷 FACCES - Clínica Dentária

Site profissional, responsivo e otimizado para SEO - Clínica Dentária FACCES. Desenvolvido com HTML5 semântico, CSS3 moderno, JavaScript funcional e Node.js/Express backend.

**Versão:** 1.5.0 | **Status:** ✅ Pronto para Produção

## 📋 Características

### ✨ Design e UX
- **Responsive Design** - Mobile First com 5 breakpoints (320px, 375px, 480px, 768px, 1024px, 1200px+)
- **Variáveis CSS** - Paleta de cores, espaçamentos, sombras e transições organizadas
- **CSS Grid & Flexbox** - Layouts modernos e adaptativos
- **Hamburger Menu** - Menu responsivo com animação X em mobile

### 🔍 SEO & Performance
- **Meta Tags Completas** - Title, description, keywords, canonical, robots
- **Open Graph** - Compartilhamento otimizado em redes sociais
- **Twitter Cards** - Visualização aprimorada no Twitter
- **JSON-LD Structured Data** - MedicalBusiness + Organization schemas
- **Favicon SVG** - 🦷 Emoji em todas as páginas
- **Sitemap XML** - Mapa do site com prioridades
- **robots.txt** - Controle de crawling (bloqueia /admin*)
- **Progressive Web App** - manifest.json com suporte offline

### 🔧 Funcionalidades JavaScript
- **Navegação Suave** - Smooth scroll entre seções
- **Menu Responsivo** - Abertura/fechamento com click fora
- **API REST** - Carregamento dinâmico de profissionais e vídeos
- **Rastreamento** - Conversão de leads e métricas de acesso
- **Admin CRUD** - Gerenciamento completo de profissionais e vídeos

### 📱 Seções do Site
1. **Header Fixo** - Navegação responsiva com logo
2. **Home** - Banner com chamada para ação (CTA)
3. **Nossos Profissionais** - Cards dinâmicos carregados da API
4. **Especialidades** - Grid de 6 especialidades
5. **Vídeos Educativos** - Grid de vídeos dinâmica (sem hard-code)
6. **Contato** - Formulário, informações e Google Maps
7. **Footer** - Links e informações adicionais

### 🛠️ Funcionalidades Backend
- **Node.js + Express** - Server API REST
- **SQLite3** - Banco de dados leve e portátil
- **CRUD Profissionais** - Create, Read, Update, Delete
- **CRUD Vídeos** - Create, Read, Update, Delete (novo)
- **Métricas** - Rastreamento de acessos e conversões
- **Import JSON** - Importação em lote de profissionais
--cor-secundaria: #00796B
--cor-destaque: #26A69A
--cor-light: #E0F2F1
```

### Espaçamentos
```css
--espaco-xs: 0.5rem
--espaco-sm: 1rem
--espaco-md: 1.5rem
--espaco-lg: 2rem
--espaco-xl: 3rem
--espaco-2xl: 4rem
```

## 📁 Estrutura de Arquivos

```
Facces/
├── index.html      # Estrutura HTML5 semântica
├── style.css       # Estilos CSS3 com variáveis e Grid
├── script.js       # Lógica JavaScript funcional
└── README.md       # Documentação (este arquivo)
```

## 🚀 Como Usar

### 1. **Instalação Inicial**

```bash
# Clone ou copie o projeto
cd /path/to/Facces

# Instale as dependências
npm install
```

### 2. **Rodando o Servidor**

```bash
# Inicie o servidor Node.js
npm start

# O servidor estará em: http://localhost:3000
```

**Saída esperada:**
```
✅ Servidor rodando em http://localhost:3000
✅ Conectado ao banco de dados SQLite: facces.db
✅ 5 profissionais já cadastrados
```

### 3. **Acessando a Aplicação**

- **Landing Page:** http://localhost:3000
- **Admin Login:** http://localhost:3000/admin-login.html
  - Usuário: `admin`
  - Senha: `admin123` (⚠️ Altere em produção!)
- **Admin Dashboard:** http://localhost:3000/admin.html (após login)

### 4. **Estrutura de Diretórios**

```
Facces/
├── index.html              # Landing page
├── profissional.html       # Página dinâmica de profissional
├── admin.html              # Painel administrativo
├── admin-login.html        # Login do admin
├── admin.js                # Lógica do admin (CRUD)
├── script.js               # Lógica da landing page
├── style.css               # Estilos globais responsivos
├── server.js               # API Express.js
├── database.js             # SQLite wrapper
├── package.json            # Dependências Node.js
├── profissionais.json      # Dados exemplo para importação
├── robots.txt              # Configuração de crawling (SEO)
├── sitemap.xml             # Mapa do site (SEO)
├── manifest.json           # PWA Configuration
├── facces.db               # Banco de dados SQLite (auto-criado)
├── img/                    # Imagens e assets
└── README.md               # Este arquivo
```

## 🔌 API REST Endpoints

### Profissionais

```bash
# Listar todos os profissionais
GET /api/profissionais

# Criar novo profissional
POST /api/profissionais
Body: {
  "nome": "Dr. João",
  "especialidade": "Odontologia Geral",
  "foto": "base64-image-data"
}

# Atualizar profissional
PUT /api/profissionais/:id
Body: { "nome": "...", "especialidade": "..." }

# Deletar profissional
DELETE /api/profissionais/:id
```

### Vídeos

```bash
# Listar todos os vídeos
GET /api/videos

# Criar novo vídeo
POST /api/videos
Body: {
  "titulo": "Higiene Bucal",
  "descricao": "Como escovar os dentes corretamente",
  "youtubeId": "dQw4w9WgXcQ"
}

# Atualizar vídeo (NOVO)
PUT /api/videos/:id
Body: { "titulo": "...", "descricao": "...", "youtubeId": "..." }

# Deletar vídeo
DELETE /api/videos/:id
```

### Métricas

```bash
# Obter estatísticas gerais
GET /api/metricas/total/geral

# Registrar acesso
POST /api/metricas/acesso
Body: { "pagina": "/", "referrer": "..." }

# Registrar conversão
POST /api/metricas/conversao
Body: { "tipo": "contato", "origem": "#videos" }
```

### Importação em Lote

```bash
# Importar profissionais do JSON
POST /api/importar-profissionais
Body: FormData com arquivo profissionais.json
```

## 🎨 Customizações Recomendadas

### 1. Substituir Textos
- Logo e tagline
- Nomes dos médicos (via admin)
- Descrições de especialidades
- Informações de contato

### 2. Adicionar Imagens
- Logo da clínica
- Fotos dos médicos (upload no admin)
- Foto do consultório
- Banner principal

### 3. Alterar Credenciais Admin

**Arquivo: admin-login.html (linhas ~175)**
```javascript
// Altere estas linhas
if (username === 'admin' && password === 'admin123') {
    // MUDE PARA SUAS CREDENCIAIS REAIS
}
```

### 4. Alterar Google Maps

1. Acesse [Google Maps Embed](https://maps.google.com)
2. Localize seu consultório
3. Clique em "Compartilhar" → "Embed"
4. Copie o iframe e substitua em `index.html`

### 5. Atualizar URLs e Domínios

**Arquivo: robots.txt**
```
Sitemap: https://seu-site.com/sitemap.xml
```

**Arquivo: sitemap.xml**
```xml
<loc>https://seu-site.com/</loc>
```

**Arquivo: manifest.json**
```json
{
  "name": "FACCES Clínica Dentária"
}
```

## 📱 Responsividade - Breakpoints

O site é otimizado para:

| Dispositivo | Largura | Características |
|-------------|---------|---|
| **Smartphone antigo** | ≤375px | Fonte reduzida, padding mínimo |
| **Smartphone moderno** | ≤480px | Hambúrguer ativo, 1 coluna |
| **Phablet** | 481-768px | 2 colunas em grids |
| **Tablet** | 769-1024px | Layout melhorado, 2 colunas |
| **Desktop pequeno** | 1024-1200px | 3 colunas, spacing generoso |
| **Desktop grande** | 1200px+ | Layout completo, 3+ colunas |

## 🧪 Testes

Para validar a aplicação, consulte os arquivos:

- **[GUIA_TESTES.md](GUIA_TESTES.md)** - Checklist completo de testes
- **[RESUMO_IMPLEMENTACOES.md](RESUMO_IMPLEMENTACOES.md)** - Detalhe das melhorias de SEO

### Teste Rápido de Responsividade

1. Abra http://localhost:3000 no navegador
2. Pressione F12 (DevTools)
3. Clique em "Toggle device toolbar" (Ctrl+Shift+M)
4. Teste nos breakpoints: 375px, 480px, 768px, 1024px, 1366px

## 🌐 SEO & Performance

### Meta Tags Implementadas
- ✅ Title, description, keywords
- ✅ Open Graph (Facebook, LinkedIn)
- ✅ Twitter Cards
- ✅ Canonical URLs
- ✅ JSON-LD MedicalBusiness schema
- ✅ Robots directives

### Performance
- ✅ CSS Grid otimizado
- ✅ API loading dinâmico
- ✅ Sem hard-coded content
- ✅ Imagens responsivas
- ✅ Font-size 16px em inputs (sem auto-zoom iOS)

### Validação Google
1. **PageSpeed Insights:** https://pagespeed.web.dev/
2. **Mobile-Friendly Test:** https://search.google.com/test/mobile-friendly
3. **Rich Results:** https://search.google.com/test/rich-results

## 📱 Responsividade

O site é otimizado para:
- **Desktop** (1200px+) - Layout em grid de 2 colunas
- **Tablet** (768px - 1199px) - Layout adaptado
- **Mobile** (até 568px) - Menu hamburger, single column
- **Extra Small** (até 375px) - Fontes reduzidas, máxima legibilidade

## 🎯 Funcionalidades JavaScript Detalhadas

### Smooth Scroll
```javascript
// Navegação suave entre seções com offset para header fixo
navegarParaSecao('#home');
```

### Menu Mobile
- Toggle com animação das barras (hambúrguer → X)
- Fecha ao clicar em um link
- Fecha ao clicar fora
- Se redimensionar para desktop, fecha automaticamente

### Validação de Formulário
- Email: valida formato completo
- Telefone: aceita formatos variados (com parênteses, hífen, etc)
- Mensagem: mínimo de 10 caracteres
- Mostra mensagens de erro personalizadas
- Sucesso: mensagem verde temporária

## 🔌 Integração Google Maps

O mapa está configurado com:
- Localização de exemplo (Av. Paulista, São Paulo)
- Responsivo
- Altere o `src` do iframe para seu endereço

```html
<iframe src="https://www.google.com/maps/embed?pb=...">
```

## 🎨 Customizações Recomendadas

### 1. Substituir Textos
- Logo e tagline
- Nomes dos médicos
- Descrições de especialidades
- Informações de contato

### 2. Adicionar Imagens
- Logo da clínica
- Fotos dos médicos
- Foto do consultório
- Banner principal

### 3. Alterar Google Maps
Gere um link do Google Maps embed para seu endereço:
1. Acesse Google Maps
2. Localize seu consultório
3. Clique em "Compartilhar"
4. Escolha "Embed"
5. Copie o iframe

### 4. Integrar com Backend
Para realmente enviar os formulários:
```javascript
// Modifique a função validarEEnviarFormulario
// Adicione um fetch POST para seu servidor
fetch('/api/enviar-contato', {
    method: 'POST',
    body: JSON.stringify(dados)
})
```

## 🌐 Compatibilidade

- ✅ Chrome/Edge (versão 90+)
- ✅ Firefox (versão 88+)
- ✅ Safari (versão 14+)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## ♿ Acessibilidade

- Semântica HTML5 correta
- Labels em todos os campos
- ARIA labels para navegação
- Contraste de cores acessível
- Navegação por teclado

## 📝 Notas Importantes

1. **Placeholder de Imagens**: Os placeholders são divs coloridas. Substitua por imagens reais.

2. **Dados de Contato**: Atualize com seus dados reais (endereço, telefone, email).

3. **Médicos**: Adicione os nomes e especialidades dos seus profissionais.

4. **Google Maps**: Configure o mapa com sua localização real.

5. **Formulário**: Configure o backend para receber os dados (atualmente é apenas frontend).

## 🚀 Deploy

Para colocar o site online, você pode usar:
- **Netlify** (arraste a pasta)
- **Vercel** (conecte seu Git)
- **GitHub Pages** (hospedagem gratuita)
- **Servidor próprio** (qualquer host de arquivos estáticos)

## 📄 Licença

Desenvolvido especialmente para a clínica FACCES.

## 💬 Suporte

Para dúvidas sobre o código ou customizações:
1. Revise os comentários no HTML, CSS e JS
2. Consulte a documentação das ferramentas utilizadas
3. Adapte o código conforme necessário

---

**Desenvolvido com ❤️ para sua saúde bucal** 🦷
