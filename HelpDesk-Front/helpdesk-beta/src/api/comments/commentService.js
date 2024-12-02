import apiClient from '../interceptors/apiClient'; 

export const createComment = async (friendlyCode, commentData) => {
    try {
        const response = await apiClient.post(`/tickets/${friendlyCode}/comments`, commentData);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || 'Error al crear el comentario';
        throw new Error(errorMessage);
    }
};

export const fetchComments = async (friendlyCode) => {
    try {
        const response = await apiClient.get(`/tickets/${friendlyCode}/comments`);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || 'Error al obtener los comentarios';
        console.error('Error al obtener los comentarios:', errorMessage);
        throw new Error(errorMessage);
    }
};

export const deleteComment = async (commentId) => {
    try {
        const response = await apiClient.delete(`/comments/${commentId}`);
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error || 'Error al eliminar el comentario';
        console.error('Error al eliminar el comentario:', errorMessage);
        throw new Error(errorMessage);
    }
};
