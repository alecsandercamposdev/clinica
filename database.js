/**
 * Configuração e inicialização do banco de dados PostgreSQL
 * FACCES - Clínica Dentária
 */

const { Pool } = require('pg');

// A Render vai injetar a string de conexão na variável de ambiente DATABASE_URL
const connectionString = process.env.DATABASE_URL;

// Criar conexão com o banco de dados PostgreSQL
const db = new Pool({
    connectionString: connectionString,
    ssl: connectionString ? {
        rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== 'false'
    } : false
});

// Testar a conexão inicial
db.connect((err, client, release) => {
    if (err) {
        console.error('❌ Erro ao conectar ao banco de dados PostgreSQL:', err.stack);
    } else {
        console.log('✅ Conectado ao banco de dados PostgreSQL na Render!');
        release();
        inicializarBancoDados();
    }
});

/**
 * Inicializar estrutura do banco de dados
 */
async function inicializarBancoDados() {
    try {
        // Criar tabela de profissionais
        await db.query(`
            CREATE TABLE IF NOT EXISTS profissionais (
                id SERIAL PRIMARY KEY,
                nome TEXT NOT NULL,
                especialidade TEXT NOT NULL,
                cadastroMedico TEXT NOT NULL,
                apresentacao TEXT,
                atuacao TEXT,
                foto TEXT,
                criadoEm TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                atualizadoEm TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Tabela profissionais pronta');

        // Criar tabela de vídeos
        await db.query(`
            CREATE TABLE IF NOT EXISTS videos (
                id SERIAL PRIMARY KEY,
                titulo TEXT NOT NULL,
                descricao TEXT,
                youtubeId TEXT NOT NULL UNIQUE,
                criadoEm TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                atualizadoEm TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Tabela videos pronta');

        // Criar tabela de métricas
        await db.query(`
            CREATE TABLE IF NOT EXISTS metricas (
                id SERIAL PRIMARY KEY,
                data DATE DEFAULT CURRENT_DATE UNIQUE,
                acessos INTEGER DEFAULT 0,
                conversoes INTEGER DEFAULT 0,
                conversoesPorTipo TEXT DEFAULT '{}',
                atualizadoEm TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ Tabela metricas pronta');

    } catch (err) {
        console.error('❌ Erro ao inicializar tabelas:', err);
    }
}

// Casca de compatibilidade para não quebrar o seu server.js antigo
db.run = function(query, params, callback) {
    if (typeof params === 'function') {
        callback = params;
        params = [];
    }
    this.query(query.replace(/\?/g, (match, index) => `$${index + 1}`), params)
        .then(res => callback && callback(null, res))
        .catch(err => callback && callback(err));
};

module.exports = db;