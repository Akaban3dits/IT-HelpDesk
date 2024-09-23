import DeviceService from '../services/device.service.js';

class DeviceController {
    async createDevice(req, res) {
        try {
            const device = await DeviceService.createDevice(req.body);
            return res.status(201).json(device);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getAllDevices(req, res) {
        try {
            const devices = await DeviceService.getAllDevices();
            return res.status(200).json(devices);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getDeviceById(req, res) {
        try {
            const device = await DeviceService.getDeviceById(req.params.id);
            if (!device) {
                return res.status(404).json({ message: 'Device not found' });
            }
            return res.status(200).json(device);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async updateDevice(req, res) {
        try {
            const updatedDevice = await DeviceService.updateDevice(req.params.id, req.body);
            if (!updatedDevice) {
                return res.status(404).json({ message: 'Device not found' });
            }
            return res.status(200).json(updatedDevice);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async deleteDevice(req, res) {
        try {
            const deletedDevice = await DeviceService.deleteDevice(req.params.id);
            if (!deletedDevice) {
                return res.status(404).json({ message: 'Device not found' });
            }
            return res.status(200).json({ message: 'Device deleted successfully' });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

export default new DeviceController();
