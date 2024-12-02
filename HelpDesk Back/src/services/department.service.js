import DepartmentModel from '../models/department.model.js';

class DepartmentService {
    //* Servicio funcional
    async searchDepartments(search = '') {
        try {
            // Conexión con los modelos o parámetros SQL
            return await DepartmentModel.searchDepartments(search);
        } catch (error) {
            // Lanza el error para que sea manejado por el controlador
            throw error;
        }
    }

    async getDepartmentsWithCounts(page = 1, limit = 10, search = '') {
        try {
            return await DepartmentModel.getDepartmentsWithCounts(page, limit, search);
        } catch (error) {
            console.error('Error en getDepartmentsWithCounts:', error.message);
            throw error;
        }
    }
    

    // Crear un nuevo departamento
    async createDepartment(departmentName) {
        try {
            return await DepartmentModel.createDepartment(departmentName);
        } catch (error) {
            throw error; // Lanza el error para que sea manejado por el controlador
        }
    }

    // Editar un departamento existente
    async updateDepartment(id, departmentName) {
        try {
            return await DepartmentModel.updateDepartment(id, departmentName);
        } catch (error) {
            throw error; // Lanza el error para que sea manejado por el controlador
        }
    }

    // Eliminar un departamento
    async deleteDepartment(id) {
        try {
            await DepartmentModel.deleteDepartment(id);
        } catch (error) {
            throw error; // Lanza el error para que sea manejado por el controlador
        }
    }


}

export default new DepartmentService();
