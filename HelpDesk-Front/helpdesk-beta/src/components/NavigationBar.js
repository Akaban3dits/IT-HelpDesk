import React, { useState, useEffect, useContext } from 'react';
import { 
    Bell, 
    LogOut, 
    TicketPlus, 
    UserPlus, 
    RefreshCw, 
    X, 
    Check,
    User
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchUserNotifications, updateNotification } from '../api/notification/notificationService';
import Logo from '../assets/logo.png';
import { AuthContext } from '../context/AuthContext';

const NavigationBar = ({ showLogo = false }) => {
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const { userName, logout } = useContext(AuthContext);

    const loadNotifications = async () => {
        try {
            setLoading(true);
            const response = await fetchUserNotifications();
            setNotifications(
                response.map((notif) => ({
                    id: notif.notification_id,
                    ticket_id: notif.ticket_id,
                    message: notif.message,
                    type: notif.type,
                    time: notif.created_at,
                    read: notif.read_at !== null,
                    hidden: notif.hidden || false,
                }))
            );
        } catch (error) {
            console.error('Error al cargar notificaciones:', error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadNotifications();

        const interval = setInterval(() => {
            loadNotifications();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    const markAsRead = async (id) => {
        try {
            await updateNotification(id, { read_at: new Date().toISOString() });
            setNotifications((prevNotifications) =>
                prevNotifications.map((notif) =>
                    notif.id === id ? { ...notif, read: true } : notif
                )
            );
        } catch (error) {
            console.error('Error al marcar como leída la notificación:', error.message);
        }
    };

    const hideNotification = async (id) => {
        try {
            await updateNotification(id, { hidden: true });
            setNotifications((prevNotifications) =>
                prevNotifications.map((notif) =>
                    notif.id === id ? { ...notif, hidden: true } : notif
                )
            );
        } catch (error) {
            console.error('Error al ocultar la notificación:', error.message);
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'Nuevo Ticket':
                return <TicketPlus size={16} className="text-blue-500" />;
            case 'Asignación':
                return <UserPlus size={16} className="text-green-500" />;
            case 'Actualización':
                return <RefreshCw size={16} className="text-yellow-500" />;
            default:
                return <Bell size={16} className="text-gray-500" />;
        }
    };

    const getTicketLink = (ticketId) => {
        return showLogo 
            ? `/ticket/${ticketId}`
            : `/admin/view/${ticketId}`;
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="p-4 flex justify-between items-center">
                <div className="w-full">
                    {showLogo && (
                        <Link to="/home" className="inline-block">
                            <img src={Logo} alt="Logo" className="h-8 w-auto" />
                        </Link>
                    )}
                </div>

                <div className="flex items-center space-x-6">
                    <div className="relative">
                        <button
                            onClick={toggleNotifications}
                            className="relative text-gray-600 hover:text-gray-800 focus:outline-none"
                        >
                            <Bell size={24} />
                            {notifications.filter((notif) => !notif.read && !notif.hidden).length > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {notifications.filter((notif) => !notif.read && !notif.hidden).length}
                                </span>
                            )}
                        </button>

                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl overflow-hidden z-20 border border-gray-200">
                                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                                    <h3 className="text-lg font-semibold text-gray-700">Notificaciones</h3>
                                    <button
                                        onClick={() => setNotifications([])}
                                        className="text-sm text-blue-500 hover:underline"
                                    >
                                        Limpiar todo
                                    </button>
                                </div>
                                <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                                    {loading ? (
                                        <p className="text-sm text-gray-500 px-4 py-3">Cargando notificaciones...</p>
                                    ) : notifications.filter((notif) => !notif.hidden).length > 0 ? (
                                        notifications
                                            .filter((notif) => !notif.hidden)
                                            .map((notif) => (
                                                <div
                                                    key={notif.id}
                                                    className={`px-4 py-3 hover:bg-gray-50 transition duration-150 ease-in-out ${
                                                        notif.read ? 'opacity-50' : ''
                                                    }`}
                                                >
                                                    <div className="flex items-start">
                                                        <div className="flex-shrink-0 mt-1">
                                                            {getNotificationIcon(notif.type)}
                                                        </div>
                                                        <div className="ml-3 w-0 flex-1">
                                                            <Link 
                                                                to={getTicketLink(notif.ticket_id)}
                                                                className="text-sm font-medium text-gray-900 hover:text-blue-600"
                                                            >
                                                                {notif.message}
                                                            </Link>
                                                            <p className="mt-1 text-xs text-gray-500">
                                                                {new Date(notif.time).toLocaleString()}
                                                            </p>
                                                        </div>
                                                        <div className="ml-4 flex-shrink-0 flex space-x-2">
                                                            {!notif.read && (
                                                                <button
                                                                    onClick={() => markAsRead(notif.id)}
                                                                    className="inline-flex text-gray-400 hover:text-green-500 focus:outline-none"
                                                                >
                                                                    <Check size={16} />
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => hideNotification(notif.id)}
                                                                className="inline-flex text-gray-400 hover:text-red-500 focus:outline-none"
                                                            >
                                                                <X size={16} />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                    ) : (
                                        <p className="text-sm text-gray-500 px-4 py-3">No hay notificaciones</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {showLogo && (
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-3">
                                <div className="bg-gray-100 p-2 rounded-full">
                                    <User size={20} className="text-gray-600" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-gray-700">{userName}</span>
                                </div>
                            </div>
                            
                            <button
                                onClick={logout}
                                className="p-2 rounded-full text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors duration-150"
                                title="Cerrar sesión"
                            >
                                <LogOut size={20} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavigationBar;
