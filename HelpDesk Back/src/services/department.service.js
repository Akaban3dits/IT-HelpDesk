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
}

export default new DepartmentService();
