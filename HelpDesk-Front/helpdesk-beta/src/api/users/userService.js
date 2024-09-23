import apiClient from '../interceptors/apiClient'; // Ajusta la ruta según tu estructura

// Función para obtener la lista de usuarios con filtros y paginación
export const fetchUsers = async (page = 1, limit = 10, search = '', sortBy = 'first_name', sortDirection = 'asc', filters = {}) => {
    try {
        // Convertir el filtro 'status' a booleano si es necesario
        const parsedFilters = {
            ...filters,
            status: filters.status === 'true' ? true : filters.status === 'false' ? false : undefined
        };

        // Realizar la solicitud con los filtros procesados
        const response = await apiClient.get('/users', {
            params: {
                page,
                limit,
                search: search || '',
                sortBy,
                sortDirection,
                ...parsedFilters // Aquí se pasan los filtros ya convertidos
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        throw error;
    }
};

// Función para crear un nuevo usuario mediante POST
export const createUser = async (userData) => {
    try {
        const response = await apiClient.post('/users', userData);
        return response.data;
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        throw error;
    }
};

// Función para borrar lógicamente un usuario (actualizando el status a false)
export const deleteUser = async (friendlyCode) => {
    try {
        const response = await apiClient.delete(`/users/${friendlyCode}`, {
            status: false // Cambia el estado a false (borrado lógico)
        });

        return response.data;
    } catch (error) {
        console.error("Error eliminando el usuario:", error);
        throw error;
    }
};

// Función para obtener un usuario por su código friendly
export const getUserByFriendlyCode = async (friendlyCode) => {
    try {
        const response = await apiClient.get(`/users/${friendlyCode}`);
        console.log('Respuesta del servidor:', response); // Log de la respuesta del servidor
        return response.data;
    } catch (error) {
        console.error("Error al obtener el usuario por código friendly:", error);
        throw error;
    }
};

// Función para actualizar un usuario mediante PUT
export const updateUser = async (friendlyCode, updatedUserData) => {
    try {
        const response = await apiClient.put(`/users/${friendlyCode}`, updatedUserData);
        console.log('Respuesta del servidor al actualizar el usuario:', response); // Log de la respuesta del servidor
        return response.data;
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        throw error;
    }
};

// Función para obtener nombres de usuarios para auto-completar o búsqueda
export const fetchUserNames = async (searchTerm = '') => {
    try {
        const response = await apiClient.get(`/users/names?search=${searchTerm}`);
        if (!response.data) {
            throw new Error('Error al obtener los nombres de usuarios');
        }
        return response.data;
    } catch (error) {
        console.error('Error al obtener nombres de usuarios:', error);
        return [];
    }
};
