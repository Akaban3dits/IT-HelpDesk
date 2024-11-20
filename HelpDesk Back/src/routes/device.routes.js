import { Router } from 'express';
import DeviceController from '../controllers/device.controller.js';
import authenticateToken from '../middlewares/auth.js';

const router = Router();

//*Ruta funcional
router.get('/devices/search', authenticateToken, DeviceController.getDevices);

//TODO Crear, Editar Eliminar



export default router;
