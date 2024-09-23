import dotenv from 'dotenv';
import app from './src/app.js';

// Cargar variables de entorno desde el archivo .env
dotenv.config();

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost'; // Puedes configurar el host en .env o usar 'localhost' por defecto

app.listen(PORT, () => {
    console.log(`Server running at http://${HOST}:${PORT}/`);
    console.log(`Swagger UI available at http://${HOST}:${PORT}/api-docs`);
});
