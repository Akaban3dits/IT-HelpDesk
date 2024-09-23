import User from '../models/user.model.js';
import Role from '../models/role.model.js';
import jwt from 'jsonwebtoken';

class AuthService {
    async login(loginDto) {
        const user = await User.getUserByEmail(loginDto.email);
        if (!user) {
            throw new Error('Invalid credentials');
        }
        if (!user.status) {
            throw new Error('User account is inactive');
        }

        const validPassword = await User.validatePassword(user.password, loginDto.password);
        if (!validPassword) {
            throw new Error('Invalid credentials');
        }

        const role = await Role.findById(user.role_id);
        if (!role) {
            throw new Error('Role not found');
        }

        const token = jwt.sign(
            {
                userId: user.id,
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
