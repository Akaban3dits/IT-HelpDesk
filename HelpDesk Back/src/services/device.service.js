import DeviceModel from '../models/device.model.js';

class DeviceService {
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
