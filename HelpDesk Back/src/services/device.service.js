import DeviceModel from '../models/device.model.js';

class DeviceService {

    //*Servicio en uso
    async getDevices(search) {
        try {
            const devices = await DeviceModel.getDevices(search);
            return devices;
        } catch (error) {
            throw error;
        }
    }

    async getById(id){
        try {
            const device = await DeviceModel.getDeviceById(id);
            return device;
        } catch (error) {
            throw error;
            
        }
    }

    async fetchDevicesList(page = 1, limit = 10, search = '') {
        try {
            console.log('DeviceService.fetchDevicesList called with:', { page, limit, search });
            return await DeviceModel.fetchDevicesList(page, limit, search.trim());
        } catch (error) {
            console.error('Error en DeviceService.fetchDevicesList:', error.message);
            throw error;
        }
    }

    // Crear un dispositivo
    async createDevice(device_name, device_type_id) {
        try {
            return await DeviceModel.createDevice(device_name, device_type_id);
        } catch (error) {
            console.error('Error en DeviceService.createDevice:', error.message);
            throw error;
        }
    }

    // Actualizar un dispositivo
    async updateDevice(id, device_name, device_type_id) {
        try {
            return await DeviceModel.updateDevice(id, device_name, device_type_id);
        } catch (error) {
            console.error('Error en DeviceService.updateDevice:', error.message);
            throw error;
        }
    }

    // Eliminar un dispositivo
    async deleteDevice(id) {
        try {
            await DeviceModel.deleteDevice(id);
        } catch (error) {
            console.error('Error en DeviceService.deleteDevice:', error.message);
            throw error;
        }
    }
}

export default new DeviceService();
