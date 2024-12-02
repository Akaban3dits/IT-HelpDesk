import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Ticket, User2, Monitor, Building2, LogOut, Menu, X, ClipboardList, History } from 'lucide-react';
import { AuthContext } from '../context/AuthContext'; // Importar AuthContext

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    const { userName, userRole, logout } = useContext(AuthContext); // Obtener el nombre y rol del usuario

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Menú completo
    const menuItems = [
        { icon: Home, label: 'Dashboard', path: '/admin/dashboard', roles: ['Observador', 'Administrador', 'Superadministrador'] },
        { icon: ClipboardList, label: 'Mis Encargos', path: '/admin/my-tasks', roles: ['Observador', 'Administrador', 'Superadministrador'] },
        { icon: History, label: 'Mi Historial', path: '/admin/my-history', roles: ['Observador', 'Administrador', 'Superadministrador'] },
        { icon: Ticket, label: 'Todos los tickets', path: '/admin/tickets', roles: ['Observador', 'Administrador', 'Superadministrador'] },
        { icon: User2, label: 'Usuarios', path: '/admin/users', roles: ['Administrador', 'Superadministrador'] },
        { icon: Building2, label: 'Departamento', path: '/admin/departments', roles: ['Administrador', 'Superadministrador'] },
        { icon: Monitor, label: 'Devices', path: '/admin/devices', roles: ['Administrador', 'Superadministrador'] }
    ];
    


    // Filtrar opciones según el rol del usuario
    const filteredMenuItems = menuItems.filter(item => item.roles.includes(userRole));

    return (
        <>
            {isMobile && !isOpen && (
                <button
                    onClick={toggleSidebar}
                    className="fixed top-4 left-4 z-50 p-2 bg-indigo-700 text-white rounded-md"
                >
                    <Menu className="w-6 h-6" />
                </button>
            )}

            <div className={`
                fixed inset-y-0 left-0 z-40
                flex flex-col bg-indigo-700 text-white 
                transition-all duration-300 ease-in-out
                ${isMobile ? (isOpen ? 'translate-x-0' : '-translate-x-full') : ''}
                ${isMobile ? 'w-64' : (isOpen ? 'w-64 absolute' : 'w-16 absolute')}
            `}>
                <div className="flex items-center justify-between px-4 h-16">
                    {(isOpen || isMobile) && <span className="text-lg font-semibold whitespace-nowrap">Soporte Técnico</span>}
                    {isMobile && (
                        <button onClick={toggleSidebar} className="text-white focus:outline-none">
                            <X className="w-6 h-6" />
                        </button>
                    )}
                    {!isMobile && (
                        <button onClick={toggleSidebar} className="text-white focus:outline-none">
                            <Menu className="w-6 h-6" />
                        </button>
                    )}
                </div>

                <nav className="flex-grow overflow-y-auto">
                    <ul className="py-4">
                        {filteredMenuItems.map((item, index) => (
                            <li key={index}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center ${isOpen || isMobile ? 'px-4' : 'justify-center'} py-3 ${location.pathname === item.path ? 'bg-indigo-800' : 'hover:bg-indigo-600'}`}
                                    onClick={isMobile ? toggleSidebar : undefined}
                                >
                                    <item.icon className="w-6 h-6 flex-shrink-0" />
                                    {(isOpen || isMobile) && <span className="ml-4 whitespace-nowrap">{item.label}</span>}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="p-4">
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center flex-shrink-0">
                            <User2 className="w-6 h-6 text-gray-600" />
                        </div>
                        {(isOpen || isMobile) && (
                            <div className="ml-3">
                                <p className="font-semibold whitespace-nowrap">{userName}</p>
                                <p className="text-sm text-indigo-200 whitespace-nowrap">{userRole}</p>
                            </div>
                        )}
                    </div>
                    <button onClick={logout} className={`flex items-center ${isOpen || isMobile ? 'justify-start w-full' : 'justify-center'} p-2 rounded hover:bg-indigo-600 mt-4`}>
                        <LogOut className="w-6 h-6" />
                        {(isOpen || isMobile) && <span className="ml-3 whitespace-nowrap">Cerrar sesión</span>}
                    </button>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
