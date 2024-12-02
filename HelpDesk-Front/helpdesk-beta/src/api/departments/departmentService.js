import apiClient from '../interceptors/apiClient';

// Buscar departamentos con búsqueda y paginación
export const searchDepartments = async ({ page = 1, limit = 10, search = '' }) => {
    try {
        console.log('Iniciando búsqueda de departamentos:', { page, limit, search }); // Log de parámetros enviados
        const response = await apiClient.get('departments/with-counts', {
            params: { page, limit, search }
        });
        console.log('Respuesta obtenida de departamentos:', response.data); // Log de respuesta
        return response.data; // Devuelve los datos de los departamentos
    } catch (error) {
        console.error('Error al buscar los departamentos:', error.message);
        const errorMessage = error.response?.data?.error || 'Error al buscar los departamentos';
        console.error('Detalles del error:', error.response?.data);
        throw new Error(errorMessage);
    }
};


// Crear un nuevo departamento
export const createDepartment = async (departmentData) => {
    try {
        const response = await apiClient.post('/departments', departmentData);
        return response.data; // Devuelve el departamento creado
    } catch (error) {
        console.error('Error al crear el departamento:', error.message);
        throw new Error(error.response?.data?.error || 'Error al crear el departamento');
    }
};

// Actualizar un departamento
export const updateDepartment = async (id, departmentData) => {
    try {
        const response = await apiClient.put(`/departments/${id}`, departmentData);
        return response.data; // Devuelve el departamento actualizado
    } catch (error) {
        console.error('Error al actualizar el departamento:', error.message);
        throw new Error(error.response?.data?.error || 'Error al actualizar el departamento');
    }
};

// Eliminar un departamento
export const deleteDepartment = async (id) => {
    try {
        await apiClient.delete(`/departments/${id}`);
    } catch (error) {
        console.error('Error al eliminar el departamento:', error.message);
        throw new Error(error.response?.data?.error || 'Error al eliminar el departamento');
    }
};

// Obtener departamentos (sin paginación)
export const fetchDepartments = async (search = '') => {
    try {
        const response = await apiClient.get('/departments/search', {
            params: { search }
        });
        return response.data; // Devuelve los resultados de la búsqueda
    } catch (error) {
        console.error('Error al obtener departamentos:', error.message);
        throw new Error(error.response?.data?.error || 'Error al obtener departamentos');
    }
};
