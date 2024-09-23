import React, { useState } from 'react';
import { Bell, LogOut, Info, MessageCircle, Calendar, X } from 'lucide-react';
import Breadcrumb from './Breadcrumb'; // Importar el Breadcrumb

const NavigationBar = () => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, type: 'info', message: 'Nueva actualización disponible', time: '2m ago' },
        { id: 2, type: 'message', message: 'Tienes un nuevo mensaje', time: '1h ago' },
        { id: 3, type: 'event', message: 'Recordatorio: Evento en 1 hora', time: '30m ago' }
    ]);

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    const clearNotification = (id) => {
        setNotifications(notifications.filter(notif => notif.id !== id));
    };

    const handleLogout = () => {
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'info':
                return <Info size={16} className="text-blue-500" />;
            case 'message':
                return <MessageCircle size={16} className="text-green-500" />;
            case 'event':
                return <Calendar size={16} className="text-yellow-500" />;
            default:
                return <Bell size={16} className="text-gray-500" />;
        }
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="p-4 flex justify-between items-center">
                <div className="w-full">
                </div>

                <div className="relative">
                    <button
                        onClick={toggleNotifications}
                        className="relative text-gray-600 hover:text-gray-800 focus:outline-none"
                    >
                        <Bell size={24} />
                        {notifications.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {notifications.length}
                            </span>
                        )}
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl overflow-hidden z-20 border border-gray-200">
                            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-700">Notificaciones</h3>
                            </div>
                            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                                {notifications.length > 0 ? (
                                    notifications.map((notif) => (
                                        <div key={notif.id} className="px-4 py-3 hover:bg-gray-50 transition duration-150 ease-in-out">
                                            <div className="flex items-start">
                                                <div className="flex-shrink-0 mt-1">
                                                    {getNotificationIcon(notif.type)}
                                                </div>
                                                <div className="ml-3 w-0 flex-1">
                                                    <p className="text-sm font-medium text-gray-900">{notif.message}</p>
                                                    <p className="mt-1 text-xs text-gray-500">{notif.time}</p>
                                                </div>
                                                <div className="ml-4 flex-shrink-0 flex">
                                                    <button
                                                        onClick={() => clearNotification(notif.id)}
                                                        className="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
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
            </div>
        </nav>
    );
};

export default NavigationBar;
