import React, { useState, useEffect } from 'react';
import { X, Trash, Edit, PlusCircle } from 'lucide-react';
import { fetchTasksByTicketId, createTask, updateTask, deleteTask } from '../../api/tasks/taskService';

const TaskModal = ({ onClose, friendlyCode }) => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        const loadTasks = async () => {
            try {
                setIsLoading(true);
                setErrorMessage(null);
                const fetchedTasks = await fetchTasksByTicketId(friendlyCode);
                setTasks(fetchedTasks);
            } catch (error) {
                console.error('Error al cargar las tareas:', error.message);
                setErrorMessage('No se pudieron cargar las tareas.');
            } finally {
                setIsLoading(false);
            }
        };

        loadTasks();
    }, [friendlyCode]);

    const handleTaskChange = async (id, isCompleted) => {
        try {
            setErrorMessage(null);
            await updateTask(id, { is_completed: !isCompleted });
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.id === id ? { ...task, is_completed: !task.is_completed } : task
                )
            );
        } catch (error) {
            console.error('Error al actualizar el estado de la tarea:', error.message);
            setErrorMessage('No se pudo actualizar el estado de la tarea.');
        }
    };

    const handleDeleteTask = async (id) => {
        try {
            setErrorMessage(null);
            await deleteTask(id);
            setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
        } catch (error) {
            console.error('Error al eliminar la tarea:', error.message);
            setErrorMessage('No se pudo eliminar la tarea.');
        }
    };

    const handleAddTask = async () => {
        if (newTask.trim() === '') return;
        try {
            const createdTask = await createTask(friendlyCode, { task_description: newTask });
            setTasks([...tasks, createdTask]);
            setNewTask('');
        } catch (error) {
            console.error('Error al crear la tarea:', error.message);
        }
    };
    

    const handleEditTask = async (id, task_description) => {
        try {
            setErrorMessage(null);
            await updateTask(id, { task_description });
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task.id === id ? { ...task, task_description } : task
                )
            );
        } catch (error) {
            console.error('Error al actualizar la tarea:', error.message);
            setErrorMessage('No se pudo actualizar la tarea.');
        }
    };

    const toggleEditTask = (id) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === id ? { ...task, is_editing: !task.is_editing } : task
            )
        );
    };

    const handleKeyDown = (id, event) => {
        if (event.key === 'Enter') {
            toggleEditTask(id);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4 sm:px-6">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-lg sm:max-w-md p-6 relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                >
                    <X size={24} />
                </button>
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Lista de Tareas</h3>

                {errorMessage && (
                    <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
                )}

                <div className="space-y-3">
                    {isLoading ? (
                        <p className="text-gray-500 text-center">Cargando tareas...</p>
                    ) : tasks.length > 0 ? (
                        tasks.map((task) => (
                            <div key={task.id} className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    checked={task.is_completed}
                                    onChange={() => handleTaskChange(task.id, task.is_completed)}
                                    className="h-5 w-5 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                                />
                                {task.is_editing ? (
                                    <input
                                        type="text"
                                        value={task.task_description}
                                        onChange={(e) => handleEditTask(task.id, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(task.id, e)}
                                        className="border border-gray-300 rounded px-2 py-1 text-gray-700 flex-1"
                                        autoFocus
                                    />
                                ) : (
                                    <span
                                        className={`text-gray-700 ${
                                            task.is_completed ? 'line-through' : ''
                                        }`}
                                    >
                                        {task.task_description}
                                    </span>
                                )}
                                <button
                                    onClick={() => toggleEditTask(task.id)}
                                    className="text-gray-500 hover:text-blue-600"
                                >
                                    <Edit size={16} />
                                </button>
                                <button
                                    onClick={() => handleDeleteTask(task.id)}
                                    className="text-gray-500 hover:text-red-600"
                                >
                                    <Trash size={16} />
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center">No hay tareas aún.</p>
                    )}
                </div>

                <div className="mt-4">
                    <input
                        type="text"
                        placeholder="Nueva tarea"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleAddTask}
                        className="mt-2 w-full flex justify-center items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                        <PlusCircle className="mr-2" size={20} />
                        Añadir tarea
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskModal;
