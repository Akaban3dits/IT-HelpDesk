import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login, userRole } = useContext(AuthContext);

    useEffect(() => {
        if (userRole) {
            redirectToDashboard(userRole);
        }
    }, [userRole]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(email, password);
        } catch (err) {
            setError('Error al iniciar sesión. Verifica tus credenciales.');
        }
    };

    const redirectToDashboard = (role) => {
        if (['Superadministrador', 'Administrador', 'Observador'].includes(role)) {
            navigate('/admin/dashboard', { replace: true });
        } else if (role === 'Usuario') {
            navigate('/home', { replace: true });
        } else {
            setError('Rol no reconocido.');
        }
    };

    const handleRegister = () => {
        navigate('/register'); // Navegar a la ruta /register
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-gray-700">Iniciar Sesión</h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <form className="mt-6" onSubmit={handleLogin}>
                    <div>
                        <label className="block text-gray-700">Email</label>
                        <input
                            type="email"
                            className="w-full mt-2 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                            placeholder="example@domain.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mt-4">
                        <label className="block text-gray-700">Contraseña</label>
                        <input
                            type="password"
                            className="w-full mt-2 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button className="w-full mt-6 bg-blue-600 text-white py-2 rounded hover:bg-blue-500 transition duration-200">
                        Iniciar Sesión
                    </button>
                </form>

                {/* Botón para navegar al registro */}
                <div className="mt-4 text-center">
                    <p className="text-gray-600">¿No tienes cuenta?</p>
                    <button
                        onClick={handleRegister}
                        className="mt-2 bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 transition duration-200"
                    >
                        Registrarse
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
