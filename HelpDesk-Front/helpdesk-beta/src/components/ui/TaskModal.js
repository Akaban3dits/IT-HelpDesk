import React, { useState } from 'react';
import { X, Trash, Edit, PlusCircle } from 'lucide-react';

const TaskModal = ({ onClose }) => {
    const [tasks, setTasks] = useState([
        { id: 1, description: 'Revisar el toner', is_completed: false, is_editing: false },
        { id: 2, description: 'Reemplazar cartucho de cyan', is_completed: false, is_editing: false },
        { id: 3, description: 'Imprimir página de prueba', is_completed: false, is_editing: false }
    ]);

    const [newTask, setNewTask] = useState('');

    const handleTaskChange = (id) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === id ? { ...task, is_completed: !task.is_completed } : task
            )
        );
    };

    const handleDeleteTask = (id) => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    };

    const handleAddTask = () => {
        if (newTask.trim() !== '') {
            const newTaskObj = {
                id: tasks.length + 1,
                description: newTask,
                is_completed: false,
                is_editing: false
            };
            setTasks([...tasks, newTaskObj]);
            setNewTask('');
        }
    };

    const handleEditTask = (id, description) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === id ? { ...task, description } : task
            )
        );
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
            toggleEditTask(id); // Cerrar la edición cuando se presiona Enter
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
                <div className="space-y-3">
                    {tasks.map((task) => (
                        <div key={task.id} className="flex items-center space-x-3">
                            <input
                                type="checkbox"
                                checked={task.is_completed}
                                onChange={() => handleTaskChange(task.id)}
                                className="h-5 w-5 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                            />
                            {task.is_editing ? (
                                <input
                                    type="text"
                                    value={task.description}
                                    onChange={(e) => handleEditTask(task.id, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(task.id, e)}  // Detectar tecla Enter
                                    className="border border-gray-300 rounded px-2 py-1 text-gray-700 flex-1"
                                    autoFocus  // Colocar el foco en el input cuando se edita
                                />
                            ) : (
                                <span className={`text-gray-700 ${task.is_completed ? 'line-through' : ''}`}>
                                    {task.description}
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
                    ))}
                </div>

                {/* Section to add new task */}
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
