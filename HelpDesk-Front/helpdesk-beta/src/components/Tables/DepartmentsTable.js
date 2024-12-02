import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import Table from '../ui/Table';
import Pagination from '../ui/Pagination';
import { searchDepartments, deleteDepartment } from '../../api/departments/departmentService';
import { MoreVertical, Edit3, Trash, Plus } from 'lucide-react';
import Alert from '../ui/Alert';
import Input from '../ui/Input';
import DepartmentModal from '../ui/DepartmentModal'; // Modal reutilizable para crear/editar

const DepartmentsTable = () => {
    const [openMenuId, setOpenMenuId] = useState(null);
    const [departments, setDepartments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertType, setAlertType] = useState('info');
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState(''); // 'create' o 'edit'
    const [selectedDepartment, setSelectedDepartment] = useState(null);

    const loadDepartments = async () => {
        setIsLoading(true);
        try {
            const response = await searchDepartments({ page: currentPage, limit: itemsPerPage, search: searchTerm });
            if (response && response.departments) {
                setDepartments(response.departments);
                setTotalPages(response.total_pages || 1);
            } else {
                setDepartments([]);
            }
        } catch (error) {
            setAlertMessage('Error al cargar los departamentos');
            setAlertType('error');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadDepartments();
    }, [currentPage, searchTerm]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleOpenModal = (type, department = null) => {
        setModalType(type);
        setSelectedDepartment(department);
        setIsModalOpen(true);
    };

    const handleDeleteDepartment = async (id) => {
        try {
            await deleteDepartment(id);
            setAlertMessage('Departamento eliminado exitosamente');
            setAlertType('success');
            loadDepartments();
        } catch (error) {
            setAlertMessage('Error al eliminar el departamento');
            setAlertType('error');
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const handleModalSave = () => {
        setIsModalOpen(false);
        loadDepartments();
    };

    return (
        <div className="flex flex-col h-full bg-gray-50 p-2 sm:p-4 md:p-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-2 sm:space-y-0 w-full">
                <Input
                    type="text"
                    placeholder="Buscar departamentos..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full sm:w-1/3 mb-2 sm:mb-0 border-indigo-200 focus:border-indigo-500 rounded-lg shadow-sm"
                />
                <Button
                    onClick={() => handleOpenModal('create')}
                    className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                    <Plus className="h-5 w-5 mr-2" />
                    Agregar Departamento
                </Button>
            </div>

            {/* Desktop Table Section */}
            <div className="hidden sm:block relative z-10">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <Table className="relative z-20">
                        <Table.Header>
                            <Table.Row className="bg-indigo-50">
                                <Table.Head className="text-indigo-900 font-semibold">Nombre</Table.Head>
                                <Table.Head className="text-indigo-900 font-semibold">Usuarios</Table.Head>
                                <Table.Head className="text-indigo-900 font-semibold">Tickets</Table.Head>
                                <Table.Head className="text-indigo-900 font-semibold">Acciones</Table.Head>
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {departments.length > 0 ? (
                                departments.map((department) => (
                                    <Table.Row key={department.department_id} className="hover:bg-gray-50 transition-colors duration-150">
                                        <Table.Cell className="text-gray-900">{department.department_name}</Table.Cell>
                                        <Table.Cell className="text-gray-900">{department.total_users}</Table.Cell>
                                        <Table.Cell className="text-gray-900">{department.total_tickets}</Table.Cell>
                                        <Table.Cell>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setOpenMenuId(openMenuId === department.department_id ? null : department.department_id)}
                                                className="hover:bg-indigo-50 rounded-full p-1"
                                            >
                                                <MoreVertical className="h-4 w-4 text-gray-600" />
                                            </Button>
                                            {openMenuId === department.department_id && (
                                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 py-1 border border-gray-200">
                                                    <button
                                                        onClick={() => {
                                                            handleOpenModal('edit', department);
                                                            setOpenMenuId(null);
                                                        }}
                                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 transition-colors duration-150"
                                                    >
                                                        <Edit3 className="h-4 w-4 mr-2 text-indigo-600" />
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            handleDeleteDepartment(department.department_id);
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
                                    <Table.Cell colSpan={4} className="text-center py-8 text-gray-500">
                                        {isLoading ? 'Cargando...' : 'No se encontraron departamentos'}
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                </div>
            </div>

            {/* Mobile View */}
            <div className="block sm:hidden space-y-4">
                {departments.length > 0 ? (
                    departments.map((department) => (
                        <div key={department.department_id} className="bg-white shadow-md rounded-lg p-4 relative">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <div className="text-lg font-semibold text-gray-900">{department.department_name}</div>
                                    <div className="text-sm text-gray-600 mt-1">
                                        Usuarios: {department.total_users} | Tickets: {department.total_tickets}
                                    </div>
                                </div>
                                <div className="relative">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setOpenMenuId(openMenuId === department.department_id ? null : department.department_id)}
                                        className="hover:bg-indigo-50 rounded-full p-1"
                                    >
                                        <MoreVertical className="h-4 w-4 text-gray-600" />
                                    </Button>
                                    {openMenuId === department.department_id && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 py-1 border border-gray-200">
                                            <button
                                                onClick={() => {
                                                    handleOpenModal('edit', department);
                                                    setOpenMenuId(null);
                                                }}
                                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 transition-colors duration-150"
                                            >
                                                <Edit3 className="h-4 w-4 mr-2 text-indigo-600" />
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => {
                                                    handleDeleteDepartment(department.department_id);
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
                    ))
                ) : (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                                <span className="ml-2">Cargando departamentos...</span>
                            </div>
                        ) : (
                            'No se encontraron departamentos'
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
                <DepartmentModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleModalSave}
                    department={modalType === 'edit' ? selectedDepartment : null}
                />
            )}

            {/* Alert */}
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

export default DepartmentsTable;
