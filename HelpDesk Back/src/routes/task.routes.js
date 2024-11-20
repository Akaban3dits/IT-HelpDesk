import { Router } from 'express';
import TaskController from '../controllers/task.controller.js';
import authenticateToken from '../middlewares/auth.js';

const router = Router();



export default router;
