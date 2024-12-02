import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import Table from '../ui/Table';
import Pagination from '../ui/Pagination';
import { fetchRecentTickets } from '../../api/tickets/ticketService';
import { MoreVertical, Edit3, Eye } from 'lucide-react';
import Alert from '../ui/Alert';
import Input from '../ui/Input';

const RecentTicketsTable = ({ isAssigned = null, isUser = null }) => { // Recibe isAssigned como prop
    const [openMenuId, setOpenMenuId] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertType, setAlertType] = useState('info');
    const [filters, setFilters] = useState({
        status: '',
        priority: '',
        dateOption: 'Ultimos 3 dias',
        
    });
    const [searchTerm, setSearchTerm] = useState('');

    const navigate = useNavigate();

    // Cargar tickets
    const loadTickets = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetchRecentTickets(currentPage, itemsPerPage, searchTerm, { ...filters, isAssigned });
            if (response && response.tickets) {
                setTickets(response.tickets);
                setTotalPages(response.total_pages || 1);
            } else {
                setError('Datos de tickets no válidos recibidos del servidor');
                setTickets([]);
            }
        } catch (error) {
            console.error('Error al cargar los tickets:', error);
            setError('Error al cargar los tickets. Por favor, intente de nuevo.');
            setTickets([]);
        } finally {
            setIsLoading(false);
        }
    };

    // useEffect para cargar datos y manejar actualizaciones
    useEffect(() => {
        loadTickets();
        const intervalId = setInterval(() => {
            loadTickets();
        }, 60000); // Actualiza cada minuto (60000 ms)

        return () => clearInterval(intervalId); // Limpia el intervalo al desmontar
    }, [currentPage, filters, searchTerm, isAssigned]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleViewTicket = (friendlyCode) => {
        if (isUser) {
            // Redirige a la ruta específica cuando isUser es true
            navigate(`/ticket/${friendlyCode}`);
        } else {
            // Redirige a la ruta por defecto
            navigate(`/admin/view/${friendlyCode}`);
        }
    };
    

    const handleFilter = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="flex flex-col h-full bg-gray-50 p-2 sm:p-4 md:p-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-2 sm:space-y-0 w-full">
                <Input
                    type="text"
                    placeholder="Buscar tickets..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full sm:w-1/3 mb-2 sm:mb-0 border-indigo-200 focus:border-indigo-500 rounded-lg shadow-sm"
                />
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                    <select
                        onChange={(e) => handleFilter('status', e.target.value)}
                        className="w-full sm:w-auto p-2 border border-indigo-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-gray-700"
                    >
                        <option value="">Todos los estados</option>
                        <option value="Abierto">Abierto</option>
                        <option value="Cerrado">Cerrado</option>
                        <option value="En Progreso">En Progreso</option>
                        <option value="Pendiente">Pendiente</option>
                    </select>
                    {isUser ? null : <select
                        onChange={(e) => handleFilter('priority', e.target.value)}
                        className="w-full sm:w-auto p-2 border border-indigo-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-gray-700"
                    >
                        <option value="">Todas las prioridades</option>
                        <option value="Alta">Alta</option>
                        <option value="Media">Media</option>
                        <option value="Baja">Baja</option>
                    </select>}
                    <select
                        value={filters.dateOption}  // Establece el valor seleccionado en el estado `dateRange`
                        onChange={(e) => handleFilter('dateOption', e.target.value)}
                        className="w-full sm:w-auto p-2 border border-indigo-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-gray-700"
                    >
                        <option value="Ultimos 3 dias">Últimos 3 días</option>
                        <option value="Ultimos 2 dias">Últimos 2 días</option>  {/* Primera opción y valor por defecto */}
                        <option value="Hoy">Hoy</option>
                        {isAssigned !== null && <option value="">Todas las fechas</option>}

                    </select>
                </div>
            </div>

            {/* Table Section */}
            <div className="hidden sm:block relative z-10">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <Table className="relative z-20 w-full table-auto border-collapse">
                        <Table.Header className="sticky top-0 bg-indigo-50 z-10">
                            <Table.Row>
                                <Table.Head className="px-4 py-3 text-left text-indigo-900 font-semibold w-20">Código</Table.Head>
                                <Table.Head className="px-4 py-3 text-left text-indigo-900 font-semibold w-48">Título</Table.Head>
                                <Table.Head className="px-4 py-3 text-left text-indigo-900 font-semibold w-32">
                                    {isUser ? 'Asignado a' : 'Creado por'}
                                </Table.Head>
                                <Table.Head className="px-4 py-3 text-left text-indigo-900 font-semibold w-40">Fecha de Creación</Table.Head>
                                <Table.Head className="px-4 py-3 text-left text-indigo-900 font-semibold w-24">Estado</Table.Head>
                                {!isUser && (
                                    <Table.Head className="px-4 py-3 text-left text-indigo-900 font-semibold w-24">Prioridad</Table.Head>
                                )}
                                <Table.Head className="px-4 py-3 text-left text-indigo-900 font-semibold w-20">Acciones</Table.Head>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {tickets.length > 0 ? (
                                tickets.map((ticket) => (
                                    <Table.Row key={ticket.friendly_code} className="hover:bg-gray-50 transition-colors duration-150">
                                        <Table.Cell className="px-4 py-3 text-gray-900 w-20 truncate">{ticket.friendly_code}</Table.Cell>
                                        <Table.Cell className="px-4 py-3 text-gray-900 w-48 truncate">{ticket.title}</Table.Cell>
                                        <Table.Cell className="px-4 py-3 text-gray-900 w-32 truncate">
                                            {isUser ? ticket.assigned_to_name : ticket.created_by_name}
                                        </Table.Cell>
                                        <Table.Cell className="px-4 py-3 text-gray-700 w-40 truncate">{new Date(ticket.created_at).toLocaleString()}</Table.Cell>
                                        <Table.Cell className="px-4 py-3 w-24">
                                            <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${ticket.status_name === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                                {ticket.status_name}
                                            </span>
                                        </Table.Cell>
                                        {!isUser && (
                                            <Table.Cell className="px-4 py-3 w-24">
                                                <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${ticket.priority_name === 'Alta' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                                                    {ticket.priority_name}
                                                </span>
                                            </Table.Cell>
                                        )}
                                        <Table.Cell className="px-4 py-3 w-20 text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setOpenMenuId(openMenuId === ticket.friendly_code ? null : ticket.friendly_code)}
                                                className="hover:bg-indigo-50 rounded-full p-1"
                                            >
                                                <MoreVertical className="h-4 w-4 text-gray-600" />
                                            </Button>
                                            {openMenuId === ticket.friendly_code && (
                                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 py-1 border border-gray-200">
                                                    <button
                                                        onClick={() => {
                                                            handleViewTicket(ticket.friendly_code);
                                                            setOpenMenuId(null);
                                                        }}
                                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 transition-colors duration-150"
                                                    >
                                                        <Eye className="h-4 w-4 mr-2 text-indigo-600" />
                                                        Ver publicación
                                                    </button>
                                                </div>
                                            )}
                                        </Table.Cell>
                                    </Table.Row>
                                ))
                            ) : (
                                <Table.Row>
                                    <Table.Cell colSpan={7} className="px-4 py-8 text-center text-gray-500">
                                        {isLoading ? 'Cargando...' : 'No se encontraron tickets'}
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                </div>
            </div>

            {/* Mobile View */}
            <div className="block sm:hidden space-y-4">
                {tickets.length > 0 ? (
                    tickets.map((ticket) => (
                        <div key={ticket.friendly_code} className="bg-white shadow-md rounded-lg p-4 relative">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <div className="text-lg font-semibold text-gray-900">{ticket.title}</div>
                                    <div className="text-sm text-gray-600 mt-1">Creado por: {ticket.created_by_name}</div>
                                </div>
                                <div className="relative">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setOpenMenuId(openMenuId === ticket.friendly_code ? null : ticket.friendly_code)}
                                        className="hover:bg-indigo-50 rounded-full p-1"
                                    >
                                        <MoreVertical className="h-4 w-4 text-gray-600" />
                                    </Button>
                                    {openMenuId === ticket.friendly_code && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 py-1 border border-gray-200">
                                            <button
                                                onClick={() => {
                                                    handleViewTicket(ticket.friendly_code);
                                                    setOpenMenuId(null);
                                                }}
                                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 transition-colors duration-150"
                                            >
                                                <Eye className="h-4 w-4 mr-2 text-indigo-600" />
                                                Ver publicación
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="text-sm text-gray-600">Código: {ticket.friendly_code}</div>
                                <div className="text-sm text-gray-600">Fecha: {new Date(ticket.created_at).toLocaleString()}</div>
                                <div className="text-sm">
                                    Estado:
                                    <span className={`ml-2 px-3 py-1 text-xs font-medium rounded-full ${ticket.status_name === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                        {ticket.status_name}
                                    </span>
                                </div>
                                <div className="text-sm">
                                    Prioridad:
                                    <span className={`ml-2 px-3 py-1 text-xs font-medium rounded-full ${ticket.priority_name === 'Alta' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                                        {ticket.priority_name}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                                <span className="ml-2">Cargando tickets...</span>
                            </div>
                        ) : (
                            'No se encontraron tickets'
                        )}
                    </div>
                )}
            </div>

            {/* Pagination */}
            <div className="mt-6">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    className="flex justify-center"
                />
            </div>

            {/* Alert Message */}
            {alertMessage && (
                <Alert
                    type={alertType}
                    message={alertMessage}
                    onClose={() => setAlertMessage(null)}
                    className="fixed bottom-4 right-4 z-50"
                />
            )}
        </div>
    );
};

export default RecentTicketsTable;
