import RoleService from '../services/role.service.js';

class RoleController {

    //*Funcionalidad en uso
    async getAllRoles(req, res) {
        try {
            const roles = await RoleService.getAllRoles();
            return res.status(200).json(roles);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

export default new RoleController();
