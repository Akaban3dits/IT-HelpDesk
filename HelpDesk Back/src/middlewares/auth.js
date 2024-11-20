import jwt from 'jsonwebtoken';
import UserService from '../services/user.service.js'; // Asegúrate de importar tu UserService

const authenticateToken = async (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
        if (err) return res.sendStatus(403);

        // Verificar si el usuario existe y está activo
        const user = await UserService.getUserById(decodedToken.userId);
        if (!user) {
            return res.sendStatus(403); // Retorna un error si el usuario no existe o no está activo
        }

        // Extraer el userId y otras propiedades necesarias del token decodificado y del usuario actualizado
        req.user = {
            id: user.id, // Usar el ID desde la base de datos en caso de necesitar validaciones adicionales
            username: `${user.first_name} ${user.last_name}`, // Ejemplo de cómo podrías manejar los nombres
            role: user.role, // Asumiendo que el rol también se guarda en la base de datos
        };

        next(); // Continúa con la siguiente función en la cadena de middlewares
    });
};

export default authenticateToken;
