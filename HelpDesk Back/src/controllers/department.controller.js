import DepartmentService from '../services/department.service.js';

class DepartmentController {
    //*Funcionalidades correctas

    async searchDepartments(req, res) {
        try {
            //Extraccion de la variable search en request
            const { search } = req.query;
            //Busqueda en los servicios para su uso
            const departments = await DepartmentService.searchDepartments(search || '');
            return res.status(200).json(departments);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }



    //!Eliminar funcionalidades
    async createDepartment(req, res) {
        try {
            const department = await DepartmentService.createDepartment(req.body);
            return res.status(201).json(department);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getAllDepartments(req, res) {
        try {
            const departments = await DepartmentService.getAllDepartments();
            return res.status(200).json(departments);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getDepartmentById(req, res) {
        try {
            const department = await DepartmentService.getDepartmentById(req.params.id);
            if (!department) {
                return res.status(404).json({ message: 'Department not found' });
            }
            return res.status(200).json(department);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async updateDepartment(req, res) {
        try {
            const updatedDepartment = await DepartmentService.updateDepartment(req.params.id, req.body);
            if (!updatedDepartment) {
                return res.status(404).json({ message: 'Department not found' });
            }
            return res.status(200).json(updatedDepartment);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async deleteDepartment(req, res) {
        try {
            const deletedDepartment = await DepartmentService.deleteDepartment(req.params.id);
            if (!deletedDepartment) {
                return res.status(404).json({ message: 'Department not found' });
            }
            return res.status(200).json({ message: 'Department deleted successfully' });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

export default new DepartmentController();
