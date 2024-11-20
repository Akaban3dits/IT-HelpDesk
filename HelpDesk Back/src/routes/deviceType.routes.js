import { Router } from 'express';
import DeviceTypeController from '../controllers/deviceType.controller.js';
import authenticateToken from '../middlewares/auth.js';

const router = Router();
//TODO Realizar una funcion de busqueda como selecteable 

router.get('/device-type/search', authenticateToken, DeviceTypeController.getdeviceType);

//TODO Crear, EDITAR, ELIMINAR, Conseguir todo

export default router;
