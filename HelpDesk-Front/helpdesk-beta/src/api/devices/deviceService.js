
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

// Obtener lista de dispositivos (con búsqueda y paginación)
export const fetchDevicesList = async (page = 1, limit = 10, search = '') => {
    try {
        console.log('fetchDevicesList called with:', { page, limit, search }); // Log de parámetros

        // Realizar la solicitud GET con los parámetros adecuados
        const response = await apiClient.get('/devices/list', {
            params: { page, limit, search: search.trim() || '' }, // Asegura que `search` no sea undefined o null
        });

        // Validar que la respuesta contiene datos
        if (!response.data || !response.data.devices) {
            throw new Error('No se obtuvieron datos de dispositivos.');
        }

        console.log('Response Data:', response.data); // Log de la respuesta
        return response.data;
    } catch (error) {
        // Log detallado en caso de error
        console.error('Error al obtener la lista de dispositivos:', error.message);
        console.error('Detalles del error:', error.response?.data || error); // Log adicional si hay detalles en la respuesta
        throw error;
    }
};


// Crear un nuevo dispositivo
export const createDevice = async (deviceName, deviceTypeId) => {
    try {
        console.log('createDevice called with:', { deviceName, deviceTypeId }); // Log de parámetros
        const response = await apiClient.post('/devices', {
            device_name: deviceName,
            device_type_id: deviceTypeId
        });
        console.log('Response Data:', response.data); // Log de respuesta
        return response.data;
    } catch (error) {
        console.error('Error al crear el dispositivo:', error.message);
        throw error;
    }
};

// Actualizar un dispositivo existente
export const updateDevice = async (id, deviceName, deviceTypeId) => {
    try {
        console.log('updateDevice called with:', { id, deviceName, deviceTypeId }); // Log de parámetros
        const response = await apiClient.put(`/devices/${id}`, {
            device_name: deviceName,
            device_type_id: deviceTypeId
        });
        console.log('Response Data:', response.data); // Log de respuesta
        return response.data;
    } catch (error) {
        console.error('Error al actualizar el dispositivo:', error.message);
        throw error;
    }
};

// Eliminar un dispositivo
export const deleteDevice = async (id) => {
    try {
        console.log('deleteDevice called with:', { id }); // Log de parámetros
        const response = await apiClient.delete(`/devices/${id}`);
        console.log('Response Status:', response.status); // Log de respuesta
        return response.status === 204;
    } catch (error) {
        console.error('Error al eliminar el dispositivo:', error.message);
        throw error;
    }
};
