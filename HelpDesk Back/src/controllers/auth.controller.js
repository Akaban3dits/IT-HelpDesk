import AuthService from '../services/auth.service.js';
import { LoginDto } from '../dtos/auth.dto.js';

class AuthController {
    /**
     * Inicia sesión y devuelve un token JWT.
     */
    async login(req, res, next) {
        try {
            const loginDto = new LoginDto(req.body);
            const token = await AuthService.login(loginDto);
            res.status(200).json({ accessToken: token });
        } catch (error) {
            next(error); // Pasar el error al middleware de manejo de errores
        }
    }
}

export default new AuthController();
