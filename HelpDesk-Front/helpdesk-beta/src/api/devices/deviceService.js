
import apiClient from '../interceptors/apiClient';

export const fetchDevices = async (searchTerm = '') => {
    try {
        // Realizar la solicitud GET al endpoint de dispositivos con el término de búsqueda
        const response = await apiClient.get(`/devices/search`, {
            params: { search: searchTerm || '' } // Pasa siempre un string, incluso si searchTerm está vacío
        });

        // Validar si la respuesta contiene datos
        if (!response.data) {
            throw new Error('Error al obtener los dispositivos');
        }

        return response.data;
    } catch (error) {
        // Log del error
        console.error('Error al obtener los dispositivos:', error.message);
        throw error; // Lanzar el error para manejarlo donde se llame a la función
    }
};
