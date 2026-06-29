/**
 * Servidor Express - API REST
 * FACCES - Clínica Dentária
 * * Rotas disponíveis de acordo com o Banco de Dados PostgreSQL
 */

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const db = require('./database');

const app = express();

// A Render define a porta automaticamente pela variável de ambiente PORT. Se não houver, usa 3000.
const PORT = process.env.PORT || 3000;

// ================================================
// CAMADA DE COMPATIBILIDADE POSTGRESQL (Para manter suas rotas funcionando)
// ================================================
function replaceQuestionMarks(query) {
    let i = 0;
    return query.replace(/\?/g, () => `$${++i}`);
}

db.all = function(query, params, callback) {
    if (typeof params === 'function') { callback = params; params = []; }
    this.query(replaceQuestionMarks(query), params)
        .then(res => callback(null, res.rows))
        .catch(err => callback(err));
};

db.get = function(query, params, callback) {
    if (typeof params === 'function') { callback = params; params = []; }
    this.query(replaceQuestionMarks(query), params)
        .then(res => callback(null, res.rows[0] || null))
        .catch(err => callback(err));
};

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
                    .catch(err => {
                        erros++;
                        console.error(`Erro ao importar profissional "${prof.nome}":`, err.message);
                    })
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

app.post('/api/profissionais', (req, res) => {
    const { nome, especialidade, cadastroMedico, apresentacao, atuacao, foto } = req.body;
    
    if (!nome || !especialidade || !cadastroMedico) {
        return res.status(400).json({ erro: 'Dados obrigatórios faltando' });
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

app.put('/api/profissionais/:id', (req, res) => {
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

app.delete('/api/profissionais/:id', (req, res) => {
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

app.post('/api/videos', (req, res) => {
    const { titulo, descricao, youtubeid } = req.body;

    if (!titulo || !youtubeid) {
        return res.status(400).json({ erro: 'Título e ID do YouTube são obrigatórios' });
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

app.put('/api/videos/:id', (req, res) => {
    const { id } = req.params;
    const { titulo, descricao, youtubeid } = req.body;

    if (!titulo || !youtubeid) {
        return res.status(400).json({ erro: 'Título e YouTube ID são obrigatórios' });
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

app.delete('/api/videos/:id', (req, res) => {
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

        try {
            if (typeof row.conversoesportipo === 'string') {
                row.conversoesPorTipo = JSON.parse(row.conversoesportipo || '{}');
            } else {
                row.conversoesPorTipo = row.conversoesportipo || {};
            }
        } catch (parseErr) {
            console.error('Erro ao parsear conversoesPorTipo:', parseErr.message);
            row.conversoesPorTipo = {};
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
            try {
                conversoesPorTipo = typeof rawConversoes === 'string' ? JSON.parse(rawConversoes) : rawConversoes;
            } catch (parseErr) {
                console.error('Erro ao parsear conversoesPorTipo:', parseErr.message);
                conversoesPorTipo = {};
            }
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
// MIDDLEWARE GLOBAL DE TRATAMENTO DE ERROS
// ================================================
app.use((err, req, res, _next) => {
    console.error('Erro não tratado na rota', req.method, req.originalUrl, '-', err.message);
    res.status(500).json({ erro: 'Erro interno do servidor' });
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
                    let importados = 0;
                    let erros = 0;

                    dados.forEach(prof => {
                        const sql = `
                            INSERT INTO profissionais (nome, especialidade, cadastroMedico, apresentacao, foto)
                            VALUES ($1, $2, $3, $4, $5)
                        `;
                        db.query(sql, [prof.nome, prof.especialidade, prof.cadastroMedico, prof.apresentacao, prof.foto])
                          .then(() => { importados++; })
                          .catch(importErr => {
                              erros++;
                              console.error(`❌ Erro ao importar "${prof.nome}":`, importErr.message);
                          })
                          .finally(() => {
                              if (importados + erros === dados.length) {
                                  console.log(`✅ Importação concluída: ${importados} importados, ${erros} erros de ${dados.length} total`);
                              }
                          });
                    });
                } catch (err) {
                    console.error('❌ Erro ao processar profissionais.json:', err);
                }
            } else {
                console.warn('⚠️ Arquivo profissionais.json não encontrado para importação inicial');
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