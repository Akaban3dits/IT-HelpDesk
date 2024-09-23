import DeviceTypeModel from '../models/deviceType.model.js';

class DeviceTypeService {
    async createDeviceType(deviceTypeData) {
        return await DeviceTypeModel.create(deviceTypeData);
    }

    async getAllDeviceTypes() {
        return await DeviceTypeModel.findAll();
    }

    async getDeviceTypeById(deviceTypeId) {
        return await DeviceTypeModel.findById(deviceTypeId);
    }

    async updateDeviceType(deviceTypeId, deviceTypeData) {
        return await DeviceTypeModel.update(deviceTypeId, deviceTypeData);
    }

    async deleteDeviceType(deviceTypeId) {
        return await DeviceTypeModel.delete(deviceTypeId);
    }
}

export default new DeviceTypeService();
