import apiClient from '../interceptors/apiClient';

// Buscar tipos de dispositivos (búsqueda rápida)
export const searchDeviceTypes = async (searchTerm = '') => {
    try {
        console.log('searchDeviceTypes called with:', { searchTerm }); // Log de parámetros
        const response = await apiClient.get('/device-types/search', {
            params: { search: searchTerm }
        });
        console.log('Response Data:', response.data); // Log de respuesta
        return response.data;
    } catch (error) {
        console.error('Error al buscar tipos de dispositivos:', error.message);
        throw error;
    }
};

// Obtener lista de tipos de dispositivos (paginada y con filtros)
export const getDeviceTypes = async (page = 1, limit = 10, searchTerm = '') => {
    try {

        // Realizar la solicitud GET al endpoint
        const response = await apiClient.get(`/device-types`, {
            params: { page, limit, search: searchTerm }
        });

        // Validar la respuesta
        if (!response.data) {
            console.error('Error: No data in response'); // Error si la respuesta no contiene datos
            throw new Error('Error al obtener la lista de tipos de dispositivos');
        }
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Crear un nuevo tipo de dispositivo
export const createDeviceType = async (typeName, typeCode) => {
    try {
        console.log('createDeviceType called'); // Verifica que la función fue invocada
        console.log('Payload:', { typeName, typeCode }); // Muestra los datos enviados

        const response = await apiClient.post(`/device-types`, { typeName, typeCode });

        console.log('Response Data:', response.data); // Muestra la respuesta del servidor
        return response.data;
    } catch (error) {
        console.error('Error al crear el tipo de dispositivo:', error.message); // Muestra el error
        throw error;
    }
};

// Actualizar un tipo de dispositivo existente
export const updateDeviceType = async (id, typeData) => {
    try {
        const response = await apiClient.put(`/device-types/${id}`, typeData);
        if (!response.data) {
            throw new Error('Error al actualizar el tipo de dispositivo');
        }
        return response.data;
    } catch (error) {
        console.error('Error al actualizar el tipo de dispositivo:', error.message);
        throw error;
    }
};

// Eliminar un tipo de dispositivo
export const deleteDeviceType = async (id) => {
    try {
        const response = await apiClient.delete(`/device-types/${id}`);
        if (response.status !== 204) {
            throw new Error('Error al eliminar el tipo de dispositivo');
        }
        return true;
    } catch (error) {
        console.error('Error al eliminar el tipo de dispositivo:', error.message);
        throw error;
    }
};
