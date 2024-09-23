import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js';
import roleRoutes from './routes/role.routes.js'; 
import departmentRoutes from './routes/department.routes.js';
import deviceTypeRoutes from './routes/deviceType.routes.js';
import userRoutes from './routes/user.routes.js';
import deviceRoutes from './routes/device.routes.js';
import priorityRoutes from './routes/priority.routes.js';
import categoryRoutes from './routes/category.routes.js';
import statusRoutes from './routes/status.routes.js';
import ticketRoutes from './routes/ticket.routes.js';
import statusHistoryRoutes from './routes/statusHistory.routes.js';
import attachmentRoutes from './routes/attachment.routes.js';
import taskRoutes from './routes/task.routes.js';
import commentRoutes from './routes/comment.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import handleError from './middlewares/errorHandler.js';
import { swaggerUi, swaggerSpec } from './config/swaggerConfig.js';

const app = express();

app.use(cors());
app.use(express.json());

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
app.use('/api', categoryRoutes);
app.use('/api', statusRoutes);
app.use('/api', ticketRoutes);
app.use('/api', statusHistoryRoutes);
app.use('/api', attachmentRoutes);
app.use('/api', taskRoutes);
app.use('/api', commentRoutes);
app.use('/api', notificationRoutes);

// Importación del gestor de errores
app.use(handleError);

export default app;
