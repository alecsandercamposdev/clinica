/**
 * Servidor Express - API REST
 * FACCES - Clínica Dentária
 * * Rotas disponíveis de acordo com o Banco de Dados PostgreSQL
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const db = require('./database');

const app = express();

// A Render define a porta automaticamente pela variável de ambiente PORT. Se não houver, usa 3000.
const PORT = process.env.PORT || 3000;

// ================================================
// CREDENCIAIS DO ADMIN (via variáveis de ambiente)
// ================================================
const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

// ================================================
// CAMADA DE COMPATIBILIDADE POSTGRESQL (Para manter suas rotas funcionando)
// ================================================
db.all = function(query, params, callback) {
    if (typeof params === 'function') { callback = params; params = []; }
    this.query(query.replace(/\?/g, (match, index) => `$${index + 1}`), params)
        .then(res => callback(null, res.rows))
        .catch(err => callback(err));
};

db.get = function(query, params, callback) {
    if (typeof params === 'function') { callback = params; params = []; }
    this.query(query.replace(/\?/g, (match, index) => `$${index + 1}`), params)
        .then(res => callback(null, res.rows[0] || null))
        .catch(err => callback(err));
};

// ================================================
// SECURITY MIDDLEWARE
// ================================================

// Security headers
app.use(helmet({
    contentSecurityPolicy: false, // Disabled for inline scripts in HTML pages
    crossOriginEmbedderPolicy: false // Allow YouTube embeds
}));

// Rate limiting - general
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: { erro: 'Muitas requisições. Tente novamente em 15 minutos.' }
});

// Rate limiting - stricter for auth
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit login attempts
    message: { erro: 'Muitas tentativas de login. Tente novamente em 15 minutos.' }
});

// Rate limiting - stricter for write operations
const writeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    message: { erro: 'Muitas operações de escrita. Tente novamente em 15 minutos.' }
});

app.use('/api/', generalLimiter);

// CORS - restrict to allowed origins
const allowedOrigins = process.env.CORS_ORIGINS
    ? process.env.CORS_ORIGINS.split(',')
    : undefined; // undefined allows same-origin only in production

app.use(cors({
    origin: allowedOrigins || true, // true = reflect request origin (for dev); set CORS_ORIGINS in production
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser with reasonable limits
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ limit: '5mb', extended: true }));

// Servir arquivos estáticos from a safe directory (only public assets)
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
}
app.use(express.static(publicDir));

// Serve specific allowed files from root (HTML, CSS, JS for frontend)
const allowedStaticFiles = [
    'index.html', 'admin.html', 'admin-login.html', 'profissional.html',
    'style.css', 'script.js', 'admin.js', 'manifest.json',
    'robots.txt', 'sitemap.xml'
];
allowedStaticFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        app.get(`/${file}`, (req, res) => {
            res.sendFile(filePath);
        });
    }
});

// Serve images directory
app.use('/img', express.static(path.join(__dirname, 'img')));

// Rota raiz para servir index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ================================================
// AUTHENTICATION MIDDLEWARE
// ================================================

/**
 * Server-side authentication via Basic Auth or Bearer token (session-based).
 * Protects admin write operations.
 */
const activeSessions = new Map(); // token -> { user, expiresAt }

function generateToken() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 64; i++) {
        token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
}

function requireAuth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ erro: 'Autenticação necessária' });
    }

    // Support Bearer token
    if (authHeader.startsWith('Bearer ')) {
        const token = authHeader.slice(7);
        const session = activeSessions.get(token);

        if (!session || session.expiresAt < Date.now()) {
            activeSessions.delete(token);
            return res.status(401).json({ erro: 'Sessão expirada. Faça login novamente.' });
        }

        req.adminUser = session.user;
        return next();
    }

    return res.status(401).json({ erro: 'Formato de autenticação inválido' });
}

// Login endpoint
app.post('/api/auth/login', authLimiter, (req, res) => {
    const { usuario, senha } = req.body;

    if (!usuario || !senha) {
        return res.status(400).json({ erro: 'Usuário e senha são obrigatórios' });
    }

    if (usuario === ADMIN_USER && senha === ADMIN_PASSWORD) {
        const token = generateToken();
        const expiresAt = Date.now() + (8 * 60 * 60 * 1000); // 8 hours

        activeSessions.set(token, { user: usuario, expiresAt });

        return res.json({
            mensagem: 'Login realizado com sucesso',
            token,
            expiresAt
        });
    }

    return res.status(401).json({ erro: 'Usuário ou senha incorretos' });
});

// Logout endpoint
app.post('/api/auth/logout', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.slice(7);
        activeSessions.delete(token);
    }
    res.json({ mensagem: 'Logout realizado com sucesso' });
});

// Verify session endpoint
app.get('/api/auth/verify', (req, res) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ valido: false });
    }
    const token = authHeader.slice(7);
    const session = activeSessions.get(token);
    if (!session || session.expiresAt < Date.now()) {
        activeSessions.delete(token);
        return res.status(401).json({ valido: false });
    }
    res.json({ valido: true, usuario: session.user });
});

// ================================================
// ROTA DE IMPORTAÇÃO DE DADOS
// ================================================

app.post('/api/importar-profissionais', requireAuth, writeLimiter, (req, res) => {
    const jsonPath = path.join(__dirname, 'profissionais.json');
    
    if (!fs.existsSync(jsonPath)) {
        res.status(404).json({ erro: 'Arquivo profissionais.json não encontrado' });
        return;
    }

    try {
        const dados = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        let importados = 0;
        let erros = 0;

        // Limpar tabela antes de importar (Postgres usa TRUNCATE ou DELETE)
        db.query('DELETE FROM profissionais', (err) => {
            if (err) {
                res.status(500).json({ erro: 'Erro ao limpar tabela: ' + err.message });
                return;
            }

            if (dados.length === 0) {
                return res.json({ mensagem: '✅ Nenhum profissional para importar.', total: 0 });
            }

            // Importar cada profissional
            dados.forEach(prof => {
                const sql = `
                    INSERT INTO profissionais (nome, especialidade, cadastroMedico, apresentacao, foto)
                    VALUES ($1, $2, $3, $4, $5)
                `;

                db.query(sql, [prof.nome, prof.especialidade, prof.cadastroMedico, prof.apresentacao, prof.foto])
                    .then(() => { importados++; })
                    .catch(() => { erros++; })
                    .finally(() => {
                        if (importados + erros === dados.length) {
                            res.json({
                                mensagem: '✅ Importação concluída',
                                importados,
                                erros,
                                total: dados.length
                            });
                        }
                    });
            });
        });
    } catch (err) {
        res.status(500).json({ erro: 'Erro ao processar JSON: ' + err.message });
    }
});

// ================================================
// ROTAS PARA PROFISSIONAIS
// ================================================

app.get('/api/profissionais', (req, res) => {
    db.all('SELECT * FROM profissionais ORDER BY id ASC', (err, rows) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.json(rows || []);
    });
});

app.get('/api/profissionais/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM profissionais WHERE id = $1', [id], (err, row) => {
        if (err) return res.status(500).json({ erro: err.message });
        if (!row) return res.status(404).json({ erro: 'Profissional não encontrado' });
        res.json(row);
    });
});

app.post('/api/profissionais', requireAuth, writeLimiter, (req, res) => {
    const { nome, especialidade, cadastroMedico, apresentacao, atuacao, foto } = req.body;
    
    if (!nome || !especialidade || !cadastroMedico) {
        return res.status(400).json({ erro: 'Dados obrigatórios faltando' });
    }

    // Input validation
    if (typeof nome !== 'string' || nome.length > 200) {
        return res.status(400).json({ erro: 'Nome inválido (máx. 200 caracteres)' });
    }
    if (typeof especialidade !== 'string' || especialidade.length > 200) {
        return res.status(400).json({ erro: 'Especialidade inválida (máx. 200 caracteres)' });
    }
    if (typeof cadastroMedico !== 'string' || cadastroMedico.length > 50) {
        return res.status(400).json({ erro: 'Cadastro médico inválido (máx. 50 caracteres)' });
    }

    const sql = `
        INSERT INTO profissionais (nome, especialidade, cadastroMedico, apresentacao, atuacao, foto)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING id
    `;

    db.query(sql, [nome, especialidade, cadastroMedico, apresentacao, atuacao, foto])
        .then(result => {
            res.status(201).json({ 
                id: result.rows[0].id,
                mensagem: '✅ Profissional criado com sucesso'
            });
        })
        .catch(err => res.status(500).json({ erro: err.message }));
});

app.put('/api/profissionais/:id', requireAuth, writeLimiter, (req, res) => {
    const { id } = req.params;
    const { nome, especialidade, cadastroMedico, apresentacao, atuacao, foto } = req.body;

    const sql = `
        UPDATE profissionais 
        SET nome = $1, especialidade = $2, cadastroMedico = $3, apresentacao = $4, atuacao = $5, foto = $6, atualizadoEm = CURRENT_TIMESTAMP
        WHERE id = $7 RETURNING *
    `;

    db.query(sql, [nome, especialidade, cadastroMedico, apresentacao, atuacao, foto, id])
        .then(result => {
            if (result.rowCount === 0) return res.status(404).json({ erro: 'Profissional não encontrado' });
            res.json({ mensagem: '✅ Profissional atualizado com sucesso' });
        })
        .catch(err => res.status(500).json({ erro: err.message }));
});

app.delete('/api/profissionais/:id', requireAuth, writeLimiter, (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM profissionais WHERE id = $1 RETURNING *', [id])
        .then(result => {
            if (result.rowCount === 0) return res.status(404).json({ erro: 'Profissional não encontrado' });
            res.json({ mensagem: '✅ Profissional deletado com sucesso' });
        })
        .catch(err => res.status(500).json({ erro: err.message }));
});

// ================================================
// ROTAS PARA VÍDEOS
// ================================================

app.get('/api/videos', (req, res) => {
    db.all('SELECT * FROM videos ORDER BY id ASC', (err, rows) => {
        if (err) return res.status(500).json({ erro: err.message });
        res.json(rows || []);
    });
});

app.post('/api/videos', requireAuth, writeLimiter, (req, res) => {
    const { titulo, descricao, youtubeid } = req.body;

    if (!titulo || !youtubeid) {
        return res.status(400).json({ erro: 'Título e ID do YouTube são obrigatórios' });
    }

    // Input validation
    if (typeof titulo !== 'string' || titulo.length > 200) {
        return res.status(400).json({ erro: 'Título inválido (máx. 200 caracteres)' });
    }
    if (typeof youtubeid !== 'string' || !/^[a-zA-Z0-9_-]{11}$/.test(youtubeid)) {
        return res.status(400).json({ erro: 'YouTube ID inválido (deve ter 11 caracteres alfanuméricos)' });
    }

    const sql = `
        INSERT INTO videos (titulo, descricao, youtubeid)
        VALUES ($1, $2, $3) RETURNING id
    `;

    db.query(sql, [titulo, descricao || '', youtubeid])
        .then(result => {
            res.status(201).json({ 
                id: result.rows[0].id,
                mensagem: '✅ Vídeo criado com sucesso'
            });
        })
        .catch(err => {
            if (err.message.includes('unique') || err.message.includes('Key (youtubeid)')) {
                res.status(400).json({ erro: 'Este vídeo já foi cadastrado' });
            } else {
                res.status(500).json({ erro: err.message });
            }
        });
});

app.put('/api/videos/:id', requireAuth, writeLimiter, (req, res) => {
    const { id } = req.params;
    const { titulo, descricao, youtubeid } = req.body;

    if (!titulo || !youtubeid) {
        return res.status(400).json({ erro: 'Título e YouTube ID são obrigatórios' });
    }

    // Input validation
    if (typeof titulo !== 'string' || titulo.length > 200) {
        return res.status(400).json({ erro: 'Título inválido (máx. 200 caracteres)' });
    }
    if (typeof youtubeid !== 'string' || !/^[a-zA-Z0-9_-]{11}$/.test(youtubeid)) {
        return res.status(400).json({ erro: 'YouTube ID inválido' });
    }

    const sql = `
        UPDATE videos
        SET titulo = $1, descricao = $2, youtubeid = $3, atualizadoEm = CURRENT_TIMESTAMP
        WHERE id = $4 RETURNING *
    `;

    db.query(sql, [titulo, descricao || '', youtubeid, id])
        .then(result => {
            if (result.rowCount === 0) return res.status(404).json({ erro: 'Vídeo não encontrado' });
            res.json({ mensagem: '✅ Vídeo atualizado com sucesso' });
        })
        .catch(err => {
            if (err.message.includes('unique') || err.message.includes('Key (youtubeid)')) {
                res.status(400).json({ erro: 'Este YouTube ID já foi cadastrado' });
            } else {
                res.status(500).json({ erro: err.message });
            }
        });
});

app.delete('/api/videos/:id', requireAuth, writeLimiter, (req, res) => {
    const { id } = req.params;

    db.query('DELETE FROM videos WHERE id = $1 RETURNING *', [id])
        .then(result => {
            if (result.rowCount === 0) return res.status(404).json({ erro: 'Vídeo não encontrado' });
            res.json({ mensagem: '✅ Vídeo deletado com sucesso' });
        })
        .catch(err => res.status(500).json({ erro: err.message }));
});

// ================================================
// ROTAS PARA MÉTRICAS
// ================================================

app.get('/api/metricas', (req, res) => {
    const hoje = new Date().toISOString().split('T')[0];
    
    db.get('SELECT * FROM metricas WHERE data = $1', [hoje], (err, row) => {
        if (err) return res.status(500).json({ erro: err.message });
        
        if (!row) {
            return res.json({
                data: hoje,
                acessos: 0,
                conversoes: 0,
                conversoesPorTipo: {}
            });
        }

        // Garante o parse correto do JSON da coluna de texto
        if (typeof row.conversoesportipo === 'string') {
            row.conversoesPorTipo = JSON.parse(row.conversoesportipo || '{}');
        } else {
            row.conversoesPorTipo = row.conversoesportipo || {};
        }
        res.json(row);
    });
});

app.get('/api/metricas/total/geral', (req, res) => {
    db.all('SELECT SUM(acessos) as totalAcessos, SUM(conversoes) as totalConversoes FROM metricas', (err, rows) => {
        if (err) return res.status(500).json({ erro: err.message });

        const resultado = rows[0] || {};
        const totalAcessos = parseInt(resultado.totalacessos || resultado.totalAcessos || 0);
        const totalConversoes = parseInt(resultado.totalconversoes || resultado.totalConversoes || 0);
        const taxa = totalAcessos > 0 ? ((totalConversoes / totalAcessos) * 100).toFixed(2) : '0.00';

        res.json({
            totalAcessos,
            totalConversoes,
            taxaConversao: parseFloat(taxa)
        });
    });
});

app.post('/api/metricas/acesso', (req, res) => {
    const hoje = new Date().toISOString().split('T')[0];

    // Sintaxe ON CONFLICT compatível com PostgreSQL
    db.query(
        `INSERT INTO metricas (data, acessos) VALUES ($1, 1)
         ON CONFLICT(data) DO UPDATE SET acessos = metricas.acessos + 1, atualizadoEm = CURRENT_TIMESTAMP`,
        [hoje]
    )
    .then(() => res.json({ mensagem: 'Acesso registrado' }))
    .catch(err => res.status(500).json({ erro: err.message }));
});

app.post('/api/metricas/conversao', (req, res) => {
    const { tipo = 'whatsapp' } = req.body;
    const hoje = new Date().toISOString().split('T')[0];

    db.get('SELECT * FROM metricas WHERE data = $1', [hoje], (err, row) => {
        if (err) return res.status(500).json({ erro: err.message });

        const rawConversoes = row ? (row.conversoesportipo || row.conversoesPorTipo) : null;
        let conversoesPorTipo = {};
        
        if (rawConversoes) {
            conversoesPorTipo = typeof rawConversoes === 'string' ? JSON.parse(rawConversoes) : rawConversoes;
        }

        if (!row) {
            conversoesPorTipo[tipo] = 1;
            db.query(
                `INSERT INTO metricas (data, conversoes, conversoesPorTipo) VALUES ($1, 1, $2)`,
                [hoje, JSON.stringify(conversoesPorTipo)]
            )
            .then(() => res.json({ mensagem: 'Conversão registrada' }))
            .catch(err => res.status(500).json({ erro: err.message }));
        } else {
            conversoesPorTipo[tipo] = (conversoesPorTipo[tipo] || 0) + 1;
            db.query(
                `UPDATE metricas SET conversoes = conversoes + 1, conversoesPorTipo = $1, updatedAt = CURRENT_TIMESTAMP WHERE data = $2`,
                [JSON.stringify(conversoesPorTipo), hoje]
            )
            .then(() => res.json({ mensagem: 'Conversão registrada' }))
            .catch(err => res.status(500).json({ erro: err.message }));
        }
    });
});

// ================================================
// ROTA DE SAÚDE
// ================================================
app.get('/api/saude', (req, res) => {
    res.json({ status: '✅ Servidor rodando normalmente', timestamp: new Date() });
});

// ================================================
// INICIALIZAR SERVIDOR
// ================================================

function inicializarDados() {
    db.get('SELECT COUNT(*) as count FROM profissionais', (err, row) => {
        if (err) {
            console.error('❌ Erro ao verificar profissionais:', err);
            return;
        }

        const count = parseInt(row.count || 0);

        if (count === 0) {
            console.log('📥 Importando profissionais do JSON...');
            const jsonPath = path.join(__dirname, 'profissionais.json');

            if (fs.existsSync(jsonPath)) {
                try {
                    const dados = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

                    dados.forEach(prof => {
                        const sql = `
                            INSERT INTO profissionais (nome, especialidade, cadastroMedico, apresentacao, foto)
                            VALUES ($1, $2, $3, $4, $5)
                        `;
                        db.query(sql, [prof.nome, prof.especialidade, prof.cadastroMedico, prof.apresentacao, prof.foto])
                          .catch(err => console.error('❌ Erro ao importar:', err));
                    });

                    console.log(`✅ ${dados.length} profissionais importados com sucesso!`);
                } catch (err) {
                    console.error('❌ Erro ao processar profissionais.json:', err);
                }
            }
        } else {
            console.log(`✅ ${count} profissionais já cadastrados no banco`);
        }
    });
}

app.listen(PORT, () => {
    // Aguardar um pouco para as tabelas as síncronas estarem prontas no Postgres
    setTimeout(inicializarDados, 1500);

    console.log(`🚀 Servidor escutando perfeitamente na porta ${PORT}`);
});