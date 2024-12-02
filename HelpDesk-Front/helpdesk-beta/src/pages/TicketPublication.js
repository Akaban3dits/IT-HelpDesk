import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Building, Calendar, Monitor, Tag, FileText, CheckSquare, UserCheck, Clock, ChevronDown, ChevronUp, History, Copy, Check } from 'lucide-react';
import ImageGallery from '../components/ui/ImageGallery';
import TaskModal from '../components/ui/TaskModal';
import StatusChangeModal from '../components/ui/StatusChangeModal';
import { readToken } from '../api/auth/authService';
import { getTicketByFriendlyCode, updateTicketByFriendlyCode } from '../api/tickets/ticketService';
import DocumentButton from './../components/ui/DocumentButton';
import StatusButtonModal from '../components/ui/StatusModal';
import PriorityButtonModal from '../components/ui/PriorityModal';
import AssignUserModal from '../components/ui/AssignUserModal';
import CommentsSection from '../components/ui/CommentSection';

const TicketPublication = ({ isUser = null }) => {
    const { friendlyCode } = useParams();
    const [ticketData, setTicketData] = useState(null);
    const [status, setStatus] = useState('');
    const [priority, setPriority] = useState('');
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [isContentVisible, setIsContentVisible] = useState(true);
    const [userRole, setUserRole] = useState(null);
    const [statusChanges, setStatusChanges] = useState([]);
    const [isCopied, setIsCopied] = useState(false);
    const [error, setError] = useState(null);
    const [assignedUserId, setAssignedUserId] = useState(null); // Inicializa como null

    useEffect(() => {
        const fetchTicketData = async () => {
            try {
                const data = await getTicketByFriendlyCode(friendlyCode);

                setTicketData(data);
                setComments(data.comments || []);
                setStatus(data.status.status_name);
                setPriority(data.priority.priority_name);
            } catch (err) {
                setError('Error al cargar el ticket');
                console.error('Error details:', err);
            }
        };

        const fetchUserRole = async () => {
            try {
                const decodedToken = await readToken();
                setUserRole(decodedToken?.role?.name || null);
            } catch (error) {
                setUserRole(null);
            }
        };

        fetchTicketData();
        fetchUserRole();
    }, [friendlyCode]);

    // Efecto para actualizar assignedUserId cuando ticketData cambia
    useEffect(() => {
        if (ticketData) {
            setAssignedUserId(ticketData.assigned_user?.id || null); // Manejo de nulos
        }
    }, [ticketData]);

    const handleTaskModalOpen = () => setIsTaskModalOpen(true);
    const handleTaskModalClose = () => setIsTaskModalOpen(false);
    const handleStatusModalOpen = () => setIsStatusModalOpen(true);
    const handleStatusModalClose = () => setIsStatusModalOpen(false);
    const toggleContentVisibility = () => setIsContentVisible(!isContentVisible);
    const [isModalOpen, setIsModalOpen] = useState(false);

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

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(ticketData.friendly_code);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
            console.error('Error al copiar el código: ', err);
        }
    };

    if (error) {
        return <div className="text-center text-red-500">{error}</div>;
    }

    if (!ticketData) {
        return <div className="text-center">Cargando...</div>;
    }

    const isAdmin = userRole === 'Administrador' || userRole === 'Superadministrador' || userRole === 'Observador';

    const handleUserChange = (newUserId) => {
        setTicketData((prevTicketData) => ({
            ...prevTicketData,
            assignedUserId: newUserId,
        }));

        // Perform any other necessary actions, such as updating the ticket in the backend
        updateTicketAssignedUser(ticketData.friendly_code, newUserId);
    };

    const updateTicketAssignedUser = async (friendlyCode, userId) => {
        try {
            await updateTicketByFriendlyCode(friendlyCode, { assigned_user_id: userId });
        } catch (error) {
            console.error('Error updating ticket assigned user:', error);
        }
    };

    return (
        <div className="bg-gray-100 p-4 rounded-lg shadow-lg w-full max-w-full overflow-x-hidden">
            <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-t-lg font-semibold mb-4 flex flex-col sm:flex-row justify-between items-center">
                <div className="mb-2 sm:mb-0">Ticket: {ticketData.friendly_code}</div>
                <button
                    onClick={copyToClipboard}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md transition-colors flex items-center"
                >
                    {isCopied ? (
                        <>
                            <Check className="h-4 w-4 mr-1" />
                            Copiado
                        </>
                    ) : (
                        <>
                            <Copy className="h-4 w-4 mr-1" />
                            Copiar
                        </>
                    )}
                </button>
            </div>

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

            <div className="bg-white rounded-t-lg p-4 border-b-2 border-blue-500">
                <div className="flex flex-row justify-between items-center cursor-pointer" onClick={toggleContentVisibility}>
                    <h2 className="text-xl sm:text-2xl font-bold text-blue-600 mb-4">{ticketData.title}</h2>
                    {isContentVisible ? <ChevronUp className="h-6 w-6 text-blue-600" /> : <ChevronDown className="h-6 w-6 text-blue-600" />}
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-gray-600 space-y-2 sm:space-y-0 mt-4">
                    <div className="flex flex-col space-y-1">
                        <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 flex-shrink-0" />
                            <span>Fecha de apertura: {new Date(ticketData.created_at).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 flex-shrink-0" />
                            <span>Fecha de cierre: {ticketData.closed_at ? new Date(ticketData.closed_at).toLocaleString() : 'Aún no cerrado'}</span>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center gap-4">
                        <StatusButtonModal
                            friendlyCode={ticketData.friendly_code}
                            currentStatus={status}
                            onStatusChange={(newStatus) => setStatus(newStatus)}
                            isUser={isUser}
                            isAdmin={isAdmin}
                        />
                        <PriorityButtonModal
                            friendlyCode={ticketData.friendly_code}
                            currentPriority={priority}
                            onPriorityChange={(newPriority) => setPriority(newPriority)}
                            isUser={isUser}
                            isAdmin={isAdmin}
                        />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-gray-600 space-y-2 sm:space-y-0 mt-2">
                    <div className="flex items-center space-x-2">
                        <UserCheck className="h-4 w-4 flex-shrink-0" />
                        <span>Creado por: {ticketData.created_by.first_name} {ticketData.created_by.last_name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <UserCheck className="h-4 w-4 flex-shrink-0" />
                        <span>Encargado: {ticketData.assigned_user.first_name} {ticketData.assigned_user.last_name}</span>
                    </div>

                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm text-gray-600 space-y-2 sm:space-y-0 mt-2">

                    <AssignUserModal
                        friendlyCode={ticketData.friendly_code} // Cambia según tu estructura de datos
                        currentAssignedUserId={ticketData.assigned_user.id}
                        onUserChange={handleUserChange}
                        isUser={isUser}
                        isAdmin={isAdmin}
                    />
                </div>
            </div>

            {isContentVisible && (
                <div className="bg-white p-4">
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">Descripción:</h3>
                    <p className="text-gray-600 mb-6">{ticketData.description}</p>

                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 mb-6">
                        <div className="flex items-center space-x-2 text-gray-600">
                            <Monitor className="h-5 w-5 text-blue-500 flex-shrink-0" />
                            <span>{ticketData.device.device_name}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                            <Tag className="h-5 w-5 text-blue-500 flex-shrink-0" />
                            <span>{ticketData.device.device_type.type_name}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-gray-600">
                            <Building className="h-5 w-5 text-blue-500 flex-shrink-0" />
                            <span>{ticketData.department.department_name}</span>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-700 flex items-center space-x-2 mb-2">
                            <FileText className="h-5 w-5 text-blue-500 flex-shrink-0" />
                            <span>Imágenes/Evidencias:</span>
                        </h3>
                        <ImageGallery images={ticketData.attachments.filter(att => att.is_image)} />
                    </div>

                    <div className="mb-6">
                        <h3 className="text-lg font-semibold text-gray-700 flex items-center space-x-2 mb-4">
                            <FileText className="h-5 w-5 text-blue-500 flex-shrink-0" />
                            <span>Documentos:</span>
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {ticketData.attachments.filter(att => !att.is_image).length > 0 ? (
                                ticketData.attachments.filter(att => !att.is_image).map((doc, index) => (
                                    <DocumentButton key={index} doc={doc} />
                                ))
                            ) : (
                                <p className="text-gray-500">No hay documentos.</p>
                            )}
                        </div>
                    </div>

                </div>
            )}

            <div className="bg-gray-50 rounded-b-lg p-4 border-t border-gray-200">
                <CommentsSection friendlyCode={ticketData.friendly_code} />
            </div>

            {isTaskModalOpen && <TaskModal friendlyCode={ticketData.friendly_code} onClose={handleTaskModalClose} />}
            {isStatusModalOpen && (
                <StatusChangeModal
                    onClose={handleStatusModalClose}
                    friendlyCode={ticketData.friendly_code} // Asegúrate de pasar friendly_code aquí
                />
            )}
        </div>
    );
};

export default TicketPublication;
