import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Table from '../ui/Table';
import Pagination from '../ui/Pagination';
import { fetchUsers, deleteUser, getUserByFriendlyCode } from '../../api/users/userService';
import { MoreVertical, Edit3, Trash2, ArrowUp, ArrowDown, Key } from 'lucide-react';
import { readToken } from '../../api/auth/authService';
import PasswordChangeModal from '../ui/PasswordChangeModal';
import Alert from '../ui/Alert';

const UserTable = () => {
    const [openMenuId, setOpenMenuId] = useState(null);
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('friendly_code');
    const [sortDirection, setSortDirection] = useState('asc');
    const [filters, setFilters] = useState({
        status: '',
        role_id: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [selectedUserFriendlyCode, setSelectedUserFriendlyCode] = useState(null);
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertType, setAlertType] = useState('info');

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const decodedToken = await readToken();
                if (decodedToken?.role?.name) {
                    setUserRole(decodedToken.role.name);
                    setIsSuperAdmin(decodedToken.role.name === 'Superadministrador');
                } else {
                    setUserRole(null);
                    setIsSuperAdmin(false);
                }
            } catch (error) {
            }
        };

        fetchUserRole();
    }, []);

    const canViewActions = userRole === 'Administrador' || isSuperAdmin;

    const loadUsers = async () => {
        setIsLoading(true);
        setError(null);
        setUsers([]); // Limpia la tabla antes de hacer la solicitud
        try {
            const response = await fetchUsers(currentPage, itemsPerPage, searchTerm, sortBy, sortDirection, filters);
            if (response && response.users && Array.isArray(response.users)) {
                setUsers(response.users);
                setTotalPages(parseInt(response.total_pages) || 1);
                setTotalUsers(parseInt(response.total_users) || 0);
            } else {
                setError('Datos de usuarios no válidos recibidos del servidor');
                setUsers([]);
            }
        } catch (error) {
            setError('Error al cargar los usuarios. Por favor, intente de nuevo.');
            setUsers([]);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        loadUsers();
    }, [currentPage, searchTerm, sortBy, sortDirection, filters]);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const handleSort = (column) => {
        setSortBy(column);
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    };

    const handleFilter = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleDeleteUser = async (friendlyCode) => {
        try {
            await deleteUser(friendlyCode);
            loadUsers();
        } catch (error) {
        }
    };

    const handleEditUser = async (friendlyCode) => {
        try {
            const user = await getUserByFriendlyCode(friendlyCode);
            if (user) {
                navigate(`/admin/edit-user/${friendlyCode}`, { state: { user } });
            }
        } catch (error) {
        }
    };

    const handlePasswordChange = (friendlyCode) => {
        setSelectedUserFriendlyCode(friendlyCode);
        setIsPasswordModalOpen(true);
    };

    return (
        <div className="flex flex-col h-full bg-gray-50 p-2 sm:p-4 md:p-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-2 sm:space-y-0 w-full">
                <Input
                    type="text"
                    placeholder="Buscar usuarios..."
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
                        <option value={true}>Activo</option>
                        <option value={false}>Inactivo</option>
                    </select>

                    <select
                        onChange={(e) => handleFilter('role_id', e.target.value)}
                        className="w-full sm:w-auto p-2 border border-indigo-200 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm text-gray-700"
                    >
                        <option value="">Todos los roles</option>
                        <option value="Superadministrador">Superadministrador</option>
                        <option value="Administrador">Administrador</option>
                        <option value="Observador">Observador</option>
                        <option value="Usuario">Usuario</option>
                    </select>
                </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden sm:block relative z-10">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <Table className="relative z-20">
                        <Table.Header>
                            <Table.Row className="bg-indigo-50">
                                <Table.Head onClick={() => handleSort('first_name')} className="cursor-pointer hover:bg-indigo-100 text-indigo-900 font-semibold">
                                    Nombre {sortBy === 'first_name' && (sortDirection === 'asc' ? <ArrowUp className="inline w-4 h-4" /> : <ArrowDown className="inline w-4 h-4" />)}
                                </Table.Head>
                                <Table.Head onClick={() => handleSort('last_name')} className="cursor-pointer hover:bg-indigo-100 text-indigo-900 font-semibold hidden sm:table-cell">
                                    Apellido {sortBy === 'last_name' && (sortDirection === 'asc' ? <ArrowUp className="inline w-4 h-4" /> : <ArrowDown className="inline w-4 h-4" />)}
                                </Table.Head>
                                <Table.Head onClick={() => handleSort('email')} className="cursor-pointer hover:bg-indigo-100 text-indigo-900 font-semibold hidden md:table-cell">
                                    Email {sortBy === 'email' && (sortDirection === 'asc' ? <ArrowUp className="inline w-4 h-4" /> : <ArrowDown className="inline w-4 h-4" />)}
                                </Table.Head>
                                <Table.Head className="text-indigo-900 font-semibold hidden lg:table-cell">Teléfono</Table.Head>
                                <Table.Head className="text-indigo-900 font-semibold">Status</Table.Head>
                                <Table.Head className="text-indigo-900 font-semibold hidden sm:table-cell">Rol</Table.Head>
                                {canViewActions && <Table.Head className="text-indigo-900 font-semibold relative">Acciones</Table.Head>}
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <Table.Row key={user.first_name} className="hover:bg-gray-50 transition-colors duration-150">
                                        <Table.Cell className="text-gray-900">{user.first_name}</Table.Cell>
                                        <Table.Cell className="hidden sm:table-cell text-gray-900">{user.last_name}</Table.Cell>
                                        <Table.Cell className="hidden md:table-cell text-gray-700">{user.email}</Table.Cell>
                                        <Table.Cell className="hidden lg:table-cell text-gray-700">{user.phone_number}</Table.Cell>
                                        <Table.Cell>
                                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${user.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {user.status ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </Table.Cell>
                                        <Table.Cell className="hidden sm:table-cell">
                                            <span className={`px-3 py-1 text-xs font-medium rounded-full 
                                            ${user.role_name === 'Superadministrador' ? 'bg-purple-100 text-purple-800' :
                                                    user.role_name === 'Administrador' ? 'bg-blue-100 text-blue-800' :
                                                        user.role_name === 'Observador' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-gray-100 text-gray-800'}`}>
                                                {user.role_name}
                                            </span>
                                        </Table.Cell>
                                        {canViewActions && (
                                            <Table.Cell className="relative">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setOpenMenuId(openMenuId === user.friendly_code ? null : user.friendly_code)}
                                                    className="hover:bg-indigo-50 rounded-full p-1"
                                                >
                                                    <MoreVertical className="h-4 w-4 text-gray-600" />
                                                </Button>

                                                {openMenuId === user.friendly_code && (
                                                    <>
                                                        <div
                                                            className="fixed inset-0 z-40"
                                                            onClick={() => setOpenMenuId(null)}
                                                        />
                                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 py-1 border border-gray-200">
                                                            <button
                                                                onClick={() => {
                                                                    handleEditUser(user.friendly_code);
                                                                    setOpenMenuId(null);
                                                                }}
                                                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 transition-colors duration-150"
                                                            >
                                                                <Edit3 className="h-4 w-4 mr-2 text-indigo-600" />
                                                                Editar usuario
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    handleDeleteUser(user.friendly_code);
                                                                    setOpenMenuId(null);
                                                                }}
                                                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                                                            >
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                Eliminar usuario
                                                            </button>
                                                            {isSuperAdmin && (
                                                                <button
                                                                    onClick={() => {
                                                                        handlePasswordChange(user.friendly_code);
                                                                        setOpenMenuId(null);
                                                                    }}
                                                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 transition-colors duration-150"
                                                                >
                                                                    <Key className="h-4 w-4 mr-2 text-indigo-600" />
                                                                    Cambiar contraseña
                                                                </button>
                                                            )}
                                                        </div>
                                                    </>
                                                )}
                                            </Table.Cell>
                                        )}
                                    </Table.Row>
                                ))
                            ) : (
                                <Table.Row>
                                    <Table.Cell colSpan={canViewActions ? 8 : 7} className="text-center py-8 text-gray-500">
                                        {isLoading ? 'Cargando...' : 'No se encontraron usuarios'}
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                </div>
            </div>
            {/* Vista móvil */}
            {/* Mobile View */}
            <div className="block sm:hidden space-y-4">
                {users.length > 0 ? (
                    users.map((user) => (
                        <div key={user.friendly_code} className="bg-white shadow-md rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <div className="text-lg font-semibold text-gray-900">{user.first_name} {user.last_name}</div>
                                    <div className="text-sm text-gray-600 mt-1">{user.email}</div>
                                </div>
                                {canViewActions && (
                                    <div className="relative">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setOpenMenuId(openMenuId === user.friendly_code ? null : user.friendly_code)}
                                            className="hover:bg-indigo-50 rounded-full p-1"
                                        >
                                            <MoreVertical className="h-4 w-4 text-gray-600" />
                                        </Button>

                                        {openMenuId === user.friendly_code && (
                                            <>
                                                <div
                                                    className="fixed inset-0 z-40"
                                                    onClick={() => setOpenMenuId(null)}
                                                />
                                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 py-1 border border-gray-200">
                                                    <button
                                                        onClick={() => {
                                                            handleEditUser(user.friendly_code);
                                                            setOpenMenuId(null);
                                                        }}
                                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 transition-colors duration-150"
                                                    >
                                                        <Edit3 className="h-4 w-4 mr-2 text-indigo-600" />
                                                        Editar usuario
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            handleDeleteUser(user.friendly_code);
                                                            setOpenMenuId(null);
                                                        }}
                                                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                                                    >
                                                        <Trash2 className="h-4 w-4 mr-2" />
                                                        Eliminar usuario
                                                    </button>
                                                    {isSuperAdmin && (
                                                        <button
                                                            onClick={() => {
                                                                handlePasswordChange(user.friendly_code);
                                                                setOpenMenuId(null);
                                                            }}
                                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 transition-colors duration-150"
                                                        >
                                                            <Key className="h-4 w-4 mr-2 text-indigo-600" />
                                                            Cambiar contraseña
                                                        </button>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="space-y-2">
                                <div className="text-sm text-gray-600">Teléfono: {user.phone_number}</div>
                                <div className="text-sm text-gray-600">
                                    Rol:
                                    <span className={`ml-2 px-3 py-1 text-xs font-medium rounded-full 
                                        ${user.role_name === 'Superadministrador' ? 'bg-purple-100 text-purple-800' :
                                            user.role_name === 'Administrador' ? 'bg-blue-100 text-blue-800' :
                                                user.role_name === 'Observador' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-gray-100 text-gray-800'}`}>
                                        {user.role_name}
                                    </span>
                                </div>
                                <div className="text-sm">
                                    Status:
                                    <span className={`ml-2 px-3 py-1 text-xs font-medium rounded-full ${user.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {user.status ? 'Activo' : 'Inactivo'}
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
                                <span className="ml-2">Cargando usuarios...</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center">
                                <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <span>No se encontraron usuarios</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <PasswordChangeModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                friendlyCode={selectedUserFriendlyCode}
            />

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

export default UserTable;