import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';

// Simular __dirname en un módulo ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear el directorio de logs si no existe
const logsDirectory = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDirectory)) {
    fs.mkdirSync(logsDirectory);
}

// Manejador de errores
const handleError = (err, req, res, next) => {
    const errorId = uuidv4(); // Genera un ID único para cada error
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    const timestamp = new Date().toISOString();

    // Diferentes tipos de errores
    let errorType = 'General Error';

    if (err.code) {
        switch (err.code) {
            case 'ECONNREFUSED':
                errorType = 'Database Connection Error';
                break;
            case 'ER_DUP_ENTRY':
            case '23505': // Código de error para duplicados en PostgreSQL
                errorType = 'Database Error - Duplicate Entry';
                break;
            default:
                errorType = 'Database Error';
        }
    } else if (err.name === 'ValidationError') {
        errorType = 'Validation Error';
    } else if (req && req.method) {
        errorType = `HTTP ${req.method} Error`;
    }

    // Formatear la entrada del log
    const logMessage = `Error ID: ${errorId}\nTimestamp: ${timestamp}\nError Type: ${errorType}\nStatus Code: ${statusCode}\nMessage: ${message}\nStack: ${err.stack || 'N/A'}\n\n`;

    // Determinar el nombre del archivo de log según el mes y el año
    const logFileName = `error-log-${new Date().getFullYear()}-${new Date().getMonth() + 1}.txt`;
    const logFilePath = path.join(logsDirectory, logFileName);

    // Escribir el log en el archivo correspondiente al mes
    fs.appendFile(logFilePath, logMessage, (writeError) => {
        if (writeError) {
            console.error('Failed to write error log:', writeError);
        }
    });

    // Responder al cliente con el error
    if (res && typeof res.status === 'function') {
        res.status(statusCode).json({
            errorId,
            timestamp,
            message,
            errorType,
            stack: process.env.NODE_ENV === 'production' ? null : err.stack, // Ocultar stack en producción
        });
    }

    // Llamar a next() si es necesario para manejar otros middlewares
    if (typeof next === 'function') {
        next(err);
    }
};

export default handleError;
