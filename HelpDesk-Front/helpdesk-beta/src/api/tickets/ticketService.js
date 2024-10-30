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
