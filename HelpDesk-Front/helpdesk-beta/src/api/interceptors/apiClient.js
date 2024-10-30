import axios from 'axios';
import { getToken, setToken, removeToken, getRefreshToken } from '../auth/tokenService';
import { logoutUser } from '../auth/authService';
import handleError from '../common/handleError';
import { createBrowserHistory } from 'history'; // Importar history para redirección

// Crear instancia de history
const history = createBrowserHistory();

// Configura Axios
const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
});

// Interceptor de solicitudes para incluir el token
apiClient.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        config.headers['Content-Type'] = 'application/json';
        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor de respuestas para manejar el refresh token y errores
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Manejo del token expirado (401 Unauthorized)
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = getRefreshToken();
                if (!refreshToken) {
                    throw new Error('No hay refresh token disponible.');
                }

                // Solicitar un nuevo token con el refreshToken
                const response = await apiClient.post('/auth/refresh-token', { refresh_token: refreshToken });
                const { accessToken } = response.data;

                setToken(accessToken); // Guardar el nuevo accessToken en sessionStorage

                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

                // Reintentar la solicitud original con el nuevo token
                return apiClient(originalRequest);
            } catch (err) {
                removeToken(); // Elimina el token si no se puede refrescar
                logoutUser(); // Ejecuta el logout
                history.push('/'); // Redirige al login usando history
            }
        }

        // Manejo de otros errores a través de handleError
        const handledError = handleError(error);
        return Promise.reject(handledError); // Rechaza el error para que sea manejado por el llamado original
    }

    
);

export default apiClient;
