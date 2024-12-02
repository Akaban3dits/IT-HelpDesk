import { Router } from 'express';
import DeviceController from '../controllers/device.controller.js';
import authenticateToken from '../middlewares/auth.js';

const router = Router();

//*Ruta funcional
router.get('/devices/search', authenticateToken, DeviceController.getDevices);

router.get('/devices/list', authenticateToken, DeviceController.fetchDevicesList); // Obtener lista de dispositivos
router.post('/devices', authenticateToken, DeviceController.createDevice); // Crear un dispositivo
router.put('/devices/:id', authenticateToken, DeviceController.updateDevice); // Actualizar un dispositivo
router.delete('/devices/:id', authenticateToken, DeviceController.deleteDevice); // Eliminar un dispositivo



export default router;

