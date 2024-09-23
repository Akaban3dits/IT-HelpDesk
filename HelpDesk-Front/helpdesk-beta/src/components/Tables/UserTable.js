import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import Button from '../ui/Button';
import Input from '../ui/Input';
import Table from '../ui/Table';
import Pagination from '../ui/Pagination';
import { fetchUsers, deleteUser, getUserByFriendlyCode } from '../../api/users/userService';
import { Plus, Edit3, Trash2, ArrowUp, ArrowDown, Key } from 'lucide-react'; 
import { readToken } from '../../api/auth/authService';

const UserTable = () => {
    console.log('--- UserTable Component Initialized ---');

    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('friendly_code');  // Cambiar orden inicial a friendly_code
    const [sortDirection, setSortDirection] = useState('asc');
    const [filters, setFilters] = useState({
        status: '',
        role_id: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);

    const navigate = useNavigate(); 

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const decodedToken = await readToken();
                console.log('Decoded Token:', decodedToken);

                if (decodedToken?.role?.name) {
                    setUserRole(decodedToken.role.name);
                    setIsSuperAdmin(decodedToken.role.name === 'Superadministrador');
                } else {
                    setUserRole(null);
                    setIsSuperAdmin(false);
                }
            } catch (error) {
                console.error('Error reading token:', error);
            }
        };

        fetchUserRole();
    }, []);

    const canViewActions = userRole === 'Administrador' || isSuperAdmin;

    const loadUsers = async () => {
        console.log('loadUsers function called');
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetchUsers(currentPage, itemsPerPage, searchTerm, sortBy, sortDirection, filters);
            console.log('API Response:', response);

            if (response && response.users && Array.isArray(response.users)) {
                setUsers(response.users);
                setTotalPages(parseInt(response.total_pages) || 1);
                setTotalUsers(parseInt(response.total_users) || 0);
            } else {
                setError('Datos de usuarios no válidos recibidos del servidor');
                setUsers([]);
            }
        } catch (error) {
            console.error('Error in loadUsers:', error);
            setError('Error al cargar los usuarios. Por favor, intente de nuevo.');
            setUsers([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        console.log('useEffect triggered - loadUsers called');
        loadUsers();
    }, [currentPage, searchTerm, sortBy, sortDirection, filters]);

    const handleSearch = (event) => {
        console.log('Search term changed:', event.target.value);
        setSearchTerm(event.target.value);
        setCurrentPage(1);
    };

    const handleSort = (column) => {
        console.log('Sort changed:', column);
        setSortBy(column);
        setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    };

    const handleFilter = (key, value) => {
        console.log('Filter changed:', key, value);
        setFilters(prev => ({ ...prev, [key]: value }));
        setCurrentPage(1);
    };

    const handlePageChange = (page) => {
        console.log('Page changed:', page);
        setCurrentPage(page);
    };

    const handleDeleteUser = async (friendlyCode) => {
        console.log('Deleting user:', friendlyCode);
        try {
            await deleteUser(friendlyCode); 
            loadUsers(); 
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    const handleEditUser = async (friendlyCode) => {
        console.log('Editing user:', friendlyCode);
        try {
            const user = await getUserByFriendlyCode(friendlyCode);
            if (user) {
                navigate(`/admin/edit-user/${friendlyCode}`, { state: { user } });
            }
        } catch (error) {
            console.error('Error al obtener usuario para editar:', error);
        }
    };

    return (
        <div className="flex flex-col h-full p-2 sm:p-4 md:p-6">
            {/* Contenedor del input de búsqueda y los selects */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0 w-full">
                <Input
                    type="text"
                    placeholder="Buscar..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full sm:w-1/3 mb-2 sm:mb-0"
                />

                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                    <select
                        onChange={(e) => handleFilter('status', e.target.value)}
                        className="w-full sm:w-auto p-2 border rounded bg-white"
                    >
                        <option value="">Todos los estados</option>
                        <option value={true}>Activo</option>
                        <option value={false}>Inactivo</option>
                    </select>

                    <select
                        onChange={(e) => handleFilter('role_id', e.target.value)}
                        className="w-full sm:w-auto p-2 border rounded bg-white"
                    >
                        <option value="">Todos los roles</option>
                        <option value="Superadministrador">Superadministrador</option>
                        <option value="Administrador">Administrador</option>
                        <option value="Observador">Observador</option>
                        <option value="Usuario">Usuario</option>
                    </select>
                </div>
            </div>

            <div className="hidden sm:block">
                <div className="min-w-full overflow-x-auto">
                    <Table>
                        <Table.Header>
                            <Table.Row>
                                <Table.Head onClick={() => handleSort('friendly_code')} className="cursor-pointer">
                                    Código {sortBy === 'friendly_code' && (sortDirection === 'asc' ? <ArrowUp className="inline w-4 h-4" /> : <ArrowDown className="inline w-4 h-4" />)}
                                </Table.Head>
                                <Table.Head onClick={() => handleSort('first_name')} className="cursor-pointer">
                                    Nombre {sortBy === 'first_name' && (sortDirection === 'asc' ? <ArrowUp className="inline w-4 h-4" /> : <ArrowDown className="inline w-4 h-4" />)}
                                </Table.Head>
                                <Table.Head onClick={() => handleSort('last_name')} className="cursor-pointer hidden sm:table-cell">
                                    Apellido {sortBy === 'last_name' && (sortDirection === 'asc' ? <ArrowUp className="inline w-4 h-4" /> : <ArrowDown className="inline w-4 h-4" />)}
                                </Table.Head>
                                <Table.Head onClick={() => handleSort('email')} className="cursor-pointer hidden md:table-cell">
                                    Email {sortBy === 'email' && (sortDirection === 'asc' ? <ArrowUp className="inline w-4 h-4" /> : <ArrowDown className="inline w-4 h-4" />)}
                                </Table.Head>
                                <Table.Head className="hidden lg:table-cell">Teléfono</Table.Head>
                                <Table.Head>Status</Table.Head>
                                <Table.Head className="hidden sm:table-cell">Rol</Table.Head>
                                {canViewActions && <Table.Head>Acciones</Table.Head>}
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <Table.Row key={user.friendly_code}>
                                        <Table.Cell>{user.friendly_code}</Table.Cell>
                                        <Table.Cell>{user.first_name}</Table.Cell>
                                        <Table.Cell className="hidden sm:table-cell">{user.last_name}</Table.Cell>
                                        <Table.Cell className="hidden md:table-cell">{user.email}</Table.Cell>
                                        <Table.Cell className="hidden lg:table-cell">{user.phone_number}</Table.Cell>
                                        <Table.Cell>
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                {user.status ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </Table.Cell>
                                        <Table.Cell className="hidden sm:table-cell">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                                                ${user.role_name === 'Superadministrador' ? 'bg-red-100 text-red-800' :
                                                    user.role_name === 'Administrador' ? 'bg-orange-100 text-orange-800' :
                                                        user.role_name === 'Observador' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-blue-100 text-blue-800'}`}>
                                                {user.role_name}
                                            </span>
                                        </Table.Cell>
                                        {canViewActions && (
                                            <Table.Cell>
                                                <div className="flex space-x-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleEditUser(user.friendly_code)}
                                                    >
                                                        <Edit3 className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDeleteUser(user.friendly_code)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                    {isSuperAdmin && (
                                                        <Button variant="ghost" size="sm">
                                                            <Key className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </Table.Cell>
                                        )}
                                    </Table.Row>
                                ))
                            ) : (
                                <Table.Row>
                                    <Table.Cell colSpan={canViewActions ? 8 : 7}>
                                        {isLoading ? 'Cargando...' : 'No se encontraron usuarios'}
                                    </Table.Cell>
                                </Table.Row>
                            )}
                        </Table.Body>
                    </Table>
                </div>
            </div>

            <div className="block sm:hidden">
                {users.length > 0 ? (
                    users.map((user) => (
                        <div key={user.friendly_code} className="bg-white shadow rounded-lg p-4 mb-4">
                            <div className="flex justify-between items-center mb-2">
                                <div className="text-lg font-semibold">{user.first_name} {user.last_name}</div>
                                {canViewActions && (
                                    <div className="flex space-x-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleEditUser(user.friendly_code)}
                                        >
                                            <Edit3 className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDeleteUser(user.friendly_code)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                        {isSuperAdmin && (
                                            <Button variant="ghost" size="sm">
                                                <Key className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="text-sm text-gray-600">Código: {user.friendly_code}</div>
                            <div className="text-sm text-gray-600">Email: {user.email}</div>
                            <div className="text-sm text-gray-600">Teléfono: {user.phone_number}</div>
                            <div className="text-sm text-gray-600">Rol: {user.role_name}</div>
                            <div className={`mt-2 text-xs font-semibold inline-block px-2 py-1 rounded-full ${user.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {user.status ? 'Activo' : 'Inactivo'}
                            </div>
                        </div>
                    ))
                ) : (
                    <div>{isLoading ? 'Cargando...' : 'No se encontraron usuarios'}</div>
                )}
            </div>

            <div className="mt-4">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
};

export default UserTable;
