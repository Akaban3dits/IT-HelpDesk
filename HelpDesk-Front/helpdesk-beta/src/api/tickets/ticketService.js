import apiClient from '../interceptors/apiClient'; // Ajusta la ruta según tu estructura

// Función para obtener todos los tickets
export const fetchTickets = async () => {
    try {
        const response = await apiClient.get('/tickets');
        return response.data;
    } catch (error) {
        console.error('Error al obtener los tickets:', error);
        throw error;
    }
};

// Función para crear un nuevo ticket
export const createTicket = async (ticketData) => {
    try {
        const response = await apiClient.post('/tickets', ticketData);
        return response.data;
    } catch (error) {
        console.error('Error al crear el ticket:', error);
        throw error;
    }
};
