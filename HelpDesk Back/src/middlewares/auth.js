import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) return res.sendStatus(403);

        // Extraer el userId y otras propiedades necesarias del token decodificado
        req.user = {
            id: decodedToken.userId, // Aquí se extrae el userId del token
            username: decodedToken.username,
            role: decodedToken.role,
        };

        next(); // Continúa con la siguiente función en la cadena de middlewares
    });
};

export default authenticateToken;
