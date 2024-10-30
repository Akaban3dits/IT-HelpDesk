import DeviceModel from '../models/device.model.js';

class DeviceService {

    //*Servicio en uso
    async getDevices(search) {
        try {
            //Envio del parametro para que se haga la busqueda en el script
            const devices = await DeviceModel.getDevices(search);
            return devices;
        } catch (error) {
            throw error;
        }
    }

    //!Servicios sin uso

    async createDevice(deviceData) {
        return await DeviceModel.create(deviceData);
    }

    async getAllDevices() {
        return await DeviceModel.findAll();
    }

    async getDeviceById(deviceId) {
        return await DeviceModel.findById(deviceId);
    }

    async updateDevice(deviceId, deviceData) {
        return await DeviceModel.update(deviceId, deviceData);
    }

    async deleteDevice(deviceId) {
        return await DeviceModel.delete(deviceId);
    }

    
}

export default new DeviceService();
