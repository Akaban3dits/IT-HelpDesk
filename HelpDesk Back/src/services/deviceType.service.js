import DeviceType from '../models/deviceType.model.js';

class DeviceTypeService {
    // Obtener lista paginada de tipos de dispositivos
    async getDeviceTypes(page = 1, limit = 10, search = '') {
        try {
            return await DeviceType.getDeviceTypes(page, limit, search);
        } catch (error) {
            console.error('Error en DeviceTypeService.getDeviceTypes:', error.message);
            throw error;
        }
    }

    async getsearchDeviceTypes(search = '') {
        try {
            // Llamar al modelo para obtener los tipos de dispositivos
            const deviceTypes = await DeviceType.getsearchDeviceTypes(search);
            return deviceTypes;
        } catch (error) {
            console.error('Error en DeviceTypeService.getDeviceTypes:', error.message);
            throw error; // Propagar el error
        }
    }
    

    // Obtener lista limitada de tipos de dispositivos (para autocompletar o búsquedas rápidas)
    async searchDeviceTypes(search = '') {
        try {
            return await DeviceType.getdeviceType(search);
        } catch (error) {
            console.error('Error en DeviceTypeService.searchDeviceTypes:', error.message);
            throw error;
        }
    }

    // Crear un nuevo tipo de dispositivo
    async createDeviceType(typeName, typeCode) {
        try {
            return await DeviceType.createDeviceType(typeName, typeCode);
        } catch (error) {
            console.error('Error en DeviceTypeService.createDeviceType:', error.message);
            throw error;
        }
    }

    // Actualizar un tipo de dispositivo existente
    async updateDeviceType(id, typeName, typeCode) {
        try {
            return await DeviceType.updateDeviceType(id, typeName, typeCode);
        } catch (error) {
            console.error('Error en DeviceTypeService.updateDeviceType:', error.message);
            throw error;
        }
    }

    // Eliminar un tipo de dispositivo
    async deleteDeviceType(id) {
        try {
            return await DeviceType.deleteDeviceType(id);
        } catch (error) {
            console.error('Error en DeviceTypeService.deleteDeviceType:', error.message);
            throw error;
        }
    }
}

export default new DeviceTypeService();
