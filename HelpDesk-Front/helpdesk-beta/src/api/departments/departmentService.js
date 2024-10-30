import apiClient from '../interceptors/apiClient'; // Ajusta la ruta según tu estructura

export const fetchDepartments = async (search = '') => {
    try {

        // Realizar la solicitud con el término de búsqueda
        const response = await apiClient.get('/departments/search', {
            params: {
                search: search || '' // Si no hay búsqueda, enviamos un string vacío
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
