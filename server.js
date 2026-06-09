/**
 * Servidor Express - API REST
 * FACCES - Clínica Dentária
 * 
 * Rotas disponíveis:
 * - GET/POST /api/profissionais
 * - GET/PUT/DELETE /api/profissionais/:id
 * - GET/POST /api/videos
 * - GET/PUT/DELETE /api/videos/:id
 * - GET/POST /api/metricas
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const db = require('./database');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Servir arquivos estáticos (HTML, CSS, JS, imagens)
app.use(express.static(path.join(__dirname)));

// Rota raiz para servir index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// ================================================
// ROTA DE IMPORTAÇÃO DE DADOS
// ================================================

/**
 * POST /api/importar-profissionais - Importar profissionais do JSON
 */
app.post('/api/importar-profissionais', (req, res) => {
    const jsonPath = path.join(__dirname, 'profissionais.json');
    
    if (!fs.existsSync(jsonPath)) {
        res.status(404).json({ erro: 'Arquivo profissionais.json não encontrado' });
        return;
    }

    try {
        const dados = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        let importados = 0;
        let erros = 0;

        // Limpar tabela antes de importar
        db.run('DELETE FROM profissionais', (err) => {
            if (err) {
                res.status(500).json({ erro: 'Erro ao limpar tabela: ' + err.message });
                return;
            }

            // Importar cada profissional
            dados.forEach(prof => {
                const sql = `
                    INSERT INTO profissionais (nome, especialidade, cadastroMedico, apresentacao, foto)
                    VALUES (?, ?, ?, ?, ?)
                `;

                db.run(sql, [prof.nome, prof.especialidade, prof.cadastroMedico, prof.apresentacao, prof.foto], (err) => {
                    if (err) {
                        erros++;
                    } else {
                        importados++;
                    }

                    // Se foi o último, responder
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

/**
 * GET /api/profissionais - Listar todos os profissionais
 */
app.get('/api/profissionais', (req, res) => {
    db.all('SELECT * FROM profissionais ORDER BY id ASC', (err, rows) => {
        if (err) {
            res.status(500).json({ erro: err.message });
            return;
        }
        res.json(rows || []);
    });
});

/**
 * GET /api/profissionais/:id - Obter um profissional específico
 */
app.get('/api/profissionais/:id', (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM profissionais WHERE id = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ erro: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ erro: 'Profissional não encontrado' });
            return;
        }
        res.json(row);
    });
});

/**
 * POST /api/profissionais - Criar novo profissional
 */
app.post('/api/profissionais', (req, res) => {
    const { nome, especialidade, cadastroMedico, apresentacao, atuacao, foto } = req.body;
    
    if (!nome || !especialidade || !cadastroMedico) {
        res.status(400).json({ erro: 'Dados obrigatórios faltando' });
        return;
    }

    const sql = `
        INSERT INTO profissionais (nome, especialidade, cadastroMedico, apresentacao, atuacao, foto)
        VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.run(sql, [nome, especialidade, cadastroMedico, apresentacao, atuacao, foto], function(err) {
        if (err) {
            res.status(500).json({ erro: err.message });
            return;
        }
        res.status(201).json({ 
            id: this.lastID,
            mensagem: '✅ Profissional criado com sucesso'
        });
    });
});

/**
 * PUT /api/profissionais/:id - Atualizar profissional
 */
app.put('/api/profissionais/:id', (req, res) => {
    const { id } = req.params;
    const { nome, especialidade, cadastroMedico, apresentacao, atuacao, foto } = req.body;

    const sql = `
        UPDATE profissionais 
        SET nome = ?, especialidade = ?, cadastroMedico = ?, apresentacao = ?, atuacao = ?, foto = ?, atualizadoEm = CURRENT_TIMESTAMP
        WHERE id = ?
    `;

    db.run(sql, [nome, especialidade, cadastroMedico, apresentacao, atuacao, foto, id], function(err) {
        if (err) {
            res.status(500).json({ erro: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ erro: 'Profissional não encontrado' });
            return;
        }
        res.json({ mensagem: '✅ Profissional atualizado com sucesso' });
    });
});

/**
 * DELETE /api/profissionais/:id - Deletar profissional
 */
app.delete('/api/profissionais/:id', (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM profissionais WHERE id = ?', [id], function(err) {
        if (err) {
            res.status(500).json({ erro: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ erro: 'Profissional não encontrado' });
            return;
        }
        res.json({ mensagem: '✅ Profissional deletado com sucesso' });
    });
});

// ================================================
// ROTAS PARA VÍDEOS
// ================================================

/**
 * GET /api/videos - Listar todos os vídeos
 */
app.get('/api/videos', (req, res) => {
    db.all('SELECT * FROM videos ORDER BY id ASC', (err, rows) => {
        if (err) {
            res.status(500).json({ erro: err.message });
            return;
        }
        res.json(rows || []);
    });
});

/**
 * POST /api/videos - Criar novo vídeo
 */
app.post('/api/videos', (req, res) => {
    const { titulo, descricao, youtubeId } = req.body;

    if (!titulo || !youtubeId) {
        res.status(400).json({ erro: 'Título e ID do YouTube são obrigatórios' });
        return;
    }

    const sql = `
        INSERT INTO videos (titulo, descricao, youtubeId)
        VALUES (?, ?, ?)
    `;

    db.run(sql, [titulo, descricao || '', youtubeId], function(err) {
        if (err) {
            if (err.message.includes('UNIQUE')) {
                res.status(400).json({ erro: 'Este vídeo já foi cadastrado' });
            } else {
                res.status(500).json({ erro: err.message });
            }
            return;
        }
        res.status(201).json({ 
            id: this.lastID,
            mensagem: '✅ Vídeo criado com sucesso'
        });
    });
});

/**
 * PUT /api/videos/:id - Atualizar vídeo
 */
app.put('/api/videos/:id', (req, res) => {
    const { id } = req.params;
    const { titulo, descricao, youtubeId } = req.body;

    if (!titulo || !youtubeId) {
        res.status(400).json({ erro: 'Título e YouTube ID são obrigatórios' });
        return;
    }

    const sql = `
        UPDATE videos
        SET titulo = ?, descricao = ?, youtubeId = ?, atualizadoEm = CURRENT_TIMESTAMP
        WHERE id = ?
    `;

    db.run(sql, [titulo, descricao || '', youtubeId, id], function(err) {
        if (err) {
            if (err.message.includes('UNIQUE')) {
                res.status(400).json({ erro: 'Este YouTube ID já foi cadastrado' });
            } else {
                res.status(500).json({ erro: err.message });
            }
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ erro: 'Vídeo não encontrado' });
            return;
        }
        res.json({ mensagem: '✅ Vídeo atualizado com sucesso' });
    });
});

/**
 * DELETE /api/videos/:id - Deletar vídeo
 */
app.delete('/api/videos/:id', (req, res) => {
    const { id } = req.params;

    db.run('DELETE FROM videos WHERE id = ?', [id], function(err) {
        if (err) {
            res.status(500).json({ erro: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ erro: 'Vídeo não encontrado' });
            return;
        }
        res.json({ mensagem: '✅ Vídeo deletado com sucesso' });
    });
});

// ================================================
// ROTAS PARA MÉTRICAS
// ================================================

/**
 * GET /api/metricas - Obter métricas do dia
 */
app.get('/api/metricas', (req, res) => {
    const hoje = new Date().toISOString().split('T')[0];
    
    db.get('SELECT * FROM metricas WHERE data = ?', [hoje], (err, row) => {
        if (err) {
            res.status(500).json({ erro: err.message });
            return;
        }
        
        // Se não existe, retornar zeros
        if (!row) {
            res.json({
                data: hoje,
                acessos: 0,
                conversoes: 0,
                conversoesPorTipo: {}
            });
            return;
        }

        // Fazer parse do JSON
        row.conversoesPorTipo = JSON.parse(row.conversoesPorTipo || '{}');
        res.json(row);
    });
});

/**
 * GET /api/metricas/total - Obter total de acessos e conversões de todos os tempos
 */
app.get('/api/metricas/total/geral', (req, res) => {
    db.all('SELECT SUM(acessos) as totalAcessos, SUM(conversoes) as totalConversoes FROM metricas', (err, rows) => {
        if (err) {
            res.status(500).json({ erro: err.message });
            return;
        }

        const resultado = rows[0];
        const totalAcessos = resultado.totalAcessos || 0;
        const totalConversoes = resultado.totalConversoes || 0;
        const taxa = totalAcessos > 0 ? ((totalConversoes / totalAcessos) * 100).toFixed(2) : '0.00';

        res.json({
            totalAcessos,
            totalConversoes,
            taxaConversao: parseFloat(taxa)
        });
    });
});

/**
 * POST /api/metricas/acesso - Registrar novo acesso
 */
app.post('/api/metricas/acesso', (req, res) => {
    const hoje = new Date().toISOString().split('T')[0];

    db.run(
        `INSERT INTO metricas (data, acessos) VALUES (?, 1)
         ON CONFLICT(data) DO UPDATE SET acessos = acessos + 1, atualizadoEm = CURRENT_TIMESTAMP`,
        [hoje],
        function(err) {
            if (err) {
                res.status(500).json({ erro: err.message });
                return;
            }
            res.json({ mensagem: 'Acesso registrado' });
        }
    );
});

/**
 * POST /api/metricas/conversao - Registrar nova conversão
 */
app.post('/api/metricas/conversao', (req, res) => {
    const { tipo = 'whatsapp' } = req.body;
    const hoje = new Date().toISOString().split('T')[0];

    // Primeiro, verificar se existe registro para hoje
    db.get('SELECT * FROM metricas WHERE data = ?', [hoje], (err, row) => {
        if (err) {
            res.status(500).json({ erro: err.message });
            return;
        }

        if (!row) {
            // Criar novo registro
            const conversoesPorTipo = {};
            conversoesPorTipo[tipo] = 1;

            db.run(
                `INSERT INTO metricas (data, conversoes, conversoesPorTipo) VALUES (?, 1, ?)`,
                [hoje, JSON.stringify(conversoesPorTipo)],
                (err) => {
                    if (err) {
                        res.status(500).json({ erro: err.message });
                        return;
                    }
                    res.json({ mensagem: 'Conversão registrada' });
                }
            );
        } else {
            // Atualizar registro existente
            const conversoesPorTipo = JSON.parse(row.conversoesPorTipo || '{}');
            conversoesPorTipo[tipo] = (conversoesPorTipo[tipo] || 0) + 1;

            db.run(
                `UPDATE metricas SET conversoes = conversoes + 1, conversoesPorTipo = ?, atualizadoEm = CURRENT_TIMESTAMP WHERE data = ?`,
                [JSON.stringify(conversoesPorTipo), hoje],
                (err) => {
                    if (err) {
                        res.status(500).json({ erro: err.message });
                        return;
                    }
                    res.json({ mensagem: 'Conversão registrada' });
                }
            );
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

// Função para popular banco de dados se estiver vazio
function inicializarDados() {
    db.get('SELECT COUNT(*) as count FROM profissionais', (err, row) => {
        if (err) {
            console.error('❌ Erro ao verificar profissionais:', err);
            return;
        }

        if (row.count === 0) {
            console.log('📥 Importando profissionais do JSON...');
            const jsonPath = path.join(__dirname, 'profissionais.json');

            if (fs.existsSync(jsonPath)) {
                try {
                    const dados = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

                    dados.forEach(prof => {
                        const sql = `
                            INSERT INTO profissionais (nome, especialidade, cadastroMedico, apresentacao, foto)
                            VALUES (?, ?, ?, ?, ?)
                        `;

                        db.run(sql, [prof.nome, prof.especialidade, prof.cadastroMedico, prof.apresentacao, prof.foto], (err) => {
                            if (err) console.error('❌ Erro ao importar:', err);
                        });
                    });

                    console.log(`✅ ${dados.length} profissionais importados com sucesso!`);
                } catch (err) {
                    console.error('❌ Erro ao processar profissionais.json:', err);
                }
            }
        } else {
            console.log(`✅ ${row.count} profissionais já cadastrados no banco`);
        }
    });
}

app.listen(PORT, () => {
    // Aguardar um pouco para as tabelas serem criadas
    setTimeout(inicializarDados, 500);

    console.log(`
╔════════════════════════════════════════╗
║   🦷 FACCES - API REST                 ║
║   Servidor rodando em:                 ║
║   http://localhost:${PORT}             ║
║                                        ║
║   🌐 Landing Page:                     ║
║   http://localhost:${PORT}             ║
║                                        ║
║   Endpoints disponíveis:               ║
║   - GET  /api/profissionais            ║
║   - POST /api/profissionais            ║
║   - PUT  /api/profissionais/:id        ║
║   - DELETE /api/profissionais/:id      ║
║   - GET  /api/videos                   ║
║   - POST /api/videos                   ║
║   - DELETE /api/videos/:id             ║
║   - GET  /api/metricas                 ║
║   - POST /api/metricas/acesso          ║
║   - POST /api/metricas/conversao       ║
║   - POST /api/importar-profissionais   ║
╚════════════════════════════════════════╝
    `);
});

// Tratar erro de desligamento gracioso
process.on('SIGINT', () => {
    console.log('\n🔴 Servidor desligando...');
    db.close((err) => {
        if (err) console.error(err);
        process.exit(0);
    });
});
