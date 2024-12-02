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

    async getDepartmentsWithCounts(req, res, next) {
        try {
            const { page = 1, limit = 10, search = '' } = req.query;
    
            const departments = await DepartmentService.getDepartmentsWithCounts(page, limit, search);
    
            return res.status(200).json(departments);
        } catch (error) {
            console.error('Error en getDepartmentsWithCounts:', error.message);
            next(error);
        }
    }
    

    async createDepartment(req, res, next) {
        try {
            const { department_name } = req.body;
            const department = await DepartmentService.createDepartment(department_name);
            res.status(201).json(department);
        } catch (error) {
            console.error('Error al crear el departamento:', error.message);
            next(error);
        }
    }

    async updateDepartment(req, res, next) {
        try {
            const { id } = req.params;
            const { department_name } = req.body;
            const updatedDepartment = await DepartmentService.updateDepartment(id, department_name);
            res.status(200).json(updatedDepartment);
        } catch (error) {
            console.error('Error al actualizar el departamento:', error.message);
            next(error);
        }
    }

    async deleteDepartment(req, res, next) {
        try {
            const { id } = req.params;
            await DepartmentService.deleteDepartment(id);
            res.status(204).send();
        } catch (error) {
            console.error('Error al eliminar el departamento:', error.message);
            next(error);
        }
    }
}

export default new DepartmentController();
