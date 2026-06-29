/**
 * Unit tests for database.js compatibility layer
 * Tests the db.run shim and initialization logic
 */

// Mock pg module before requiring database.js
const mockQuery = jest.fn();
const mockConnect = jest.fn();

jest.mock('pg', () => {
    const pool = {
        query: mockQuery,
        connect: mockConnect,
        on: jest.fn(),
    };
    return { Pool: jest.fn(() => pool) };
});

// Suppress console output during tests
const originalLog = console.log;
const originalError = console.error;
let logCalls = [];
let errorCalls = [];

beforeAll(() => {
    console.log = (...args) => logCalls.push(args);
    console.error = (...args) => errorCalls.push(args);

    // Simulate connection failure so inicializarBancoDados doesn't run
    mockConnect.mockImplementation((callback) => {
        callback(new Error('test: no real db'), null, jest.fn());
    });
});

afterAll(() => {
    console.log = originalLog;
    console.error = originalError;
});

beforeEach(() => {
    mockQuery.mockReset();
    logCalls = [];
    errorCalls = [];
});

let db;

describe('database module', () => {
    beforeAll(() => {
        db = require('../database');
    });

    describe('db.run compatibility shim', () => {
        it('calls query and passes result to callback', (done) => {
            const result = { rows: [], rowCount: 0 };
            mockQuery.mockResolvedValueOnce(result);

            db.run('SELECT * FROM test', [], (err, res) => {
                expect(err).toBeNull();
                expect(res).toEqual(result);
                expect(mockQuery).toHaveBeenCalled();
                done();
            });
        });

        it('handles callback as second argument (no params)', (done) => {
            mockQuery.mockResolvedValueOnce({ rows: [] });

            db.run('SELECT 1', (err, res) => {
                expect(err).toBeNull();
                expect(mockQuery).toHaveBeenCalled();
                const calledParams = mockQuery.mock.calls[0][1];
                expect(calledParams).toEqual([]);
                done();
            });
        });

        it('passes error to callback on query failure', (done) => {
            mockQuery.mockRejectedValueOnce(new Error('query failed'));

            db.run('BAD SQL', [], (err) => {
                expect(err).toBeInstanceOf(Error);
                expect(err.message).toBe('query failed');
                done();
            });
        });

        it('handles missing callback gracefully on success', async () => {
            mockQuery.mockResolvedValueOnce({ rows: [] });
            db.run('SELECT 1', []);
            await new Promise((r) => setTimeout(r, 50));
        });

        it('handles missing callback gracefully on error', async () => {
            mockQuery.mockRejectedValueOnce(new Error('fail'));
            db.run('BAD', []);
            await new Promise((r) => setTimeout(r, 50));
        });

        it('passes params array to query', (done) => {
            mockQuery.mockResolvedValueOnce({ rows: [] });

            db.run('INSERT INTO t (a) VALUES ($1)', ['val1'], (err) => {
                expect(err).toBeNull();
                expect(mockQuery.mock.calls[0][1]).toEqual(['val1']);
                done();
            });
        });

        it('handles query with $N-style placeholders (server usage pattern)', (done) => {
            mockQuery.mockResolvedValueOnce({ rows: [] });

            db.run(
                'UPDATE t SET a = $1, b = $2 WHERE id = $3',
                [1, 2, 3],
                (err) => {
                    expect(err).toBeNull();
                    const calledQuery = mockQuery.mock.calls[0][0];
                    expect(calledQuery).toBe('UPDATE t SET a = $1, b = $2 WHERE id = $3');
                    done();
                }
            );
        });
    });

    describe('database connection error handling', () => {
        it('logs error when connection fails', () => {
            // The connect mock in beforeAll triggers error logging
            // Re-require to see the error captured
            jest.resetModules();
            logCalls = [];
            errorCalls = [];

            const mockConnectLocal = jest.fn((callback) => {
                callback(new Error('connection refused'), null, jest.fn());
            });

            jest.doMock('pg', () => {
                const pool = {
                    query: jest.fn(),
                    connect: mockConnectLocal,
                    on: jest.fn(),
                };
                return { Pool: jest.fn(() => pool) };
            });

            require('../database');

            expect(errorCalls.length).toBeGreaterThan(0);
            const errorMsg = errorCalls[0][0];
            expect(errorMsg).toContain('Erro ao conectar');
        });
    });

    describe('inicializarBancoDados', () => {
        it('creates tables when connection succeeds', (done) => {
            jest.resetModules();
            logCalls = [];
            errorCalls = [];

            const mockTableQuery = jest.fn()
                .mockResolvedValueOnce({}) // profissionais table
                .mockResolvedValueOnce({}) // videos table
                .mockResolvedValueOnce({}); // metricas table

            const mockReleaseFn = jest.fn();

            jest.doMock('pg', () => {
                const pool = {
                    query: mockTableQuery,
                    connect: (callback) => {
                        callback(null, {}, mockReleaseFn);
                    },
                    on: jest.fn(),
                };
                return { Pool: jest.fn(() => pool) };
            });

            require('../database');

            setTimeout(() => {
                expect(mockReleaseFn).toHaveBeenCalled();
                expect(mockTableQuery).toHaveBeenCalledTimes(3);

                const calls = mockTableQuery.mock.calls;
                expect(calls[0][0]).toMatch(/CREATE TABLE IF NOT EXISTS profissionais/);
                expect(calls[1][0]).toMatch(/CREATE TABLE IF NOT EXISTS videos/);
                expect(calls[2][0]).toMatch(/CREATE TABLE IF NOT EXISTS metricas/);
                done();
            }, 100);
        });

        it('logs error when table creation fails', (done) => {
            jest.resetModules();
            logCalls = [];
            errorCalls = [];

            jest.doMock('pg', () => {
                const pool = {
                    query: jest.fn().mockRejectedValueOnce(new Error('CREATE TABLE failed')),
                    connect: (callback) => {
                        callback(null, {}, jest.fn());
                    },
                    on: jest.fn(),
                };
                return { Pool: jest.fn(() => pool) };
            });

            require('../database');

            setTimeout(() => {
                const hasErrorLog = errorCalls.some(
                    (call) => call[0] && call[0].toString().includes('Erro ao inicializar')
                );
                expect(hasErrorLog).toBe(true);
                done();
            }, 100);
        });
    });

    describe('Pool configuration', () => {
        it('creates pool with SSL settings', () => {
            jest.resetModules();

            jest.doMock('pg', () => {
                const MockPool = jest.fn(() => ({
                    query: jest.fn(),
                    connect: jest.fn((cb) => cb(new Error('skip'), null, jest.fn())),
                    on: jest.fn(),
                }));
                return { Pool: MockPool };
            });

            require('../database');

            const { Pool } = require('pg');
            expect(Pool).toHaveBeenCalledWith(
                expect.objectContaining({
                    ssl: { rejectUnauthorized: false },
                })
            );
        });
    });
});
