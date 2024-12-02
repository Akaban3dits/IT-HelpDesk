import DeviceTypeService from '../services/deviceType.service.js';

class DeviceTypeController {
    async getDeviceTypes(req, res, next) {
        try {
            const { page = 1, limit = 10, search = '' } = req.query;
            const deviceTypes = await DeviceTypeService.getDeviceTypes(page, limit, search);
            return res.status(200).json(deviceTypes);
        } catch (error) {
            console.error('Error en DeviceTypeController.getDeviceTypes:', error.message);
            next(error);
        }
    }

    async getsearchDeviceTypes(req, res, next) {
        try {
            // Obtener el término de búsqueda desde los parámetros de consulta
            const { search = '' } = req.query;
    
            // Llamar al servicio con el término de búsqueda
            const deviceTypes = await DeviceTypeService.getsearchDeviceTypes(search);
    
            // Retornar los tipos de dispositivos en la respuesta
            return res.status(200).json(deviceTypes);
        } catch (error) {
            console.error('Error en getDeviceTypes:', error.message);
            next(error); // Manejo de errores
        }
    }
    
    

    async createDeviceType(req, res, next) {
        try {
            const { typeName, typeCode } = req.body;
            const newDeviceType = await DeviceTypeService.createDeviceType(typeName, typeCode);
            return res.status(201).json(newDeviceType);
        } catch (error) {
            next(error);
        }
    }

    async updateDeviceType(req, res, next) {
        try {
            const { id } = req.params;
            const { typeName, typeCode } = req.body;
            const updatedDeviceType = await DeviceTypeService.updateDeviceType(id, typeName, typeCode);
            return res.status(200).json(updatedDeviceType);
        } catch (error) {
            next(error);
        }
    }

    async deleteDeviceType(req, res, next) {
        try {
            const { id } = req.params;
            await DeviceTypeService.deleteDeviceType(id);
            return res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

export default new DeviceTypeController();
