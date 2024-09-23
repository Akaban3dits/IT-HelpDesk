import React, { useState, useEffect } from 'react';
import { Calendar, Printer, Tag, FileText, MessageSquare, CheckSquare, UserCheck, AlertCircle, Clock, ChevronDown, ChevronUp, History } from 'lucide-react';
import ImageGallery from '../components/ui/ImageGallery';
import Comment from '../components/ui/Comment';
import TaskModal from '../components/ui/TaskModal';
import StatusChangeModal from '../components/ui/StatusChangeModal';
import { readToken } from '../api/auth/authService';

const TicketPublication = () => {
    const [comment, setComment] = useState('');
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false); // Estado para manejar la visibilidad del modal de tareas
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false); // Estado para manejar la visibilidad del modal de cambios de estado
    const [isContentVisible, setIsContentVisible] = useState(true); // Estado para manejar la visibilidad del contenido
    const [userRole, setUserRole] = useState(null); // Estado para almacenar el rol del usuario
    const [statusChanges, setStatusChanges] = useState([]); // Estado para almacenar los cambios de estado del ticket

    const [ticketData, setTicketData] = useState({
        createdBy: 'Juan Pérez',
        assignedUser: 'Carlos Rodríguez',
        status: 'En Progreso',
        closeDate: null, // Fecha de cierre
    });

    // Leer el token para extraer el rol del usuario
    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const decodedToken = await readToken(); // Lee el token y decodifícalo
                setUserRole(decodedToken?.role?.name || null); // Establece el rol del usuario
            } catch (error) {
                console.error('Error al leer el token:', error);
                setUserRole(null); // Si hay un error, establece el rol como null
            }
        };

        // Simulación de obtener los cambios de estado del ticket
        const fetchStatusChanges = () => {
            // Aquí podrías hacer una solicitud al backend para obtener los cambios de estado
            const changes = [
                {
                    newStatus: 'Abierto',
                    changedBy: 'Juan Pérez',
                    changedAt: '20/09/2024 10:00 AM',
                },
                {
                    newStatus: 'En Progreso',
                    changedBy: 'Carlos Rodríguez',
                    changedAt: '21/09/2024 11:45 AM',
                },
                {
                    newStatus: 'Cerrado',
                    changedBy: 'Carlos Rodríguez',
                    changedAt: '22/09/2024 02:00 PM',
                },
                {
                    newStatus: 'En Progreso',
                    changedBy: 'Carlos Rodríguez',
                    changedAt: '21/09/2024 11:45 AM',
                },
                {
                    newStatus: 'Cerrado',
                    changedBy: 'Carlos Rodríguez',
                    changedAt: '22/09/2024 02:00 PM',
                },
                {
                    newStatus: 'En Progreso',
                    changedBy: 'Carlos Rodríguez',
                    changedAt: '21/09/2024 11:45 AM',
                },
                {
                    newStatus: 'Cerrado',
                    changedBy: 'Carlos Rodríguez',
                    changedAt: '22/09/2024 02:00 PM',
                },
                {
                    newStatus: 'En Progreso',
                    changedBy: 'Carlos Rodríguez',
                    changedAt: '21/09/2024 11:45 AM',
                },
                {
                    newStatus: 'Cerrado',
                    changedBy: 'Carlos Rodríguez',
                    changedAt: '22/09/2024 02:00 PM',
                },
                {
                    newStatus: 'En Progreso',
                    changedBy: 'Carlos Rodríguez',
                    changedAt: '21/09/2024 11:45 AM',
                },
                {
                    newStatus: 'Cerrado',
                    changedBy: 'Carlos Rodríguez',
                    changedAt: '22/09/2024 02:00 PM',
                },
            ];
            setStatusChanges(changes); // Actualiza el estado con los cambios
        };

        fetchUserRole();
        fetchStatusChanges(); // Simula obtener los cambios de estado

    }, []);

    const handleTaskModalOpen = () => setIsTaskModalOpen(true);
    const handleTaskModalClose = () => setIsTaskModalOpen(false);
    const handleStatusModalOpen = () => setIsStatusModalOpen(true);
    const handleStatusModalClose = () => setIsStatusModalOpen(false);

    const toggleContentVisibility = () => setIsContentVisible(!isContentVisible);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Abierto':
                return 'bg-red-500 text-white';
            case 'En Progreso':
                return 'bg-yellow-500 text-white';
            case 'Cerrado':
                return 'bg-green-500 text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    };

    const images = [
        { id: 1, src: "https://i.pinimg.com/736x/de/a3/b6/dea3b662624acda5adbbf4489461ece6.jpg", alt: "Evidencia 1" },
        { id: 2, src: "https://i.pinimg.com/736x/de/a3/b6/dea3b662624acda5adbbf4489461ece6.jpg", alt: "Evidencia 2" },
    ];

    const comments = [
        {
            id: 1,
            author: "María González",
            date: "21/09/2024 10:30 AM",
            content: "He revisado la impresora y parece que el problema está en el cartucho de tinta cyan. Recomiendo reemplazarlo.",
        },
        {
            id: 2,
            author: "Carlos Rodríguez",
            date: "21/09/2024 11:45 AM",
            content: "Gracias María. He ordenado un nuevo cartucho de tinta cyan. Debería llegar mañana.",
        },
    ];

    const isAdmin = userRole === 'Administrador' || userRole === 'Superadministrador' || userRole === 'Observador';

    return (
        <div className="bg-gray-100 p-4 rounded-lg shadow-lg w-full max-w-full overflow-x-hidden">
            {/* Botones Ver Tareas y Ver Cambios de Estado */}
            {isAdmin && (
                <div className="my-4 flex justify-end space-x-4">
                    <button
                        onClick={handleTaskModalOpen}
                        className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                        <CheckSquare className="h-5 w-5 mr-2" />
                        Ver Tareas
                    </button>
                    <button
                        onClick={handleStatusModalOpen}
                        className="flex items-center bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                    >
                        <History className="h-5 w-5 mr-2" />
                        Ver Cambios de Estado
                    </button>
                </div>
            )}
            {/* Header */}
            <div className="bg-white rounded-t-lg p-4 border-b-2 border-blue-500">
                <div className="flex flex-row justify-between items-center cursor-pointer" onClick={toggleContentVisibility}>
                    <h2 className="text-xl sm:text-2xl font-bold text-blue-600 mb-4">Problema con la impresora</h2>
                    {isContentVisible ? <ChevronUp className="h-6 w-6 text-blue-600" /> : <ChevronDown className="h-6 w-6 text-blue-600" />}
                </div>

                {/* Fechas y Estado */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-gray-600 space-y-2 sm:space-y-0 mt-4">
                    <div className="flex flex-col space-y-1">
                        <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 flex-shrink-0" />
                            <span>Fecha de apertura: 20/09/2024 10:00 AM</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 flex-shrink-0" />
                            <span>Fecha de cierre: {ticketData.closeDate ? ticketData.closeDate : 'Aún no cerrado'}</span>
                        </div>
                    </div>
                    <div className={`flex items-center space-x-2 px-4 py-1 rounded ${getStatusColor(ticketData.status)}`}>
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        <span>{ticketData.status}</span>
                    </div>
                </div>

                {/* Creador y Encargado */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-gray-600 space-y-2 sm:space-y-0 mt-2">
                    <div className="flex items-center space-x-2">
                        <UserCheck className="h-4 w-4 flex-shrink-0" />
                        <span>Creado por: {ticketData.createdBy}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <UserCheck className="h-4 w-4 flex-shrink-0" />
                        <span>Encargado: {ticketData.assignedUser}</span>
                    </div>
                </div>
            </div>



            {/* Content */}
            {isContentVisible && (
                <div className="bg-white p-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Descripción:</h3>
                    <p className="text-gray-600 mb-6">La impresora de la oficina no está funcionando correctamente. No imprime en color y hace ruidos extraños.</p>

                    {/* Device and Category */}
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 mb-6">
                        <div className="flex items-center space-x-2 text-gray-600">
                            <Printer className="h-5 w-5 text-blue-500 flex-shrink-0" />
                            <span>Impresora HP OfficeJet Pro 9015</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                            <Tag className="h-5 w-5 text-blue-500 flex-shrink-0" />
                            <span>Hardware</span>
                        </div>
                    </div>

                    {/* Images */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-700 flex items-center space-x-2 mb-2">
                            <FileText className="h-5 w-5 text-blue-500 flex-shrink-0" />
                            <span>Imágenes/Evidencias:</span>
                        </h3>
                        <ImageGallery images={images} />
                    </div>

                    {/* Documents */}
                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-700 flex items-center space-x-2 mb-2">
                            <FileText className="h-5 w-5 text-blue-500 flex-shrink-0" />
                            <span>Documentos:</span>
                        </h3>
                        <ul className="list-disc list-inside text-gray-600">
                            <li>Manual de usuario.pdf</li>
                            <li>Historial de mantenimiento.docx</li>
                        </ul>
                    </div>
                </div>
            )}

            {/* Comments Section */}
            <div className="bg-gray-50 rounded-b-lg p-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-700 flex items-center space-x-2 mb-4">
                    <MessageSquare className="h-5 w-5 text-blue-500 flex-shrink-0" />
                    <span>Comentarios:</span>
                </h3>

                {/* Existing Comments */}
                <div className="mb-6">
                    {comments.map((comment) => (
                        <Comment key={comment.id} {...comment} />
                    ))}
                </div>

                {/* Input de comentario siempre abierto */}
                <div>
                    <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Añade un comentario..."
                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows="3"
                    />
                    <div className="flex justify-end mt-2">
                        <button
                            onClick={() => {
                                console.log('Comentario enviado:', comment);
                                setComment('');
                            }}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                        >
                            Enviar
                        </button>
                    </div>
                </div>
            </div>

            {/* Task Modal */}
            {isTaskModalOpen && (
                <TaskModal onClose={handleTaskModalClose} />
            )}

            {/* Status Change Modal */}
            {isStatusModalOpen && (
                <StatusChangeModal
                    onClose={handleStatusModalClose}
                    statusChanges={statusChanges} // Pasando los cambios de estado al modal
                />
            )}
        </div>
    );
};

export default TicketPublication;
