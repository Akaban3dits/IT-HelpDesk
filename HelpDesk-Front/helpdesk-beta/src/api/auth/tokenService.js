// Recuperar el access token del sessionStorage
export const getToken = () => sessionStorage.getItem('authToken');

// Guardar el access token en sessionStorage
export const setToken = (token) => sessionStorage.setItem('authToken', token);

// Eliminar el access token del sessionStorage
export const removeToken = () => sessionStorage.removeItem('authToken');

// Recuperar el refresh token del sessionStorage
export const getRefreshToken = () => sessionStorage.getItem('refreshToken');

// Guardar el refresh token en sessionStorage
export const setRefreshToken = (token) => sessionStorage.setItem('refreshToken', token);

// Eliminar el refresh token del sessionStorage
export const removeRefreshToken = () => sessionStorage.removeItem('refreshToken');