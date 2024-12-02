import DeviceService from '../services/device.service.js';

class DeviceController {
    //Funcionalidad comprobada y correcta
    async getDevices(req, res) {
        try {
            //Buscar vacio en caso de que search este vacio
            const { search = '' } = req.query;
            //Añadir el parametro de busqueda al Servicio
            const devices = await DeviceService.getDevices(search);
            return res.status(200).json(devices);
        } catch (error) {
            next(error);
        }
    }

    // Obtener lista de dispositivos
    async fetchDevicesList(req, res, next) {
        try {
            const { page = 1, limit = 10, search = '' } = req.query;
            console.log('FetchDevicesList params:', { page, limit, search });

            const devices = await DeviceService.fetchDevicesList(
                parseInt(page, 10) || 1,
                parseInt(limit, 10) || 10,
                search
            );

            return res.status(200).json(devices);
        } catch (error) {
            console.error('Error en fetchDevicesList:', error.message);
            next(error);
        }
    }
    // Crear un dispositivo
    async createDevice(req, res, next) {
        try {
            const { device_name, device_type_id } = req.body;
            const newDevice = await DeviceService.createDevice(device_name, device_type_id);
            return res.status(201).json(newDevice);
        } catch (error) {
            console.error('Error en createDevice:', error.message);
            next(error);
        }
    }

    // Actualizar un dispositivo
    async updateDevice(req, res, next) {
        try {
            const { id } = req.params;
            const { device_name, device_type_id } = req.body;
            const updatedDevice = await DeviceService.updateDevice(id, device_name, device_type_id);
            return res.status(200).json(updatedDevice);
        } catch (error) {
            console.error('Error en updateDevice:', error.message);
            next(error);
        }
    }

    // Eliminar un dispositivo
    async deleteDevice(req, res, next) {
        try {
            const { id } = req.params;
            await DeviceService.deleteDevice(id);
            return res.status(204).send();
        } catch (error) {
            console.error('Error en deleteDevice:', error.message);
            next(error);
        }
    }

}

export default new DeviceController();
