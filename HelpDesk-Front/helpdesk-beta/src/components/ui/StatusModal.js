import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { updateTicketByFriendlyCode } from '../../api/tickets/ticketService';

const StatusButtonModal = ({ friendlyCode, currentStatus, onStatusChange, isUser = null, isAdmin = null}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setSelectedStatus(currentStatus);
  }, [currentStatus]);

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const getStatusColor = (status) => {
    const colors = {
      'Abierto': 'bg-green-100 text-green-700 border border-green-200',
      'Cerrado': 'bg-gray-100 text-gray-700 border border-gray-200',
      'En Progreso': 'bg-blue-100 text-blue-700 border border-blue-200',
      'Pendiente': 'bg-yellow-100 text-yellow-700 border border-yellow-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border border-gray-200';
  };

  const statuses = [
    { id: 1, name: 'Pendiente' },
    { id: 2, name: 'Abierto' },
    { id: 3, name: 'En Progreso' },
    { id: 4, name: 'Cerrado' }
  ];

  const handleSubmit = async () => {
    if (selectedStatus !== currentStatus) {
      setIsLoading(true);
      setError(null); // Reinicia el mensaje de error

      try {
        // Actualizar en el backend
        await updateTicketByFriendlyCode(friendlyCode, { status_name: selectedStatus });
        onStatusChange(selectedStatus); // Notifica el cambio exitoso al componente padre
      } catch (error) {
        setError('No se pudo actualizar el estado. Intente nuevamente.');
        console.error('Error al actualizar el estado del ticket:', error);
      } finally {
        setIsLoading(false);
        setIsModalOpen(false);
      }
    } else {
      setIsModalOpen(false);
    }
  };

  return (
    <>
      {/* Status Button */}
      <button
        onClick={() => {
          if (!isUser) {
            setIsModalOpen(true);
          }
        }}
        className="group transition-all duration-200 hover:ring-2 hover:ring-gray-200 rounded-lg"
        aria-label="Cambiar estado"
      >
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${getStatusColor(currentStatus)}`}>
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm font-medium">{currentStatus}</span>
        </div>
      </button>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="min-h-screen px-4 flex items-center justify-center">
            {/* Modal Container */}
            <div
              className="w-full max-w-lg bg-white rounded-2xl shadow-xl transform transition-all mx-auto"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">Cambiar Estado</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Cerrar"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="px-6 py-4 max-h-[60vh] overflow-y-auto">
                <div className="space-y-3">
                  {statuses.map((status) => (
                    <label
                      key={status.id}
                      className={`flex items-center p-4 cursor-pointer rounded-xl transition-all
                        ${selectedStatus === status.name
                          ? 'bg-blue-50 ring-2 ring-blue-600 ring-opacity-50'
                          : 'hover:bg-gray-50'
                        }`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value={status.name}
                        checked={selectedStatus === status.name}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <div className="ml-4">
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${getStatusColor(status.name)}`}>
                          <AlertCircle className="h-4 w-4 flex-shrink-0" />
                          <span className="text-sm font-medium">{status.name}</span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/80">
                {error && <div className="text-red-500 mb-2">{error}</div>}
                <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="w-full sm:w-auto px-6 py-2.5 text-gray-700 font-medium bg-white border border-gray-300 
                      rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 
                      transition-all text-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!selectedStatus || selectedStatus === currentStatus || isLoading}
                    className="w-full sm:w-auto px-6 py-2.5 text-white font-medium bg-blue-600 
                      rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed 
                      focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                      transition-all text-sm"
                  >
                    {isLoading ? 'Actualizando...' : 'Confirmar'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default StatusButtonModal;
