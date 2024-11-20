import DeviceTypeModel from '../models/deviceType.model.js';

class DeviceTypeService {
    async getdeviceType(search){
        try {
            const deviceType = await DeviceTypeModel.getdeviceType(search);
            return deviceType;
        } catch (error) {
            throw error;
        }
    }
}

export default new DeviceTypeService();
