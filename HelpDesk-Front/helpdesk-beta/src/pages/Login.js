import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

// Alert Component
const Alert = ({ children, variant = "default" }) => {
    const baseStyles = "p-4 rounded-lg mb-4 flex items-center gap-2";
    const variants = {
        destructive: "bg-red-100 text-red-800 border border-red-200",
        warning: "bg-yellow-100 text-yellow-800 border border-yellow-200",
        default: "bg-gray-100 text-gray-800 border border-gray-200"
    };

    return (
        <div className={`${baseStyles} ${variants[variant]}`}>
            {children}
        </div>
    );
};

// AlertCircle Icon Component
const AlertCircle = () => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
    >
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
);

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const { login, userRole } = useContext(AuthContext);

    useEffect(() => {
        if (userRole) {
            redirectToDashboard(userRole);
        }
    }, [userRole]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Limpiar error anterior
        try {
            await login(email, password);
        } catch (error) {
            // Como loginUser lanza directamente el mensaje como string,
            // simplemente usamos el error directamente
            console.log('Error recibido:', error); // Para debugging
            
            // Si el error es una cadena, úsalo directamente
            if (typeof error === 'string') {
                setErrorMessage(error);
            } 
            // Si no es una cadena, busca el mensaje en diferentes lugares
            else {
                setErrorMessage(
                    error.response?.data?.message || 
                    error.message || 
                    'Error al iniciar sesión'
                );
            }
        }
    };

    const redirectToDashboard = (role) => {
        if (['Superadministrador', 'Administrador', 'Observador'].includes(role)) {
            navigate('/admin/dashboard', { replace: true });
        } else if (role === 'Usuario') {
            navigate('/home', { replace: true });
        }
    };

    const handleRegister = () => {
        navigate('/register');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-center text-gray-900">
                        Iniciar Sesión
                    </h2>
                </div>

                <div className="p-6">
                    {errorMessage && (
                        <Alert variant="destructive">
                            <AlertCircle />
                            <span className="text-sm">{errorMessage}</span>
                        </Alert>
                    )}
                    
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="ejemplo@correo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm transition duration-200"
                        >
                            Iniciar Sesión
                        </button>
                    </form>
                </div>

                <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="text-sm text-gray-600">
                            ¿No tienes cuenta?
                        </div>
                        <button
                            onClick={handleRegister}
                            className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-md transition duration-200"
                        >
                            Registrarse
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;