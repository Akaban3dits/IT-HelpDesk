import { Router } from 'express';
import DeviceTypeController from '../controllers/deviceType.controller.js';
import authenticateToken from '../middlewares/auth.js';

const router = Router();


// Obtener lista paginada de tipos de dispositivos
router.get('/device-types', authenticateToken, DeviceTypeController.getDeviceTypes);

// Buscar tipos de dispositivos (búsqueda rápida)
router.get('/device-types/search', authenticateToken, DeviceTypeController.getsearchDeviceTypes);

// Crear un nuevo tipo de dispositivo
router.post('/device-types', authenticateToken, DeviceTypeController.createDeviceType);

// Actualizar un tipo de dispositivo existente
router.put('/device-types/:id', authenticateToken, DeviceTypeController.updateDeviceType);

// Eliminar un tipo de dispositivo
router.delete('/device-types/:id', authenticateToken, DeviceTypeController.deleteDeviceType);

export default router;
