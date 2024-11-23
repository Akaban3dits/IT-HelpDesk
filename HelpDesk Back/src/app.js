import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import roleRoutes from './routes/role.routes.js'; 
import departmentRoutes from './routes/department.routes.js';
import deviceTypeRoutes from './routes/deviceType.routes.js';
import userRoutes from './routes/user.routes.js';
import deviceRoutes from './routes/device.routes.js';
import priorityRoutes from './routes/priority.routes.js';
import statusRoutes from './routes/status.routes.js';
import ticketRoutes from './routes/ticket.routes.js';
import taskRoutes from './routes/task.routes.js';
import commentRoutes from './routes/comment.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import handleError from './middlewares/errorHandler.js';
import { swaggerUi, swaggerSpec } from './config/swaggerConfig.js';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import fs from 'fs';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurar CORS antes de las rutas
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    exposedHeaders: ['Content-Disposition']
}));

// Configurar Helmet con políticas más permisivas para archivos
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "blob:"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            fontSrc: ["'self'", "data:"],
            connectSrc: ["'self'"],
            mediaSrc: ["'self'", "blob:"],
            frameSrc: ["'self'"],
        },
    },
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginEmbedderPolicy: false
}));

// Configurar la ruta de archivos estáticos con middleware de autenticación y verificación de existencia
app.use('/uploads', 
    (req, res, next) => {
        // Corregir la ruta completa al archivo
        const filePath = path.join(__dirname, '../uploads', req.url); 

        // Verificar si el archivo realmente existe
        fs.access(filePath, fs.constants.F_OK, (err) => {
            if (err) {
                console.error('Error: Archivo no encontrado:', filePath);
                return res.status(404).json({ message: 'Archivo no encontrado' });
            } else {
                next(); // Procede solo si el archivo existe
            }
        });
    },
    express.static(path.join(__dirname, '../uploads'), {
        setHeaders: (res, path, stat) => {
            res.set('Cross-Origin-Resource-Policy', 'cross-origin');
            res.set('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:3000');
        }
    })
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Configurar Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Registrar las rutas directamente en app.js
app.use('/api/auth', authRoutes);
app.use('/api', roleRoutes);
app.use('/api', departmentRoutes);
app.use('/api', deviceTypeRoutes);
app.use('/api', userRoutes);
app.use('/api', deviceRoutes);
app.use('/api', priorityRoutes);
app.use('/api', statusRoutes);
app.use('/api', ticketRoutes);
app.use('/api', taskRoutes);
app.use('/api', commentRoutes);
app.use('/api', notificationRoutes);

// Importación del gestor de errores
app.use(handleError);

export default app;
