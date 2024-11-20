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

}

export default new DeviceService();
