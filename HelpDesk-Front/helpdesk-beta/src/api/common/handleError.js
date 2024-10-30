const handleError = (error) => {
    if (error.response) {
        return error.response.data;
    } else if (error.request) {
        return { message: 'Error en la red, por favor revisa tu conexión.' };
    } else {
        return { message: 'Ocurrió un error inesperado.' };
    }
};

export default handleError;
