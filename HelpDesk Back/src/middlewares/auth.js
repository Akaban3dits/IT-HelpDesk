import jwt from 'jsonwebtoken';
import UserService from '../services/user.service.js'; // Asegúrate de que esté correctamente importado

const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No se proporcionó un token de autorización' });
        }

        // Verificar el token JWT
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                console.error('Error al verificar el token:', err.message);
                return res.status(403).json({ message: 'Token inválido o expirado' });
            }

            // Extraer el userId del token decodificado
            const userId = decodedToken.userId;

            // Verificar si el usuario existe en la base de datos
            const user = await UserService.getUserById(userId);
            if (!user) {
                return res.status(403).json({ message: 'Usuario no encontrado o inactivo' });
            }

            // Adjuntar la información del usuario a la solicitud
            req.user = {
                id: user.friendly_code, // ID desde la base de datos
                username: `${user.first_name} ${user.last_name}`, // Combina nombres
                role: {
                    id: decodedToken.role.id,
                    name: decodedToken.role.name, // Rol desde el token
                },
            };

            next(); // Continúa con la siguiente función de middleware
        });
    } catch (error) {
        console.error('Error en el middleware de autenticación:', error.message);
        res.status(500).json({ message: 'Error interno en el servidor' });
    }
};

export default authenticateToken;

