import apiClient from '../interceptors/apiClient'; // Ajusta la ruta según tu estructura

export const fetchPriorities = async () => {
    try {
        const response = await apiClient.get('/priority');
        console.log(response.data)
        return response.data;
    } catch (error) {
        throw error;
    }
};
