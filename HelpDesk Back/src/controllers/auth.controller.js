import AuthService from '../services/auth.service.js';
import { LoginDto } from '../dtos/auth.dto.js';

class AuthController {
    async login(req, res, next) {
        try {
            //Enviar parametros de comparacion de codigo
            const loginDto = new LoginDto(req.body);
            
            const token = await AuthService.login(loginDto);
            res.status(200).json({ accessToken: token });
        } catch (error) {
            next(error); 
        }
    }
}

export default new AuthController();
