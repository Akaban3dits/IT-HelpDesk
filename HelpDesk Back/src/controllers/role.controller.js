import RoleService from '../services/role.service.js';

class RoleController {
    async createRole(req, res) {
        try {
            const role = await RoleService.createRole(req.body);
            return res.status(201).json(role);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getAllRoles(req, res) {
        try {
            const roles = await RoleService.getAllRoles();
            return res.status(200).json(roles);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getRoleById(req, res) {
        try {
            const role = await RoleService.getRoleById(req.params.id);
            if (!role) {
                return res.status(404).json({ message: 'Role not found' });
            }
            return res.status(200).json(role);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async updateRole(req, res) {
        try {
            const updatedRole = await RoleService.updateRole(req.params.id, req.body);
            if (!updatedRole) {
                return res.status(404).json({ message: 'Role not found' });
            }
            return res.status(200).json(updatedRole);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async deleteRole(req, res) {
        try {
            const deletedRole = await RoleService.deleteRole(req.params.id);
            if (!deletedRole) {
                return res.status(404).json({ message: 'Role not found' });
            }
            return res.status(200).json({ message: 'Role deleted successfully' });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

export default new RoleController();
