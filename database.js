/**
 * Configuração e inicialização do banco de dados SQLite
 * FACCES - Clínica Dentária
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Caminho do banco de dados
const dbPath = path.join(__dirname, 'facces.db');

// Criar conexão com banco de dados
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Erro ao conectar ao banco de dados:', err);
    } else {
        console.log('✅ Conectado ao banco de dados SQLite: facces.db');
        inicializarBancoDados();
    }
});

/**
 * Inicializar estrutura do banco de dados
 */
function inicializarBancoDados() {
    // Criar tabela de profissionais
    db.run(`
        CREATE TABLE IF NOT EXISTS profissionais (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            especialidade TEXT NOT NULL,
            cadastroMedico TEXT NOT NULL,
            apresentacao TEXT,
            atuacao TEXT,
            foto LONGTEXT,
            criadoEm DATETIME DEFAULT CURRENT_TIMESTAMP,
            atualizadoEm DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) console.error('Erro ao criar tabela profissionais:', err);
        else console.log('✅ Tabela profissionais pronta');
    });

    // Criar tabela de vídeos
    db.run(`
        CREATE TABLE IF NOT EXISTS videos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL,
            descricao TEXT,
            youtubeId TEXT NOT NULL UNIQUE,
            criadoEm DATETIME DEFAULT CURRENT_TIMESTAMP,
            atualizadoEm DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) console.error('Erro ao criar tabela videos:', err);
        else console.log('✅ Tabela videos pronta');
    });

    // Criar tabela de métricas
    db.run(`
        CREATE TABLE IF NOT EXISTS metricas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            data DATE DEFAULT CURRENT_DATE,
            acessos INTEGER DEFAULT 0,
            conversoes INTEGER DEFAULT 0,
            conversoesPorTipo TEXT DEFAULT '{}',
            atualizadoEm DATETIME DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(data)
        )
    `, (err) => {
        if (err) console.error('Erro ao criar tabela metricas:', err);
        else console.log('✅ Tabela metricas pronta');
    });
}

module.exports = db;
