import { Router } from 'express';
import AuthController from '../controllers/auth.controller.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API para la autenticación de usuarios
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Inicia sesión con un usuario registrado
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 description: Correo electrónico
 *               password:
 *                 type: string
 *                 description: Contraseña
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: Token de acceso JWT
 */
router.post('/login', AuthController.login);

export default router;
