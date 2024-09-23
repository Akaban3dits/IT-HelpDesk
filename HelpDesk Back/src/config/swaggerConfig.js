import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Autenticación',
            version: '1.0.0',
            description: 'Documentación de la API con autenticación JWT',
        },
        servers: [
            {
                url: 'http://localhost:5000/api', // Cambia esta URL según tu configuración
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: [
        './src/routes/*.js',   // archivos de rutas
        './src/dtos/*.js'      // archivos donde están definidos los DTOs
    ], 
};

const swaggerSpec = swaggerJsdoc(options);

export { swaggerUi, swaggerSpec };
