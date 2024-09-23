const handleError = (error) => {
    if (error.response) {
        console.error('API Error:', error.response.data.message || 'Error desconocido');
        return error.response.data;
    } else if (error.request) {
        console.error('Error en la solicitud:', error.request);
        return { message: 'Error en la red, por favor revisa tu conexión.' };
    } else {
        console.error('Error inesperado:', error.message);
        return { message: 'Ocurrió un error inesperado.' };
    }
};

export default handleError;
