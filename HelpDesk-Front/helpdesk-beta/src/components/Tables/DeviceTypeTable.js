import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Table from '../ui/Table';
import Pagination from '../ui/Pagination';
import { deleteDeviceType, getDeviceTypes } from '../../api/devices/deviceTService';
import { MoreVertical, Edit3, Trash, Plus } from 'lucide-react';
import Alert from '../ui/Alert';
import Input from '../ui/Input';
import DeviceTypeModal from '../ui/DeviceTypeModal'; // Modal reutilizable para crear/editar

const DeviceTypesTable = () => {
    const [openMenuId, setOpenMenuId] = useState(null);
    const [deviceTypes, setDeviceTypes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertType, setAlertType] = useState('info');
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState(''); // 'create' o 'edit'
    const [selectedDeviceType, setSelectedDeviceType] = useState(null);

    const loadDeviceTypes = async () => {
        setIsLoading(true);
        try {
            console.log('Cargando con término de búsqueda:', searchTerm); // Verifica el término
    
            // Corregir la llamada para desestructurar los parámetros
            const response = await getDeviceTypes(currentPage, itemsPerPage, searchTerm.trim());
            
            console.log('Respuesta del servidor:', response); // Verifica los datos retornados
            if (response && response.device_types) {
                setDeviceTypes(response.device_types); // Actualiza el estado
                setTotalPages(response.total_pages || 1);
            } else {
                setDeviceTypes([]);
            }
        } catch (error) {
            console.error('Error al cargar los tipos de dispositivos:', error);
            setAlertMessage('Error al cargar los tipos de dispositivos');
            setAlertType('error');
        } finally {
            setIsLoading(false);
        }
    };
    
    

    useEffect(() => {
        loadDeviceTypes();
    }, [currentPage, searchTerm]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleOpenModal = (type, deviceType = null) => {
        setModalType(type);
        setSelectedDeviceType(deviceType);
        setIsModalOpen(true);
    };

    const handleDeleteDeviceType = async (id) => {
        try {
            await deleteDeviceType(id);
            setAlertMessage('Tipo de dispositivo eliminado exitosamente');
            setAlertType('success');
            loadDeviceTypes();
        } catch (error) {
            setAlertMessage('Error al eliminar el tipo de dispositivo');
            setAlertType('error');
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const handleModalSave = () => {
        setIsModalOpen(false);
        loadDeviceTypes();
    };

    return (
        <div className="flex flex-col h-full bg-gray-50 p-2 sm:p-4 md:p-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-2 sm:space-y-0 w-full">
                <Input
                    type="text"
                    placeholder="Buscar categorias..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full sm:w-1/3 mb-2 sm:mb-0 border-indigo-200 focus:border-indigo-500 rounded-lg shadow-sm"
                />
                <Button
                    onClick={() => handleOpenModal('create')}
                    className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Agregar
                </Button>
            </div>

            {/* Desktop Table Section */}
            <div className="hidden sm:block relative z-10">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <Table className="relative z-20">
                        <Table.Header>
                            <Table.Row className="bg-indigo-50">
                                <Table.Head className="text-indigo-900 font-semibold">Nombre</Table.Head>
                                <Table.Head className="text-indigo-900 font-semibold">Código</Table.Head>
                                <Table.Head className="text-indigo-900 font-semibold">Acciones</Table.Head>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {deviceTypes.length > 0 ? (
                                deviceTypes.map((deviceType) => (
                                    <Table.Row key={deviceType.id} className="hover:bg-gray-50 transition-colors duration-150">
                                        <Table.Cell className="text-gray-900">{deviceType.type_name}</Table.Cell>
                                        <Table.Cell className="text-gray-900">{deviceType.type_code}</Table.Cell>
                                        <Table.Cell>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setOpenMenuId(openMenuId === deviceType.id ? null : deviceType.id)}
                                                className="hover:bg-indigo-50 rounded-full p-1"
                                            >
                                                <MoreVertical className="h-4 w-4 text-gray-600" />
                                            </Button>
                                            {openMenuId === deviceType.id && (
                                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 py-1 border border-gray-200">
                                                    <button
                                                        onClick={() => {
                                                            handleOpenModal('edit', deviceType);
                                                            setOpenMenuId(null);
                                                        }}
                                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 transition-colors duration-150"
                                                    >
                                                        <Edit3 className="h-4 w-4 mr-2 text-indigo-600" />
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            handleDeleteDeviceType(deviceType.id);
                                                            setOpenMenuId(null);
                                                        }}
                                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-50 transition-colors duration-150"
                                                    >
                                                        <Trash className="h-4 w-4 mr-2 text-red-600" />
                                                        Eliminar
                                                    </button>
                                                </div>
                                            )}
                                        </Table.Cell>
                                    </Table.Row>
                                ))
                            ) : (
                                <Table.Row>
                                    <Table.Cell colSpan={3} className="text-center py-8 text-gray-500">
                                        {isLoading ? 'Cargando...' : 'No se encontraron tipos de dispositivos'}
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                </div>
            </div>

            {/* Mobile View */}
            <div className="block sm:hidden space-y-4">
                {deviceTypes.length > 0 ? (
                    deviceTypes.map((deviceType) => (
                        <div key={deviceType.id} className="bg-white shadow-md rounded-lg p-4 relative">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <div className="text-lg font-semibold text-gray-900">{deviceType.type_name}</div>
                                    <div className="text-sm text-gray-600 mt-1">Código: {deviceType.type_code}</div>
                                </div>
                                <div className="relative">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setOpenMenuId(openMenuId === deviceType.id ? null : deviceType.id)}
                                        className="hover:bg-indigo-50 rounded-full p-1"
                                    >
                                        <MoreVertical className="h-4 w-4 text-gray-600" />
                                    </Button>
                                    {openMenuId === deviceType.id && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 py-1 border border-gray-200">
                                            <button
                                                onClick={() => {
                                                    handleOpenModal('edit', deviceType);
                                                    setOpenMenuId(null);
                                                }}
                                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 transition-colors duration-150"
                                            >
                                                <Edit3 className="h-4 w-4 mr-2 text-indigo-600" />
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => {
                                                    handleDeleteDeviceType(deviceType.id);
                                                    setOpenMenuId(null);
                                                }}
                                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-red-50 transition-colors duration-150"
                                            >
                                                <Trash className="h-4 w-4 mr-2 text-red-600" />
                                                Eliminar
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))) : (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                                <span className="ml-2">Cargando tipos de dispositivos...</span>
                            </div>
                        ) : (
                            'No se encontraron tipos de dispositivos'
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

            {/* Modal */}
            {isModalOpen && (
                <DeviceTypeModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleModalSave}
                    deviceType={modalType === 'edit' ? selectedDeviceType : null}
                />
            )}

            {/* Alert */}
            {alertMessage && (
                <Alert
                    type={alertType}
                    message={alertMessage}
                    onClose={() => setAlertMessage(null)}
                    className="fixed bottom-5 right-4 z-50"
                />
            )}
        </div>
    );
};


export default DeviceTypesTable;
