import apiClient from '../interceptors/apiClient';
import apiClientMultipart from './../interceptors/apiClientMultipart';

export const createTicket = async (ticketData) => {
    try {
        const response = await apiClientMultipart.post('/tickets', ticketData);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || 'Error al crear el ticket';
        throw new Error(errorMessage);
    }
};

export const fetchRecentTickets = async (
    page = 1, 
    limit = 10, 
    search = '', 
    filters = {}
) => {
    try {
        // Procesar los filtros para asegurarnos de que no haya valores vacíos
        const parsedFilters = Object.keys(filters).reduce((acc, key) => {
            if (filters[key] !== undefined) acc[key] = filters[key]; // Incluye `false` y `null`
            return acc;
        }, {});

        const response = await apiClient.get('/tickets', {
            params: {
                page,
                limit,
                search: search || '',
                sortBy: 'created_at',   // Establecido directamente en la petición
                sortDirection: 'desc',  // Establecido directamente en la petición
                ...parsedFilters
            }
        });

        return response.data;
    } catch (error) {
        throw error;
    }
};


export const getTicketByFriendlyCode = async (friendlyCode) => {
    try {
        const response = await apiClient.get(`/tickets/${friendlyCode}`);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || 'Error al obtener el ticket';
        throw new Error(errorMessage);
    }
};


export const getMonthlyTicketCounts = async () => {
    try {
        const response = await apiClient.get('/tickets-monthly');
        return response.data;
    } catch (error) {
        throw new Error('Error al obtener los conteos mensuales de tickets');
    }
};


export const getDailyTicketStatusCounts = async () => {
    try {
        const response = await apiClient.get('/tickets-daily-status');
        return response.data;
    } catch (error) {
        console.error("Error en la obtención de conteos diarios de tickets por estado:", error);
        throw new Error('Error al obtener los conteos diarios de tickets por estado');
    }
};


export const updateTicketByFriendlyCode = async (friendlyCode, updateData) => {
    try {
        const response = await apiClient.put(`/tickets/${friendlyCode}`, updateData);
        return response.data;
    } catch (error) {
        // Manejo de errores más específico
        const errorMessage = error.response?.data?.error || 'Error al actualizar el ticket. Intente nuevamente más tarde.';
        console.error("Error al actualizar el ticket:", errorMessage);
        
        // Lanza un nuevo error con un mensaje específico
        throw new Error(errorMessage);
    }
};
