import dotenv from 'dotenv';
import pkg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import handleError from '../middlewares/errorHandler.js';

dotenv.config();
const { Pool, Client } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    options: '-c client_encoding=UTF8',
    clientEncoding: 'utf-8'
});

async function checkAndCreateDatabaseAndTables() {
    // Conectar al cliente inicial para verificar o crear la base de datos
    const initialClient = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
        database: 'postgres',
        options: '-c client_encoding=UTF8'
    });

    try {
        await initialClient.connect();
        // Verificar si la base de datos ya existe
        const res = await initialClient.query('SELECT 1 FROM pg_database WHERE datname = $1', [process.env.DB_NAME]);
        if (res.rows.length === 0) {
            await initialClient.query(`CREATE DATABASE ${process.env.DB_NAME} WITH ENCODING 'UTF8' LC_COLLATE 'en_US.UTF-8' LC_CTYPE 'en_US.UTF-8' TEMPLATE template0`);
            console.log(`Base de datos ${process.env.DB_NAME} creada.`);

            // Conectar a la nueva base de datos y ejecutar el esquema
            const dbClient = new Client({
                user: process.env.DB_USER,
                host: process.env.DB_HOST,
                database: process.env.DB_NAME,
                password: process.env.DB_PASSWORD,
                port: process.env.DB_PORT,
                options: '-c client_encoding=UTF8'
            });

            await dbClient.connect();

            const schemaPath = path.join(__dirname, '../../db/schema.sql'); // Asegúrate de que la ruta sea correcta
            const schemaSQL = fs.readFileSync(schemaPath, 'utf8');
            await dbClient.query(schemaSQL);
            console.log('Tablas y datos iniciales creados correctamente.');

            await dbClient.end();
            console.log('Cliente de la base de datos desconectado correctamente.');
        } else {
            console.log(`Base de datos ${process.env.DB_NAME} ya existe. Conexión lista.`);
        }

        await initialClient.end();
    } catch (err) {
        console.error('Error durante la configuración inicial de la base de datos:', err);
        handleError(err, null, null, null);
        process.exit(1);
    }
}

checkAndCreateDatabaseAndTables().catch(err => {
    console.error('Error al inicializar la base de datos:', err);
    handleError(err, null, null, null);
});

export default pool;
