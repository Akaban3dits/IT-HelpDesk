import User from '../models/user.model.js';

class UserService {
    async getUsers(page = 1, limit = 10, search = '', filterColumn = '', filterValue = '', sortBy = 'id', sortDirection = 'ASC', status = '', role_name = '') {
        try {
            // Llamar al modelo pasando todos los parámetros necesarios
            const result = await User.getUsers(page, limit, search, filterColumn, filterValue, sortBy, sortDirection, status, role_name);
            return result;
        } catch (error) {
            console.error('Error en getUsers del servicio:', error.message);
            throw error; // Lanza el error para que sea manejado por el controlador
        }
    }

    async getUserById(userId) {
        try {
            const user = await User.getUserById(userId);
            return user;
        } catch (error) {
            console.error('Error en getUserById del servicio:', error.message);
            throw error; // Lanza el error para que sea manejado por el controlador
        }
    }

    async getUserByFriendlyCode(friendly_code) {
        try {
            const user = await User.getUserByFriendlyCode(friendly_code);
            if (!user) {
                throw new Error('Usuario no encontrado.');
            }
            return user;
        } catch (error) {
            console.error('Error en getUserByFriendlyCode del servicio:', error.message);
            throw error; // Lanza el error para que sea manejado por el controlador
        }
    }

    async createUser(createUserDto) {
        try {
            const user = await User.createUser(createUserDto);
            return user;
        } catch (error) {
            console.error('Error en createUser del servicio:', error.message);
            throw error; // Lanza el error para que sea manejado por el controlador
        }
    }

    async updateUser(friendly_code, updateUserDto) {
        try {
            const user = await User.updateUser(friendly_code, updateUserDto);
            if (!user) {
                throw new Error('Usuario no encontrado.');
            }
            return user;
        } catch (error) {
            console.error('Error en updateUser del servicio:', error.message);
            throw error; // Lanza el error para que sea manejado por el controlador
        }
    }

    async deleteUser(friendly_code) {
        try {
            const user = await User.deleteUser(friendly_code);
            if (!user) {
                throw new Error('Usuario no encontrado.');
            }
            return user; // Retorna el usuario eliminado (lógicamente)
        } catch (error) {
            console.error('Error en deleteUser del servicio:', error.message);
            throw error; // Lanza el error para que sea manejado por el controlador
        }
    }

    async getAssignableUsers(search) {
        try {
            // Llamar al modelo para obtener los usuarios con los roles especificados
            const users = await User.getAssignableUsers(search);
            return users;
        } catch (error) {
            console.error('Error en getAssignableUsers del servicio:', error.message);
            throw error; // Lanza el error para que sea manejado por el controlador
        }
    }
    

    /**
     * Cambia la contraseña de un usuario
     */
    async updatePassword(friendly_code, newPassword) {
        try {
            const user = await User.updatePassword(friendly_code, newPassword);
            if (!user) {
                throw new Error('Usuario no encontrado.');
            }
            return user;
        } catch (error) {
            console.error('Error en updatePassword del servicio:', error.message);
            throw error;
        }
    }
}

export default new UserService();
