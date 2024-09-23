import DepartmentModel from '../models/department.model.js';

class DepartmentService {
    async createDepartment(departmentData) {
        return await DepartmentModel.create(departmentData);
    }
    async getAllDepartments() {
        return await DepartmentModel.findAll();
    }
    // Modificado para usar la nueva función de búsqueda con límite
    async searchDepartments(search = '') {
        return await DepartmentModel.searchDepartments(search);
    }

    async getDepartmentById(departmentId) {
        return await DepartmentModel.findById(departmentId);
    }

    async updateDepartment(departmentId, departmentData) {
        return await DepartmentModel.update(departmentId, departmentData);
    }

    async deleteDepartment(departmentId) {
        return await DepartmentModel.delete(departmentId);
    }
}

export default new DepartmentService();
