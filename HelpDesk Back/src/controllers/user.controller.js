import UserService from '../services/user.service.js';
import bcrypt from 'bcrypt';

class UserController {
    async createUser(req, res) {
        try {
            const user = await UserService.createUser(req.body);
            return res.status(201).json(user);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    async updatePassword(friendly_code, newPassword) {
        const result = await pool.query(
            'UPDATE users SET password = $1 WHERE friendly_code = $2 RETURNING *',
            [newPassword, friendly_code]
        );
        return result.rows[0];
    }

    async getAllUsers(req, res) {
        try {
            const {
                page = 1,
                limit = 10,
                search = '',
                filterColumn = '',
                filterValue = '',
                sortBy = 'first_name',
                sortDirection = 'asc',
                role_id = ''
            } = req.query;

            const status = req.query.status === 'false' ? false : req.query.status === 'true' ? true : undefined;

            const usersData = await UserService.getUsers(
                parseInt(page),
                parseInt(limit),
                search,
                filterColumn,
                filterValue,
                sortBy,
                sortDirection,
                status,
                role_id
            );

            return res.status(200).json(usersData);
        } catch (error) {
            console.error('Error al obtener usuarios:', error.message);
            return res.status(500).json({ error: error.message });
        }
    }

    async getUserByFriendlyCode(req, res) {
        try {
            const user = await UserService.getUserByFriendlyCode(req.params.friendly_code);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async updateUser(req, res) {
        try {
            const updatedUser = await UserService.updateUser(req.params.friendly_code, req.body);
            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(200).json(updatedUser);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async deleteUser(req, res) {
        try {
            const deletedUser = await UserService.deleteUser(req.params.friendly_code);
            if (!deletedUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(200).json({ message: 'User deleted successfully' });
        } catch (error) {
            console.error('Error al eliminar usuario:', error.message);
            return res.status(500).json({ error: error.message });
        }
    }


    async getAssignableUsers(req, res) {
        try {
            // Log para ver el valor de search recibido en la consulta
            const { search = '' } = req.query;
            const users = await UserService.getAssignableUsers(search);
    
            return res.status(200).json(users);
        } catch (error) {
            // Log del error ocurrido durante la ejecución
            console.error('Error al obtener usuarios asignables:', error.message);
            return res.status(500).json({ error: error.message });
        }
    }
    
    

    /**
     * Cambia la contraseña de un usuario existente
     */
    async changePassword(req, res) {
        const { friendly_code } = req.params;
        const { newPassword } = req.body;

        // Validación básica de los campos
        if (!newPassword) {
            return res.status(400).json({ message: 'La nueva contraseña es requerida.' });
        }

        try {
            // Actualizar la contraseña del usuario
            await UserService.updatePassword(friendly_code, newPassword);

            return res.status(200).json({ message: 'Contraseña cambiada exitosamente.' });
        } catch (error) {
            console.error('Error al cambiar la contraseña:', error.message);
            return res.status(500).json({ error: error.message });
        }
    }
}

export default new UserController();
