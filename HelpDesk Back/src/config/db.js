import dotenv from 'dotenv'; // Carga variables de entorno desde un archivo .env
import pkg from 'pg'; // Importa el paquete 'pg' para interactuar con PostgreSQL
import fs from 'fs'; // Módulo para manejar el sistema de archivos
import path from 'path'; // Módulo para manejar y transformar rutas de archivos
import { fileURLToPath } from 'url'; // Para simular __dirname en módulos ES
import handleError from '../middlewares/errorHandler.js'; // Importa tu error handler

// Simular __dirname y __filename en un módulo ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config(); // Carga las variables de entorno del archivo .env

const { Pool, Client } = pkg; // Extrae Pool y Client del paquete 'pg'

// Configuración de la conexión a la base de datos usando un pool de conexiones
const pool = new Pool({
    user: process.env.DB_USER, // Usuario de la base de datos
    host: process.env.DB_HOST, // Host de la base de datos
    database: process.env.DB_NAME, // Nombre de la base de datos
    password: process.env.DB_PASSWORD, // Contraseña del usuario de la base de datos
    port: process.env.DB_PORT, // Puerto de la base de datos
});

// Función para verificar y crear la base de datos y las tablas si no existen
const checkAndCreateDatabaseAndTables = async () => {
    const client = new Client({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    });

    try {
        await client.connect();

        // Verificar si la base de datos existe
        const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${process.env.DB_NAME}'`);
        if (res.rows.length === 0) {
            await client.query(`CREATE DATABASE ${process.env.DB_NAME}`);
        }

        await client.end();

        const dbClient = new Client({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
        });
        await dbClient.connect();

        const schemaPath = path.join(__dirname, '../../db/schema.sql');
        const schemaSQL = fs.readFileSync(schemaPath, 'utf8');

        try {
            await dbClient.query(schemaSQL);
        } catch (err) {
            if (err.code !== '42P07') {
                throw err;
            }
        }

        await dbClient.query('SELECT NOW() AS "theTime"');

        return dbClient;

    } catch (err) {
        handleError(err, null, null, null);
        process.exit(1);
    }
};

// Ejecutar la función de verificación y creación de la base de datos
checkAndCreateDatabaseAndTables().then(dbClient => {
    console.log('Base de datos lista y conexión activa.');
}).catch(err => handleError(err, null, null, null));

// Conectar al pool de la base de datos
pool.connect((err, client, release) => {
    if (err) {
        handleError(new Error('Error al conectar a la base de datos'), null, null, null);
        return;
    }
    release();
});

export default pool;
