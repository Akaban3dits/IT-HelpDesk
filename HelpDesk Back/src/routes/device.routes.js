import { Router } from 'express';
import DeviceController from '../controllers/device.controller.js';
import authenticateToken from '../middlewares/auth.js';

const router = Router();

//*Ruta funcional
router.get('/devices/search', authenticateToken, DeviceController.getDevices);



// Rutas sin uso
router.get('/devices', authenticateToken, DeviceController.getAllDevices);

// Ruta para obtener dispositivo por ID
router.get('/devices/:device_id', authenticateToken, DeviceController.getDeviceById);

// Otras rutas de dispositivos
router.post('/devices', authenticateToken, DeviceController.createDevice);
router.put('/devices/:device_id', authenticateToken, DeviceController.updateDevice);
router.delete('/devices/:device_id', authenticateToken, DeviceController.deleteDevice);

export default router;
