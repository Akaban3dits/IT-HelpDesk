import React, { useState, useEffect } from 'react';
import { UserCheck, X } from 'lucide-react';
import { updateTicketByFriendlyCode } from '../../api/tickets/ticketService';
import { fetchUserNames } from '../../api/users/userService';
import SearchableSelect from '../Inputs/SearchableSelect';

const AssignedUserButton = ({ friendlyCode, ticketData, onUserChange }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userOptions, setUserOptions] = useState([]);
    const [selectedUser, setSelectedUser] = useState(ticketData.assigned_user);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userSearch, setUserSearch] = useState('');

    // Fetch users based on search value
    const fetchUsers = async (searchTerm) => {
        setIsLoading(true);
        try {
            const users = await fetchUserNames(searchTerm);
            const formattedUsers = users.map(user => ({
                value: user.id,
                label: `${user.first_name} ${user.last_name}`,
            }));
            setUserOptions(formattedUsers);
        } catch (error) {
            console.error('Error fetching user names:', error);
            setError('Error al obtener usuarios. Inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isModalOpen) {
            fetchUsers(userSearch); // Fetch users when modal opens
        }
    }, [isModalOpen, userSearch]);

    const handleChangeAssignedUser = async () => {
        setIsLoading(true);
        setError(null);
        console.log('Updating assigned user to:', selectedUser);

        try {
            await updateTicketByFriendlyCode(friendlyCode, {
                assigned_user_id: selectedUser.value // Send the selected user's ID
            });
            onUserChange(selectedUser.label); // Notify the parent of the change
            console.log('User assigned successfully:', selectedUser.label);
            setIsModalOpen(false); // Close the modal
        } catch (error) {
            setError('No se pudo actualizar el usuario asignado. Inténtalo de nuevo.');
            console.error('Error updating ticket assigned user:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <button onClick={() => setIsModalOpen(true)} className="group transition-all duration-200 hover:ring-2 hover:ring-gray-200 rounded-lg" aria-label="Change assigned user">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-700 border border-gray-200">
                    <UserCheck className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm font-medium">{selectedUser ? selectedUser.label : 'Sin asignar'}</span>
                </div>
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
                    <div className="min-h-screen px-4 flex items-center justify-center">
                        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl transform transition-all mx-auto" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                                <h2 className="text-xl font-semibold text-gray-900">Cambiar Usuario Asignado</h2>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors" aria-label="Close">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="px-6 py-4">
                                <SearchableSelect
                                    label="Usuario Asignado"
                                    searchValue={userSearch}
                                    onSearchChange={setUserSearch}
                                    selectedValue={selectedUser ? selectedUser.value : null}
                                    onSelectChange={(value) => {
                                        const selected = userOptions.find(option => option.value === value);
                                        setSelectedUser(selected);
                                    }}
                                    placeholder="Buscar usuario..."
                                    error={error}
                                    name="assigned_user"
                                    fetchOptions={fetchUsers} // Pass fetchUsers for fetching options
                                />
                            </div>

                            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/80">
                                {error && <div className="text-red-500 mb-2">{error}</div>}
                                <div className="flex justify-end">
                                    <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-gray-700 font-medium bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none">
                                        Cancelar
                                    </button>
                                    <button onClick={handleChangeAssignedUser} disabled={isLoading} className="ml-3 px-6 py-2.5 text-white font-medium bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 focus:outline-none">
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

export default AssignedUserButton;
