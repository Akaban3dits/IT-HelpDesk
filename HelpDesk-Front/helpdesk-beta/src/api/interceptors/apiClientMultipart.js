// apiClientMultipart.js
import axios from 'axios';
import { getToken } from '../auth/tokenService';

// Configurar cliente API para multipart/form-data
const apiClientMultipart = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
});

// Interceptor de solicitudes para incluir el token
apiClientMultipart.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        // No establecer el 'Content-Type', Axios se encargará automáticamente
        return config;
    },
    (error) => Promise.reject(error)
);

export default apiClientMultipart;
