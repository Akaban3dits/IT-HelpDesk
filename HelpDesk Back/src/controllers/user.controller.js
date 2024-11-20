import UserService from '../services/user.service.js';
import bcrypt from 'bcrypt';

class UserController {

    //* Controladores validos

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
            next(error);
            return res.status(500).json({ error: error.message });
        }
    }

    async createUser(req, res) {
        try {
            const user = await UserService.createUser(req.body);
            return res.status(201).json(user);
        } catch (error) {
            // Verifica si el error es de clave duplicada
            if (error.code === '23505') {
                if (error.constraint === 'users_email_key') {
                    return res.status(400).json({ error: 'El email ya está registrado.' });
                } else if (error.constraint === 'users_phone_number_key') {
                    return res.status(400).json({ error: 'El número de teléfono ya está en uso.' });
                }
            }
            // Error genérico
            return res.status(500).json({ error: 'Error interno del servidor.' });
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
            next(error);
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
            throw error;
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
            next(error);
            return res.status(500).json({ error: error.message });
        }
    }

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
            next(error);
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
            next(error);
            return res.status(500).json({ error: error.message });
        }
    }
}

export default new UserController();
