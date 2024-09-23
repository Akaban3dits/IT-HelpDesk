import UserService from '../services/user.service.js';

class UserController {
    async createUser(req, res) {
        try {
            const user = await UserService.createUser(req.body);
            return res.status(201).json(user);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // Controlador para obtener todos los usuarios
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
    
            // Convierte el valor de status a booleano, si es 'true' o 'false', o deja como undefined si no está presente
            const status = req.query.status === 'false' ? false : req.query.status === 'true' ? true : undefined;
    
            // Llama al servicio para obtener los usuarios con los parámetros recibidos
            const usersData = await UserService.getUsers(
                parseInt(page),
                parseInt(limit),
                search,
                filterColumn,
                filterValue,
                sortBy,
                sortDirection,
                status,
                role_id // Asegúrate de pasar el filtro de role_id si está presente
            );
    
            // Devuelve la lista de usuarios obtenidos en la respuesta
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
            // Llamamos al servicio de usuario para realizar el borrado lógico
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
    
}

export default new UserController();
