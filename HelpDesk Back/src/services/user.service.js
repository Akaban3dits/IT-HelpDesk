import User from '../models/user.model.js';

class UserService {
    async getUsers(page = 1, limit = 10, search = '', filterColumn = '', filterValue = '', sortBy = 'id', sortDirection = 'ASC', status = '', role_name = '') {
        try {
            
            // Llamar al modelo pasando todos los parámetros necesarios
            const result = await User.getUsers(page, limit, search, filterColumn, filterValue, sortBy, sortDirection, status, role_name);
            
            // El resultado ya incluye toda la información necesaria, incluidas las páginas y el total de usuarios
            return result;
        } catch (error) {
            console.error('Error en getUsers del servicio:', error.message);
            throw error; // O manejar el error de acuerdo a tu lógica de aplicación
        }
    }


    async getUserByFriendlyCode(friendly_code) {
        const user = await User.getUserByFriendlyCode(friendly_code);
        return user;
    }
    

    async createUser(createUserDto) {
        const user = await User.createUser(createUserDto);
        return user;
    }

    async updateUser(friendly_code, updateUserDto) {

        const user = await User.updateUser(friendly_code, updateUserDto);
        return user;
    }

    async deleteUser(friendly_code) {
        try {
            const user = await User.deleteUser(friendly_code);

            if (!user) {
                return null;  // Si no se encuentra el usuario
            }

            return user;  // Retorna el usuario eliminado (lógicamente)
        } catch (error) {
            throw error;  // Lanza el error para que sea manejado por el controlador
        }
    }

}

export default new UserService();
