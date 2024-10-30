import User from '../models/user.model.js';
import Role from '../models/role.model.js';
import jwt from 'jsonwebtoken';


//* Funcionando y sin errores
class AuthService {
    async login(loginDto) {

        //Busca por el correo proporcionado una similitud
        const user = await User.getUserByEmail(loginDto.email);
        if (!user) {
            throw new Error('Invalid credentials');
        }
        //Si la cuenta es activa o inactiva
        if (!user.status) {
            throw new Error('User account is inactive');
        }
        //Comparativa con metodo de desencriptado, 
        const validPassword = await User.validatePassword(user.password, loginDto.password);
        if (!validPassword) {
            throw new Error('Invalid credentials');
        }
        //Busqueda de rol, si no tiene uno otorgado
        const role = await Role.findById(user.role_id);
        if (!role) {
            throw new Error('Role not found');
        }
        //Generacion del token
        const token = jwt.sign(
            {
                //Datos necesarios para su uso sin problemas de seguridad
                userId: user.id,
                username: `${user.first_name} ${user.last_name}`,
                role: {
                    id: role.id,
                    name: role.role_name
                }
            },
            process.env.JWT_SECRET,
            //Tiempo de expiración
            { expiresIn: '1h' }
        );
        return token;
    }
}

export default new AuthService();
