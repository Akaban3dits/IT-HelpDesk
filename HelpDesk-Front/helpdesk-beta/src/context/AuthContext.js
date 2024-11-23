import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { readToken, loginUser, logoutUser, isAuthenticated } from '../api/auth/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [userName, setUserName] = useState(null);
    const [isInitializing, setIsInitializing] = useState(true); // Solo para la carga inicial
    const [isLoggingIn, setIsLoggingIn] = useState(false); // Estado específico para el proceso de login
    const [authError, setAuthError] = useState(null);
    const navigate = useNavigate();

    const updateUserInfo = useCallback((token) => {
        setAuthToken(token);
        setUserRole(token?.role?.name || null);
        setUserName(token?.username || null);
    }, []);

    // Inicialización solo se ejecuta una vez al montar el componente
    useEffect(() => {
        const initAuth = async () => {
            try {
                const token = await readToken();
                if (token) {
                    updateUserInfo(token);
                }
            } catch (error) {
                console.error('Error during initialization:', error);
            } finally {
                setIsInitializing(false);
            }
        };

        initAuth();
    }, [updateUserInfo]);

    const login = async (email, password) => {
        setIsLoggingIn(true);
        setAuthError(null);

        try {
            const userData = await loginUser(email, password);

            if (!userData || !userData.accessToken) {
                throw new Error('Datos de usuario incompletos');
            }

            const token = await readToken();
            if (!token) {
                throw new Error('No se pudo leer el token después del login');
            }
            const roleName = token?.role?.name;
            updateUserInfo(token);

            if (['Superadministrador', 'Administrador', 'Observador'].includes(roleName)) {
                navigate('/admin/dashboard', { replace: true });
            } else if (roleName === 'Usuario') {
                navigate('/home', { replace: true });
            }
        } catch (error) {
            setAuthError('Credenciales incorrectas o problemas con el servidor');
            throw error;
        } finally {
            setIsLoggingIn(false);
        }
    };

    const logout = useCallback(() => {
        logoutUser();
        setAuthToken(null);
        setUserRole(null);
        setUserName(null);
        navigate('/', { replace: true });
    }, [navigate]);

    const checkAuthStatus = useCallback(() => {
        const token = readToken();
        if (!token) {
            logout();
            return false;
        }
        updateUserInfo(token);
        return true;
    }, [logout, updateUserInfo]);

    const value = {
        authToken,
        userRole,
        userName,
        login,
        logout,
        isAuthenticated: () => isAuthenticated(),
        checkAuthStatus,
        isLoggingIn,        // Expone el estado de login para componentes específicos
        authError,
    };

    // Solo muestra el loading inicial, no en cada operación
    if (isInitializing) {
        return <div></div>;
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;