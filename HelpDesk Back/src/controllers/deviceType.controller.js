import DeviceTypeService from '../services/deviceType.service.js';

class DeviceTypeController {
    async getdeviceType(req, res) {
        try {
            const { search = '' } = req.query;
            const deviceTypes = await DeviceTypeService.getdeviceType(search);
            return res.status(200).json(devices);
        }
        catch (error) {
            next(error);
        }
    }
}

export default new DeviceTypeController();
