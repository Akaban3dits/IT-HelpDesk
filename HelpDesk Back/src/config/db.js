import dotenv from 'dotenv';
import pkg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import handleError from '../middlewares/errorHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const { Pool, Client } = pkg;

// Configuración del pool con parámetros adicionales para UTF-8
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    // Añadimos configuración específica para UTF-8
    options: `-c client_encoding=UTF8`,
    // Configuración adicional para el manejo de caracteres
    clientEncoding: 'utf-8'
});

const checkAndCreateDatabaseAndTables = async () => {
    const client = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        // Añadimos configuración UTF-8 para el cliente inicial
        options: `-c client_encoding=UTF8`
    });

    try {
        await client.connect();
        
        // Verificar si la base de datos existe
        const res = await client.query(`
            SELECT 1 FROM pg_database WHERE datname = $1
        `, [process.env.DB_NAME]);

        if (res.rows.length === 0) {
            // Crear base de datos con codificación UTF-8
            await client.query(`CREATE DATABASE ${process.env.DB_NAME} ENCODING 'UTF8' LC_COLLATE 'en_US.UTF-8' LC_CTYPE 'en_US.UTF-8' TEMPLATE template0`);
        }
        
        await client.end();

        const dbClient = new Client({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
            // Configuración UTF-8 para el cliente de la base de datos
            options: `-c client_encoding=UTF8`
        });

        await dbClient.connect();

        // Establecer codificación de cliente
        await dbClient.query('SET client_encoding TO utf8');

        // Leer y ejecutar el schema
        const schemaPath = path.join(__dirname, '../../db/schema.sql');
        const schemaSQL = fs.readFileSync(schemaPath, 'utf8');

        try {
            await dbClient.query(schemaSQL);
        } catch (err) {
            if (err.code !== '42P07') {
                throw err;
            }
        }

        // Verificar la configuración de codificación
        await dbClient.query(`
            SELECT current_setting('client_encoding') as encoding,
                   current_setting('server_encoding') as server_encoding
        `).then(result => {
            console.log('Database encodings:', result.rows[0]);
        });

        return dbClient;
    } catch (err) {
        handleError(err, null, null, null);
        process.exit(1);
    }
};

// Función para normalizar strings antes de guardarlos en la base de datos
const normalizeString = (str) => {
    if (typeof str !== 'string') return str;
    return str.normalize('NFC');
};

// Middleware para normalizar los datos antes de las operaciones de base de datos
pool.on('connect', (client) => {
    const originalQuery = client.query.bind(client);
    client.query = function (...args) {
        // Si hay parámetros, normalizar strings
        if (args[1] && Array.isArray(args[1])) {
            args[1] = args[1].map(param => normalizeString(param));
        }
        return originalQuery(...args);
    };
});

checkAndCreateDatabaseAndTables()
    .then(dbClient => {
        console.log('Base de datos lista y conexión activa con soporte UTF-8.');
    })
    .catch(err => handleError(err, null, null, null));

// Conectar al pool de la base de datos
pool.connect((err, client, release) => {
    if (err) {
        handleError(new Error('Error al conectar a la base de datos'), null, null, null);
        return;
    }
    release();
});

export default pool;