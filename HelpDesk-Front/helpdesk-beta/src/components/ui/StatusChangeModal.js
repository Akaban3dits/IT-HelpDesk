import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { getStatusHistoryByFriendlyCode } from '../../api/statuses/status'; // Asegúrate de tener la función correcta

const StatusChangeModal = ({ onClose, friendlyCode }) => {
    const [statusChanges, setStatusChanges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStatusHistory = async () => {
            try {
                const history = await getStatusHistoryByFriendlyCode(friendlyCode); // Ajusta la función para usar friendlyCode
                setStatusChanges(history); // Almacena el historial de cambios en el estado
            } catch (err) {
                setError(err.message); // Maneja el error
            } finally {
                setLoading(false); // Cambia el estado de carga
            }
        };

        fetchStatusHistory(); // Llama a la función para obtener el historial
    }, [friendlyCode]); // Se ejecuta cuando el friendlyCode cambia

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 md:p-8 relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                    <X size={24} />
                </button>
                <h3 className="text-2xl font-semibold text-gray-700 mb-6">Cambios de Estado</h3>

                {/* Contenedor con scroll */}
                <div className="space-y-4 max-h-80 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                    {loading ? (
                        <p className="text-gray-600">Cargando cambios de estado...</p>
                    ) : error ? (
                        <p className="text-red-600">Error: {error}</p>
                    ) : statusChanges.length > 0 ? (
                        statusChanges.map((change, index) => (
                            <div key={index} className="flex justify-between items-center pb-2">
                                <div className="flex-1 pr-4">
                                    {/* El color solo cubre el texto */}
                                    <p className="font-semibold">
                                        <span className={`px-2 py-1 rounded ${getStatusColor(change.new_status || 'Desconocido')}`}>
                                            Estado: {change.new_status || 'Desconocido'}
                                        </span>
                                    </p>
                                    <p className="text-gray-600 text-sm mt-2">
                                        <strong>Por:</strong> {change.changed_by.first_name} {change.changed_by.last_name}
                                    </p>
                                </div>
                                {/* Margen para separar la fecha del contenido */}
                                <div className="whitespace-nowrap pl-4 border-l">
                                    <p className="text-sm text-gray-500">{new Date(change.changed_at).toLocaleString()}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-600">No hay cambios de estado disponibles.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const getStatusColor = (status) => {
    switch (status) {
        case 'Pendiente':
            return 'bg-gray-500 text-white';
        case 'Abierto':
            return 'bg-green-500 text-white';
        case 'En Progreso':
            return 'bg-yellow-500 text-white';
        case 'Cerrado':
            return 'bg-red-500 text-white';
        default:
            return 'bg-gray-500 text-white';
    }
};

export default StatusChangeModal;
