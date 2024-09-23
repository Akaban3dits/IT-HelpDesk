import RoleModel from '../models/role.model.js';

class RoleService {
    async createRole(role_name) {
        return await RoleModel.create(role_name);
    }

    async getAllRoles() {
        return await RoleModel.findAll();
    }

    async getRoleById(role_id) {
        return await RoleModel.findById(role_id);
    }

    async updateRole(role_id, role_name) {
        return await RoleModel.update(role_id, role_name);
    }

    async deleteRole(role_id) {
        return await RoleModel.delete(role_id);
    }
}

export default new RoleService();
