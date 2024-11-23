import User from '../models/user.model.js';
import Role from '../models/role.model.js';
import jwt from 'jsonwebtoken';

class AuthService {
    async login(loginDto) {
        // Busca por el correo proporcionado
        const user = await User.getUserByEmail(loginDto.email);
        if (!user) {
            const error = new Error('Credenciales inválidas');
            error.statusCode = 401;
            throw error;
        }
        
        // Verificación de si la cuenta es activa o inactiva
        if (!user.status) {
            const error = new Error('Cuenta inactiva, contacte al administrador');
            error.statusCode = 403;
            throw error;
        }
        
        // Comparativa de contraseñas
        const validPassword = await User.validatePassword(user.password, loginDto.password);
        if (!validPassword) {
            const error = new Error('Credenciales inválidas');
            error.statusCode = 401;
            throw error;
        }
        
        // Búsqueda de rol, verifica si no tiene uno asignado
        const role = await Role.findById(user.role_id);
        if (!role) {
            const error = new Error('Credenciales inválidas');
            error.statusCode = 401;
            throw error;
        }
        
        // Generación del token
        const token = jwt.sign(
            {
                userId: user.friendly_code,
                username: `${user.first_name} ${user.last_name}`,
                role: {
                    id: role.id,
                    name: role.role_name
                }
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        return token;
    }
}

export default new AuthService();
