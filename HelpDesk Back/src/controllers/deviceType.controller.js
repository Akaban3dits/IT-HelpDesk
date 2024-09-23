import DeviceTypeService from '../services/deviceType.service.js';

class DeviceTypeController {
    async createDeviceType(req, res) {
        try {
            const deviceType = await DeviceTypeService.createDeviceType(req.body);
            return res.status(201).json(deviceType);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getAllDeviceTypes(req, res) {
        try {
            const deviceTypes = await DeviceTypeService.getAllDeviceTypes();
            return res.status(200).json(deviceTypes);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getDeviceTypeById(req, res) {
        try {
            const deviceType = await DeviceTypeService.getDeviceTypeById(req.params.id);
            if (!deviceType) {
                return res.status(404).json({ message: 'Device Type not found' });
            }
            return res.status(200).json(deviceType);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async updateDeviceType(req, res) {
        try {
            const updatedDeviceType = await DeviceTypeService.updateDeviceType(req.params.id, req.body);
            if (!updatedDeviceType) {
                return res.status(404).json({ message: 'Device Type not found' });
            }
            return res.status(200).json(updatedDeviceType);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async deleteDeviceType(req, res) {
        try {
            const deletedDeviceType = await DeviceTypeService.deleteDeviceType(req.params.id);
            if (!deletedDeviceType) {
                return res.status(404).json({ message: 'Device Type not found' });
            }
            return res.status(200).json({ message: 'Device Type deleted successfully' });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

export default new DeviceTypeController();
