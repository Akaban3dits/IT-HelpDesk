import apiClient from '../interceptors/apiClient'; // Ajusta la ruta según tu estructura

export const fetchRoles = async () => {
    try {
        const response = await apiClient.get('/roles');
        return response.data;
    } catch (error) {
        console.error("Error fetching roles:", error);
        throw error;
    }
};
