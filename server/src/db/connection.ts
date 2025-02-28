import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const schemaPath = path.join(__dirname, 'schema.sql');

const { Pool } = pg;

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
    database: process.env.DB_NAME,
});

const connectToDb = async () => {
    try {
        await pool.connect();
        console.log('Connected to database.');
    } catch (error) {
        console.error('Error connecting to database: ', error);
        process.exit(1);
    }
};

const applySchema = async () => {
    try {
        const schemaSQL = fs.readFileSync(schemaPath, 'utf-8');
        await pool.query(schemaSQL);
        console.log('Schema applied.');
    } catch (error) {
        console.error('Error applying schema: ', error);
        process.exit(1);
    }
};

const resetDatabase = async () => {
    try {
        const dropTablesSQL = `
            DROP TABLE IF EXISTS notes CASCADE;
            DROP TABLE IF EXISTS notebooks CASCADE;
            DROP TABLE IF EXISTS users CASCADE;
            DROP TYPE IF EXISTS importance_level;
        `;
        await pool.query(dropTablesSQL);
        console.log('Existing tables dropped.');

        await applySchema();
        console.log('Database reset and schema reapplied.');
    } catch (error) {
        console.error('Error resetting database: ', error);
        process.exit(1);
    }
};

export { pool, connectToDb, applySchema, resetDatabase };