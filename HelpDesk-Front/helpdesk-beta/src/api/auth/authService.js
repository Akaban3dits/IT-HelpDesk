import apiClient from '../interceptors/apiClient';
import { getToken, setToken, removeToken, removeRefreshToken, setRefreshToken, getRefreshToken } from './tokenService';
import { jwtDecode } from 'jwt-decode';

// Función para notificar que el token necesita ser refrescado
const notifyTokenRefresh = () => {
    // Aquí puedes implementar la lógica para mostrar una notificación al usuario
    console.log("El token está a punto de expirar. Se intentará refrescar automáticamente.");
    // Ejemplo: dispatchEvent(new CustomEvent('tokenRefreshNeeded'));
};

// Leer y decodificar el token del sessionStorage
export const readToken = async () => {
    const token = getToken();
    if (!token || !token.includes('.')) {
        removeToken();
        return null;
    }
    try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        const timeUntilExpiration = decodedToken.exp - currentTime;

        // Si el token expira en menos de 5 minutos, notificar y intentar renovar
        if (timeUntilExpiration < 300) {
            notifyTokenRefresh();
            return await renewTokenIfPossible();
        }
        return decodedToken;
    } catch (error) {
        console.error('Error al decodificar el token:', error);
        removeToken();
        return null;
    }
};

// Función auxiliar para renovar el token si es posible
const renewTokenIfPossible = async () => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
        try {
            const newAccessToken = await renewToken(refreshToken);
            setToken(newAccessToken);
            return jwtDecode(newAccessToken);
        } catch (error) {
            console.error('Error al renovar el token:', error);
            removeToken();
            removeRefreshToken();
            return null;
        }
    } else {
        removeToken();
        return null;
    }
};

// Iniciar sesión y obtener el accessToken
export const loginUser = async (email, password) => {
    try {
        const response = await apiClient.post('/auth/login', { email, password });
        console.log('Respuesta completa:', response);
        if (!response?.data?.accessToken) {
            throw new Error('La respuesta no contiene los tokens necesarios');
        }
        const { accessToken, refreshToken } = response.data;
        setToken(accessToken);
        if (refreshToken) {
            setRefreshToken(refreshToken);
        }
        return response.data;
    } catch (error) {
        console.error('Error en la autenticación:', error);
        throw error;
    }
};

// Cerrar sesión eliminando los tokens
export const logoutUser = () => {
    removeToken();
    removeRefreshToken();
};

// Verificar si el usuario está autenticado
export const isAuthenticated = async () => {
    const token = await readToken();
    return token !== null;
};

// Función para renovar el token usando el refreshToken
export const renewToken = async (refreshToken) => {
    try {
        const response = await apiClient.post('/auth/refresh-token', { refresh_token: refreshToken });
        const { accessToken } = response.data;
        setToken(accessToken);
        return accessToken;
    } catch (error) {
        console.error('Error al renovar el token:', error);
        throw error;
    }
};