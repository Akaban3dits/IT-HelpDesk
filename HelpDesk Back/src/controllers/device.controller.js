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
}

export default new DeviceController();
