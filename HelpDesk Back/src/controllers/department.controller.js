import DepartmentService from '../services/department.service.js';

class DepartmentController {
    //*Funcionalidades correctas

    async searchDepartments(req, res, next) {
        try {
            // Extracción de la variable search en request
            const { search } = req.query;
            // Búsqueda en los servicios para su uso
            const departments = await DepartmentService.searchDepartments(search || '');
            return res.status(200).json(departments);
        } catch (error) {
            // Pasar el error al middleware de manejo de errores
            next(error);
            return res.status(500).json({ error: error.message });
        }
    }
}

export default new DepartmentController();
