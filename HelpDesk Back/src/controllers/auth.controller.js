import AuthService from '../services/auth.service.js';
import { LoginDto } from '../dtos/auth.dto.js';

class AuthController {
    async login(req, res, next) {
        try {
            const loginDto = new LoginDto(req.body);
            const token = await AuthService.login(loginDto);
            res.status(200).json({ accessToken: token });
        } catch (error) {
            // Agrega información adicional al error para su manejo en el middleware
            if (error.message === 'Credenciales inválidas') {
                error.statusCode = 401;
            } else if (error.message === 'Cuenta inactiva, contacte al administrador') {
                error.statusCode = 403;
            }
            // Pasa el error al middleware de manejo de errores
            next(error);
        }
    }
}

export default new AuthController();
