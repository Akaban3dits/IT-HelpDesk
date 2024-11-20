import User from '../models/user.model.js';
import { v4 as uuidv4 } from 'uuid';
class UserService {

    //* Servicio validados
    async getUsers(page = 1, limit = 10, search = '', filterColumn = '', filterValue = '', sortBy = 'id', sortDirection = 'ASC', status = '', role_name = '') {
        try {
            // Llamar al modelo pasando todos los parámetros necesarios
            const result = await User.getUsers(page, limit, search, filterColumn, filterValue, sortBy, sortDirection, status, role_name);
            return result;
        } catch (error) {
            throw error; // Lanza el error para que sea manejado por el controlador
        }
    }
    //* Externo, solo crea el codigo para ocultar la id
    async generateFriendlyCode() {
        const datePart = new Date().toISOString().replace(/[-:.TZ]/g, ''); // Parte de la fecha
        const randomPart = uuidv4().split('-')[0]; // Parte aleatoria
        return `${datePart}-${randomPart}`; // Combina ambos para generar el friendly_code
    }
    async createUser(createUserDto) {
        try {
            // Genera el friendly_code antes de la inserción
            const friendlyCode = await this.generateFriendlyCode();
            
            const userData = {
                ...createUserDto,
                friendly_code: friendlyCode,  // Agrega el friendly_code
            };
    
            // Verificación de duplicados
            const existingUserByEmail = await User.findByEmail(userData.email);
            if (existingUserByEmail) {
                throw { code: '23505', constraint: 'users_email_key' };
            }
    
            const existingUserByPhoneNumber = await User.findByPhoneNumber(userData.phone_number);
            if (existingUserByPhoneNumber) {
                throw { code: '23505', constraint: 'users_phone_number_key' };
            }
    
            // Inserción del usuario
            const user = await User.createUser(userData);
            return user;
        } catch (error) {
            throw error;
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
            throw error; // Lanza el error para que sea manejado por el controlador
        }
    }

    async updatePassword(friendly_code, newPassword) {
        try {
            const user = await User.updatePassword(friendly_code, newPassword);
            if (!user) {
                throw new Error('Usuario no encontrado.');
            }
            return user;
        } catch (error) {
            throw error;
        }
    }

    async getAssignableUsers(search) {
        try {
            // Llamar al modelo para obtener los usuarios con los roles especificados
            const users = await User.getAssignableUsers(search);
            return users;
        } catch (error) {
            throw error; // Lanza el error para que sea manejado por el controlador
        }
    }

    async getUserById(userId) {
        try {
            const user = await User.getUserById(userId);
            return user && user.status ? user : null;
        } catch (error) {
            throw error; // Lanza el error para que sea manejado por el controlador
        }
    }
}

export default new UserService();
