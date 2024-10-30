import RoleModel from '../models/role.model.js';

class RoleService {
    async getAllRoles() {
        return await RoleModel.findAll();
    }
}

export default new RoleService();
