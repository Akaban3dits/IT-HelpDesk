import React, { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';
import { updateTicketByFriendlyCode } from '../../api/tickets/ticketService';
import SearchableSelect from '../Inputs/SearchableSelect';
import { fetchUserNames } from '../../api/users/userService';

const AssignUserModal = ({ friendlyCode, currentAssignedUserId, onUserChange, isUser = null, isAdmin = null }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userSearch, setUserSearch] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(currentAssignedUserId);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setSelectedUserId(currentAssignedUserId);
    }, [currentAssignedUserId]);

    useEffect(() => {
        if (isModalOpen) {
            loadUsers();
            setUserSearch('');
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isModalOpen]);

    const loadUsers = useCallback(async (search = '') => {
        setIsLoading(true);
        setError(null);
        try {
            const result = await fetchUserNames(search);
            const mappedUsers = Array.isArray(result) ? result.map(user => ({
                value: user.friendly_code,
                label: `${user.first_name} ${user.last_name}`
            })) : [];
            setUsers(mappedUsers);
            return mappedUsers; // Retorna el array de usuarios
        } catch (error) {
            console.error('Error loading users:', error);
            setError('Failed to load users.');
            return [];
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleSubmit = async () => {
        if (selectedUserId === currentAssignedUserId) {
            setIsModalOpen(false);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            await updateTicketByFriendlyCode(friendlyCode, { assigned_user_id: selectedUserId });
            onUserChange(selectedUserId);
            setIsModalOpen(false);
            window.location.reload(); // Refresca la página solo si se actualiza
        } catch (error) {
            setError('Failed to update the assigned user. Please try again.');
            console.error('Error updating ticket assigned user:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {!isUser && (
            <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded"
            >
                Asignar Encargado
            </button>
        )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}>
                    <div className="min-h-screen px-4 flex items-center justify-center">
                        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl mx-auto" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                                <h2 className="text-xl font-semibold text-gray-900">Asignar Encargado</h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                                    aria-label="Close"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="px-6 py-4">
                                <SearchableSelect
                                    label="Encargado"
                                    searchValue={userSearch}
                                    onSearchChange={setUserSearch}
                                    fetchOptions={loadUsers}
                                    selectedValue={selectedUserId}
                                    onSelectChange={setSelectedUserId}
                                    error={error}
                                    name="user-select"
                                />
                            </div>

                            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-center">
                                {error && <div className="text-red-500 mb-2">{error}</div>}
                                <button
                                    onClick={handleSubmit}
                                    disabled={isLoading || selectedUserId === currentAssignedUserId} // Bloquea el botón si no hay cambio
                                    className="w-full px-6 py-2.5 text-white font-medium bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {isLoading ? 'Updating...' : 'Confirm'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default AssignUserModal;
