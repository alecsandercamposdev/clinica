/**
 * Unit tests for server.js API routes
 * Mocks the database module to test route logic in isolation
 */

const request = require('supertest');
const path = require('path');
const fs = require('fs');

// Track mock query responses
let queryResponses = [];

// Create a mock that supports both callback and Promise calling conventions,
// matching the real pg Pool.query behavior.
const mockQuery = jest.fn((...args) => {
    const response = queryResponses.shift();
    const lastArg = args[args.length - 1];
    const hasCallback = typeof lastArg === 'function';

    if (response instanceof Error) {
        if (hasCallback) {
            lastArg(response);
            return;
        }
        return Promise.reject(response);
    }

    if (hasCallback) {
        lastArg(null, response);
        return;
    }
    return Promise.resolve(response);
});

jest.mock('../database', () => {
    const pool = {
        query: mockQuery,
        connect: jest.fn(),
        run: jest.fn(),
    };
    return pool;
});

const app = require('../server');

/** Queue a successful query result */
function queueResult(result) {
    queryResponses.push(result);
}

/** Queue a query error */
function queueError(msg) {
    queryResponses.push(new Error(msg));
}

beforeEach(() => {
    queryResponses = [];
    mockQuery.mockClear();
});

// ================================================
// HEALTH CHECK
// ================================================

describe('GET /api/saude', () => {
    it('returns server status', async () => {
        const res = await request(app).get('/api/saude');
        expect(res.status).toBe(200);
        expect(res.body.status).toMatch(/rodando/);
        expect(res.body.timestamp).toBeDefined();
    });
});

// ================================================
// PROFISSIONAIS ROUTES
// ================================================

describe('GET /api/profissionais', () => {
    it('returns a list of professionals', async () => {
        const rows = [
            { id: 1, nome: 'Dr. Ana', especialidade: 'Ortodontia' },
            { id: 2, nome: 'Dr. Bruno', especialidade: 'Endodontia' },
        ];
        queueResult({ rows });

        const res = await request(app).get('/api/profissionais');
        expect(res.status).toBe(200);
        expect(res.body).toEqual(rows);
    });

    it('returns an empty array when no professionals exist', async () => {
        queueResult({ rows: [] });

        const res = await request(app).get('/api/profissionais');
        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });

    it('returns 500 on database error', async () => {
        queueError('connection failed');

        const res = await request(app).get('/api/profissionais');
        expect(res.status).toBe(500);
        expect(res.body.erro).toBeDefined();
    });
});

describe('GET /api/profissionais/:id', () => {
    it('returns a single professional by id', async () => {
        const prof = { id: 1, nome: 'Dr. Ana', especialidade: 'Ortodontia' };
        queueResult({ rows: [prof] });

        const res = await request(app).get('/api/profissionais/1');
        expect(res.status).toBe(200);
        expect(res.body).toEqual(prof);
    });

    it('returns 404 when professional not found', async () => {
        queueResult({ rows: [] });

        const res = await request(app).get('/api/profissionais/999');
        expect(res.status).toBe(404);
        expect(res.body.erro).toMatch(/não encontrado/);
    });

    it('returns 500 on database error', async () => {
        queueError('db error');

        const res = await request(app).get('/api/profissionais/1');
        expect(res.status).toBe(500);
        expect(res.body.erro).toBeDefined();
    });
});

describe('POST /api/profissionais', () => {
    it('creates a new professional successfully', async () => {
        queueResult({ rows: [{ id: 10 }] });

        const res = await request(app)
            .post('/api/profissionais')
            .send({
                nome: 'Dr. Carlos',
                especialidade: 'Implantodontia',
                cadastroMedico: 'CRO-12345',
                apresentacao: 'Especialista em implantes',
                atuacao: 'Implantes dentarios',
                foto: 'base64data',
            });

        expect(res.status).toBe(201);
        expect(res.body.id).toBe(10);
        expect(res.body.mensagem).toMatch(/criado/);
    });

    it('returns 400 when required fields are missing', async () => {
        const res = await request(app)
            .post('/api/profissionais')
            .send({ nome: 'Dr. Carlos' });

        expect(res.status).toBe(400);
        expect(res.body.erro).toMatch(/obrigatórios/);
    });

    it('returns 400 when nome is missing', async () => {
        const res = await request(app)
            .post('/api/profissionais')
            .send({ especialidade: 'Ortodontia', cadastroMedico: 'CRO-123' });

        expect(res.status).toBe(400);
    });

    it('returns 500 on database error during creation', async () => {
        queueError('insert failed');

        const res = await request(app)
            .post('/api/profissionais')
            .send({
                nome: 'Dr. Carlos',
                especialidade: 'Implantodontia',
                cadastroMedico: 'CRO-12345',
            });

        expect(res.status).toBe(500);
        expect(res.body.erro).toBeDefined();
    });
});

describe('PUT /api/profissionais/:id', () => {
    it('updates a professional successfully', async () => {
        queueResult({ rowCount: 1, rows: [{ id: 1 }] });

        const res = await request(app)
            .put('/api/profissionais/1')
            .send({
                nome: 'Dr. Ana Atualizada',
                especialidade: 'Ortodontia',
                cadastroMedico: 'CRO-99999',
                apresentacao: 'Atualizada',
                atuacao: 'Ortodontia geral',
                foto: 'newbase64',
            });

        expect(res.status).toBe(200);
        expect(res.body.mensagem).toMatch(/atualizado/);
    });

    it('returns 404 when updating non-existent professional', async () => {
        queueResult({ rowCount: 0, rows: [] });

        const res = await request(app)
            .put('/api/profissionais/999')
            .send({
                nome: 'Dr. Fantasma',
                especialidade: 'N/A',
                cadastroMedico: 'CRO-000',
            });

        expect(res.status).toBe(404);
        expect(res.body.erro).toMatch(/não encontrado/);
    });

    it('returns 500 on database error', async () => {
        queueError('update failed');

        const res = await request(app)
            .put('/api/profissionais/1')
            .send({ nome: 'X', especialidade: 'Y', cadastroMedico: 'Z' });

        expect(res.status).toBe(500);
    });
});

describe('DELETE /api/profissionais/:id', () => {
    it('deletes a professional successfully', async () => {
        queueResult({ rowCount: 1, rows: [{ id: 1 }] });

        const res = await request(app).delete('/api/profissionais/1');
        expect(res.status).toBe(200);
        expect(res.body.mensagem).toMatch(/deletado/);
    });

    it('returns 404 when deleting non-existent professional', async () => {
        queueResult({ rowCount: 0, rows: [] });

        const res = await request(app).delete('/api/profissionais/999');
        expect(res.status).toBe(404);
        expect(res.body.erro).toMatch(/não encontrado/);
    });

    it('returns 500 on database error', async () => {
        queueError('delete failed');

        const res = await request(app).delete('/api/profissionais/1');
        expect(res.status).toBe(500);
    });
});

// ================================================
// VIDEOS ROUTES
// ================================================

describe('GET /api/videos', () => {
    it('returns a list of videos', async () => {
        const rows = [
            { id: 1, titulo: 'Higiene Bucal', descricao: 'Dicas', youtubeid: 'abc123' },
        ];
        queueResult({ rows });

        const res = await request(app).get('/api/videos');
        expect(res.status).toBe(200);
        expect(res.body).toEqual(rows);
    });

    it('returns an empty array when no videos exist', async () => {
        queueResult({ rows: [] });

        const res = await request(app).get('/api/videos');
        expect(res.status).toBe(200);
        expect(res.body).toEqual([]);
    });

    it('returns 500 on database error', async () => {
        queueError('db error');

        const res = await request(app).get('/api/videos');
        expect(res.status).toBe(500);
    });
});

describe('POST /api/videos', () => {
    it('creates a new video successfully', async () => {
        queueResult({ rows: [{ id: 5 }] });

        const res = await request(app)
            .post('/api/videos')
            .send({
                titulo: 'Higiene Bucal',
                descricao: 'Como escovar corretamente',
                youtubeid: 'xyz789',
            });

        expect(res.status).toBe(201);
        expect(res.body.id).toBe(5);
        expect(res.body.mensagem).toMatch(/criado/);
    });

    it('creates a video without description', async () => {
        queueResult({ rows: [{ id: 6 }] });

        const res = await request(app)
            .post('/api/videos')
            .send({ titulo: 'Video sem desc', youtubeid: 'noDesc1' });

        expect(res.status).toBe(201);
    });

    it('returns 400 when titulo is missing', async () => {
        const res = await request(app)
            .post('/api/videos')
            .send({ youtubeid: 'abc' });

        expect(res.status).toBe(400);
        expect(res.body.erro).toMatch(/obrigatórios/);
    });

    it('returns 400 when youtubeid is missing', async () => {
        const res = await request(app)
            .post('/api/videos')
            .send({ titulo: 'Test' });

        expect(res.status).toBe(400);
    });

    it('returns 400 on duplicate youtubeId', async () => {
        queueError('Key (youtubeid) already exists');

        const res = await request(app)
            .post('/api/videos')
            .send({ titulo: 'Dup', youtubeid: 'dup123' });

        expect(res.status).toBe(400);
        expect(res.body.erro).toMatch(/já foi cadastrado/);
    });

    it('returns 400 on unique constraint violation', async () => {
        queueError('unique constraint violated');

        const res = await request(app)
            .post('/api/videos')
            .send({ titulo: 'Dup', youtubeid: 'dup123' });

        expect(res.status).toBe(400);
        expect(res.body.erro).toMatch(/já foi cadastrado/);
    });

    it('returns 500 on non-unique database error', async () => {
        queueError('some other error');

        const res = await request(app)
            .post('/api/videos')
            .send({ titulo: 'Test', youtubeid: 'test1' });

        expect(res.status).toBe(500);
    });
});

describe('PUT /api/videos/:id', () => {
    it('updates a video successfully', async () => {
        queueResult({ rowCount: 1, rows: [{ id: 1 }] });

        const res = await request(app)
            .put('/api/videos/1')
            .send({
                titulo: 'Video Atualizado',
                descricao: 'Nova descricao',
                youtubeid: 'updated1',
            });

        expect(res.status).toBe(200);
        expect(res.body.mensagem).toMatch(/atualizado/);
    });

    it('returns 400 when titulo is missing', async () => {
        const res = await request(app)
            .put('/api/videos/1')
            .send({ youtubeid: 'abc' });

        expect(res.status).toBe(400);
        expect(res.body.erro).toMatch(/obrigatórios/);
    });

    it('returns 400 when youtubeid is missing', async () => {
        const res = await request(app)
            .put('/api/videos/1')
            .send({ titulo: 'Test' });

        expect(res.status).toBe(400);
    });

    it('returns 404 when video not found', async () => {
        queueResult({ rowCount: 0, rows: [] });

        const res = await request(app)
            .put('/api/videos/999')
            .send({ titulo: 'X', youtubeid: 'Y' });

        expect(res.status).toBe(404);
        expect(res.body.erro).toMatch(/não encontrado/);
    });

    it('returns 400 on duplicate youtubeId during update', async () => {
        queueError('Key (youtubeid) already exists');

        const res = await request(app)
            .put('/api/videos/1')
            .send({ titulo: 'X', youtubeid: 'dup' });

        expect(res.status).toBe(400);
        expect(res.body.erro).toMatch(/já foi cadastrado/);
    });

    it('returns 500 on non-unique database error', async () => {
        queueError('generic error');

        const res = await request(app)
            .put('/api/videos/1')
            .send({ titulo: 'X', youtubeid: 'Y' });

        expect(res.status).toBe(500);
    });
});

describe('DELETE /api/videos/:id', () => {
    it('deletes a video successfully', async () => {
        queueResult({ rowCount: 1, rows: [{ id: 1 }] });

        const res = await request(app).delete('/api/videos/1');
        expect(res.status).toBe(200);
        expect(res.body.mensagem).toMatch(/deletado/);
    });

    it('returns 404 when video not found', async () => {
        queueResult({ rowCount: 0, rows: [] });

        const res = await request(app).delete('/api/videos/999');
        expect(res.status).toBe(404);
        expect(res.body.erro).toMatch(/não encontrado/);
    });

    it('returns 500 on database error', async () => {
        queueError('delete failed');

        const res = await request(app).delete('/api/videos/1');
        expect(res.status).toBe(500);
    });
});

// ================================================
// METRICAS ROUTES
// ================================================

describe('GET /api/metricas', () => {
    it('returns metrics for today when they exist', async () => {
        const row = {
            data: '2026-06-29',
            acessos: 10,
            conversoes: 2,
            conversoesportipo: '{"whatsapp":2}',
        };
        queueResult({ rows: [row] });

        const res = await request(app).get('/api/metricas');
        expect(res.status).toBe(200);
        expect(res.body.acessos).toBe(10);
        expect(res.body.conversoesPorTipo).toEqual({ whatsapp: 2 });
    });

    it('returns zero metrics when no data exists for today', async () => {
        queueResult({ rows: [] });

        const res = await request(app).get('/api/metricas');
        expect(res.status).toBe(200);
        expect(res.body.acessos).toBe(0);
        expect(res.body.conversoes).toBe(0);
        expect(res.body.conversoesPorTipo).toEqual({});
    });

    it('handles conversoesportipo as object', async () => {
        const row = {
            data: '2026-06-29',
            acessos: 5,
            conversoes: 1,
            conversoesportipo: { whatsapp: 1 },
        };
        queueResult({ rows: [row] });

        const res = await request(app).get('/api/metricas');
        expect(res.status).toBe(200);
        expect(res.body.conversoesPorTipo).toEqual({ whatsapp: 1 });
    });

    it('returns 500 on database error', async () => {
        queueError('db error');

        const res = await request(app).get('/api/metricas');
        expect(res.status).toBe(500);
    });
});

describe('GET /api/metricas/total/geral', () => {
    it('returns total metrics', async () => {
        const rows = [{ totalacessos: '100', totalconversoes: '15' }];
        queueResult({ rows });

        const res = await request(app).get('/api/metricas/total/geral');
        expect(res.status).toBe(200);
        expect(res.body.totalAcessos).toBe(100);
        expect(res.body.totalConversoes).toBe(15);
        expect(res.body.taxaConversao).toBe(15.00);
    });

    it('returns zero when no metrics exist', async () => {
        const rows = [{ totalacessos: null, totalconversoes: null }];
        queueResult({ rows });

        const res = await request(app).get('/api/metricas/total/geral');
        expect(res.status).toBe(200);
        expect(res.body.totalAcessos).toBe(0);
        expect(res.body.totalConversoes).toBe(0);
        expect(res.body.taxaConversao).toBe(0);
    });

    it('returns 0 conversion rate when no accesses', async () => {
        const rows = [{ totalacessos: '0', totalconversoes: '0' }];
        queueResult({ rows });

        const res = await request(app).get('/api/metricas/total/geral');
        expect(res.status).toBe(200);
        expect(res.body.taxaConversao).toBe(0);
    });

    it('handles camelCase column names', async () => {
        const rows = [{ totalAcessos: '50', totalConversoes: '5' }];
        queueResult({ rows });

        const res = await request(app).get('/api/metricas/total/geral');
        expect(res.status).toBe(200);
        expect(res.body.totalAcessos).toBe(50);
        expect(res.body.totalConversoes).toBe(5);
    });

    it('returns 500 on database error', async () => {
        queueError('db error');

        const res = await request(app).get('/api/metricas/total/geral');
        expect(res.status).toBe(500);
    });
});

describe('POST /api/metricas/acesso', () => {
    it('registers an access successfully', async () => {
        queueResult({});

        const res = await request(app)
            .post('/api/metricas/acesso')
            .send({});

        expect(res.status).toBe(200);
        expect(res.body.mensagem).toMatch(/registrado/);
    });

    it('returns 500 on database error', async () => {
        queueError('insert failed');

        const res = await request(app)
            .post('/api/metricas/acesso')
            .send({});

        expect(res.status).toBe(500);
    });
});

describe('POST /api/metricas/conversao', () => {
    it('creates a new conversion record when none exists for today', async () => {
        // db.get returns no existing row
        queueResult({ rows: [] });
        // db.query for INSERT
        queueResult({});

        const res = await request(app)
            .post('/api/metricas/conversao')
            .send({ tipo: 'whatsapp' });

        expect(res.status).toBe(200);
        expect(res.body.mensagem).toMatch(/registrada/);
    });

    it('updates existing conversion record', async () => {
        const row = {
            data: '2026-06-29',
            conversoes: 3,
            conversoesportipo: '{"whatsapp":3}',
        };
        // db.get returns existing row
        queueResult({ rows: [row] });
        // db.query for UPDATE
        queueResult({});

        const res = await request(app)
            .post('/api/metricas/conversao')
            .send({ tipo: 'whatsapp' });

        expect(res.status).toBe(200);
        expect(res.body.mensagem).toMatch(/registrada/);
    });

    it('defaults tipo to whatsapp', async () => {
        queueResult({ rows: [] });
        queueResult({});

        const res = await request(app)
            .post('/api/metricas/conversao')
            .send({});

        expect(res.status).toBe(200);
    });

    it('handles conversoesportipo as object', async () => {
        const row = {
            data: '2026-06-29',
            conversoes: 1,
            conversoesportipo: { formulario: 1 },
        };
        queueResult({ rows: [row] });
        queueResult({});

        const res = await request(app)
            .post('/api/metricas/conversao')
            .send({ tipo: 'formulario' });

        expect(res.status).toBe(200);
    });

    it('returns 500 on db.get error', async () => {
        queueError('db error');

        const res = await request(app)
            .post('/api/metricas/conversao')
            .send({ tipo: 'whatsapp' });

        expect(res.status).toBe(500);
    });

    it('returns 500 on insert error for new conversion', async () => {
        queueResult({ rows: [] });
        queueError('insert failed');

        const res = await request(app)
            .post('/api/metricas/conversao')
            .send({ tipo: 'whatsapp' });

        expect(res.status).toBe(500);
    });

    it('returns 500 on update error for existing conversion', async () => {
        const row = {
            data: '2026-06-29',
            conversoes: 1,
            conversoesportipo: '{}',
        };
        queueResult({ rows: [row] });
        queueError('update failed');

        const res = await request(app)
            .post('/api/metricas/conversao')
            .send({ tipo: 'whatsapp' });

        expect(res.status).toBe(500);
    });
});

// ================================================
// IMPORTAR PROFISSIONAIS
// ================================================

describe('POST /api/importar-profissionais', () => {
    it('returns 500 when table clear fails', async () => {
        queueError('clear failed');

        const res = await request(app).post('/api/importar-profissionais');
        expect(res.status).toBe(500);
        expect(res.body.erro).toMatch(/limpar/);
    });

    it('handles empty profissionais list after clearing table', async () => {
        // Mock fs.readFileSync to return empty array
        const origReadFileSync = fs.readFileSync;
        fs.readFileSync = (filePath, encoding) => {
            if (filePath.includes('profissionais.json')) {
                return '[]';
            }
            return origReadFileSync(filePath, encoding);
        };

        // Mock DELETE (clearing table)
        queueResult({});

        const res = await request(app).post('/api/importar-profissionais');
        expect(res.status).toBe(200);
        expect(res.body.total).toBe(0);

        fs.readFileSync = origReadFileSync;
    });

    it('handles import errors for individual professionals', async () => {
        const origReadFileSync = fs.readFileSync;
        fs.readFileSync = (filePath, encoding) => {
            if (filePath.includes('profissionais.json')) {
                return JSON.stringify([
                    { nome: 'Dr. Test', especialidade: 'Test', cadastroMedico: 'CRO-1', apresentacao: '', foto: '' }
                ]);
            }
            return origReadFileSync(filePath, encoding);
        };

        // Mock DELETE (clearing table)
        queueResult({});
        // Mock INSERT failure for the single professional
        queueError('insert failed');

        const res = await request(app).post('/api/importar-profissionais');
        expect(res.status).toBe(200);
        expect(res.body.erros).toBe(1);
        expect(res.body.total).toBe(1);

        fs.readFileSync = origReadFileSync;
    });

    it('imports a single professional successfully', async () => {
        const origReadFileSync = fs.readFileSync;
        fs.readFileSync = (filePath, encoding) => {
            if (filePath.includes('profissionais.json')) {
                return JSON.stringify([
                    { nome: 'Dr. Solo', especialidade: 'Geral', cadastroMedico: 'CRO-99', apresentacao: 'Teste', foto: 'data:img' }
                ]);
            }
            return origReadFileSync(filePath, encoding);
        };

        // Mock DELETE (clearing table)
        queueResult({});
        // Mock INSERT for the single professional
        queueResult({});

        const res = await request(app).post('/api/importar-profissionais');
        expect(res.status).toBe(200);
        expect(res.body.mensagem).toMatch(/concluída/);
        expect(res.body.importados).toBe(1);
        expect(res.body.total).toBe(1);

        fs.readFileSync = origReadFileSync;
    });
});

// ================================================
// COMPATIBILITY LAYER (db.all, db.get)
// ================================================

describe('db.all compatibility layer', () => {
    it('converts ? placeholders to $N for queries via db.all', async () => {
        const rows = [{ id: 1, nome: 'Test' }];
        queueResult({ rows });

        const res = await request(app).get('/api/profissionais');
        expect(res.status).toBe(200);
        expect(mockQuery).toHaveBeenCalled();
    });
});

describe('db.get compatibility layer', () => {
    it('returns first row via db.get', async () => {
        const prof = { id: 1, nome: 'Dr. Test' };
        queueResult({ rows: [prof] });

        const res = await request(app).get('/api/profissionais/1');
        expect(res.status).toBe(200);
        expect(res.body).toEqual(prof);
    });

    it('returns null when no rows found via db.get', async () => {
        queueResult({ rows: [] });

        const res = await request(app).get('/api/profissionais/1');
        expect(res.status).toBe(404);
    });
});

// ================================================
// STATIC FILES
// ================================================

describe('GET / (root)', () => {
    it('serves the index.html file', async () => {
        const res = await request(app).get('/');
        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toMatch(/html/);
    });
});
