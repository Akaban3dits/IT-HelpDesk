import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { readToken, loginUser, logoutUser, isAuthenticated } from '../api/auth/authService'; // Ajustar la ruta de authService

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(null); // Estado para el token
    const [userRole, setUserRole] = useState(null); // Estado para el rol del usuario
    const [userName, setUserName] = useState(null); // Estado para el nombre del usuario
    const [loading, setLoading] = useState(true); // Estado de carga
    const [authError, setAuthError] = useState(null); // Estado para el error de autenticación
    const navigate = useNavigate();

    // Función para actualizar la información del usuario
    const updateUserInfo = useCallback((token) => {
        setAuthToken(token);
        setUserRole(token?.role?.name || null); // Verifica si token y token.role existen
        setUserName(token?.username || null); // Verifica si token.username existe
    }, []);

    // Inicializar autenticación cuando el componente se monta
    useEffect(() => {
        const initAuth = async () => {
            const token = await readToken();
            if (token) {
                updateUserInfo(token);
            }
            setLoading(false); // Finaliza el estado de carga cuando se inicializa la autenticación
        };

        initAuth();
    }, [updateUserInfo]);

    // Función de login con manejo de errores y actualización del estado de autenticación
    const login = async (email, password) => {
        setLoading(true);
        setAuthError(null); // Reiniciar cualquier error previo
        try {
            const userData = await loginUser(email, password);

            if (!userData || !userData.accessToken) {
                throw new Error('Datos de usuario incompletos');
            }

            const token = await readToken(); // Espera a que se lea el token
            if (!token) {
                throw new Error('No se pudo leer el token después del login');
            }

            updateUserInfo(token); // Actualiza la información del usuario después de obtener el token

            // Redireccionar basado en el rol del usuario
            const roleName = token?.role?.name; // Verifica si el rol existe
            if (['SuperAdministrador', 'Administrador', 'Observador'].includes(roleName)) {
                navigate('/admin/dashboard', { replace: true });
            } else if (roleName === 'Usuario') {
                navigate('/home', { replace: true });
            } else {
                throw new Error('Rol no reconocido');
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            setAuthError('Credenciales incorrectas o problemas con el servidor'); // Manejo del error
            throw error;
        } finally {
            setLoading(false); // Detener la carga al finalizar la operación de login
        }
    };

    // Función de logout que limpia el estado y redirige al login
    const logout = useCallback(() => {
        logoutUser();
        setAuthToken(null);
        setUserRole(null);
        setUserName(null);
        navigate('/', { replace: true });
    }, [navigate]);

    // Función para verificar el estado de autenticación
    const checkAuthStatus = useCallback(() => {
        const token = readToken();
        if (!token) {
            logout();
            return false;
        }
        updateUserInfo(token);
        return true;
    }, [logout, updateUserInfo]);

    // Valor que se expone a través del contexto
    const value = {
        authToken,
        userRole,
        userName,
        login,
        logout,
        isAuthenticated: () => isAuthenticated(),
        checkAuthStatus,
        loading,
        authError, // Añadido para manejar errores de autenticación en otros componentes
    };

    // Mostrar componente de carga si el estado es "loading"
    if (loading) {
        return <div>Cargando...</div>; // Puedes personalizar esto con un componente de carga más complejo si lo deseas
    }

    // Retorna el proveedor de contexto que expone el estado y las funciones a los componentes hijos
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
