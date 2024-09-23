// Importaciones de React
import React, { useState, useEffect } from 'react';
// Importación para la navegación entre rutas
import { useNavigate } from 'react-router-dom';

// Importaciones de funciones de la API
import { fetchUserNames } from '../../../api/users/userService'; 
import { fetchDevices } from '../../../api/devices/device'; 
import { fetchDepartments } from '../../../api/departments/departmentService';
import { fetchCategories } from '../../../api/categories/category'; 
import { fetchStatuses } from '../../../api/statuses/status'; 
import { fetchPriorities } from '../../../api/priorities/priority'; 
import { createTicket } from '../../../api/tickets/ticketService'; 

// Importaciones de componentes personalizados de entradas de datos
import TextInput from '../../../components/Inputs/TextInput';
import TextAreaInput from '../../../components/Inputs/TextAreaInput';
import SearchableSelect from '../../../components/Inputs/SearchableSelect';
import FileUploadArea from '../../../components/Inputs/FileUploadData';

// Importación del componente de alertas
import Alert from '../../../components/ui/Alert';

// Componente principal para la creación de tickets
const CreateTicketForm = () => {
    // Hook para manejar la navegación programática a otras rutas
    const navigate = useNavigate();

    // Estado para almacenar los datos del formulario
    const [formData, setFormData] = useState({
        title: '',         // Título del ticket
        description: '',   // Descripción del ticket
        status_id: '',     // ID del estado seleccionado
        priority_id: '',   // ID de la prioridad seleccionada
        category_id: '',   // ID de la categoría seleccionada
        device_id: '',     // ID del dispositivo seleccionado
        assigned_user_id: '', // ID del usuario asignado
        department_id: '', // ID del departamento seleccionado
        attachments: []    // Archivos adjuntos subidos
    });

    // Estados para manejar las búsquedas y los datos cargados para los selectores
    const [userSearch, setUserSearch] = useState(''); 
    const [users, setUsers] = useState([]); 
    const [deviceSearch, setDeviceSearch] = useState(''); 
    const [devices, setDevices] = useState([]); 
    const [departmentSearch, setDepartmentSearch] = useState(''); 
    const [departments, setDepartments] = useState([]); 
    const [categorySearch, setCategorySearch] = useState(''); 
    const [categories, setCategories] = useState([]); 
    const [statusSearch, setStatusSearch] = useState(''); 
    const [statuses, setStatuses] = useState([]); 
    const [prioritySearch, setPrioritySearch] = useState(''); 
    const [priorities, setPriorities] = useState([]); 

    // Estado para manejar los errores del formulario
    const [errors, setErrors] = useState({});            // Objeto de errores del formulario

    // Estado para manejar el mensaje de alerta y el tipo de alerta (éxito o error)
    const [alertMessage, setAlertMessage] = useState(null); // Mensaje de alerta
    const [alertType, setAlertType] = useState('info');     // Tipo de alerta ('info', 'success', 'error')

    // Función para validar el formulario antes de enviarlo
    const validateForm = () => {
        const newErrors = {}; // Inicializa un objeto de errores

        // Validaciones específicas para campos obligatorios
        if (!formData.title) {
            newErrors.title = 'El título es obligatorio.'; // Validación para el título
        }
        if (!formData.description) {
            newErrors.description = 'La descripción es obligatoria.'; // Validación para la descripción
        }
        if (!formData.assigned_user_id) {
            newErrors.assigned_user_id = 'Debe asignar un usuario.'; // Validación para el usuario asignado
        }

        // Establecer errores en el estado
        setErrors(newErrors);

        // Retorna true si no hay errores, de lo contrario false
        return Object.keys(newErrors).length === 0;
    };

    // Función para manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevenir comportamiento predeterminado del formulario
        if (validateForm()) { // Si la validación es exitosa
            try {
                await createTicket(formData); // Llamada a la API para crear el ticket
                setAlertType('success');      // Configura el tipo de alerta como éxito
                setAlertMessage('Ticket creado con éxito'); // Mensaje de éxito
            } catch (error) {
                console.error('Error creando el ticket:', error); // Muestra el error en la consola
                setAlertType('error');        // Configura el tipo de alerta como error
                setAlertMessage('Error al crear el ticket'); // Mensaje de error
            }
        }
    };

    // Función para manejar los cambios en los campos de texto del formulario
    const handleChange = (e) => {
        const { name, value } = e.target; // Extrae el nombre y valor del input
        setFormData({ ...formData, [name]: value }); // Actualiza el estado con el nuevo valor
    };

    // Función para manejar el cambio de archivos adjuntos
    const handleFileChange = (files) => {
        setFormData({ ...formData, attachments: files }); // Actualiza el estado con los archivos seleccionados
    };

    // Función para manejar el cambio de los selectores de búsqueda
    const handleSelectChange = (name, value) => {
        setFormData({ ...formData, [name]: value }); // Actualiza el estado con el valor seleccionado
    };

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {/* Encabezado de la página */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Crear Ticket</h2>
            </div>

            {/* Muestra el mensaje de alerta si existe */}
            {alertMessage && (
                <Alert
                    type={alertType}      // Tipo de alerta
                    message={alertMessage} // Mensaje de la alerta
                    onClose={() => setAlertMessage(null)} // Función para cerrar la alerta
                />
            )}

            {/* Formulario principal */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-y-6 gap-x-8">
                    {/* Input para el título */}
                    <TextInput
                        label="Título"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required={true}
                        error={errors.title}
                    />
                    {/* Selectores para estado, prioridad, usuario, etc. */}
                    <SearchableSelect
                        label="Estado"
                        searchValue={statusSearch}
                        onSearchChange={(e) => setStatusSearch(e.target.value)}
                        options={statuses.map((status) => ({ label: status.status_name, value: status.id }))}
                        selectedValue={formData.status_id}
                        onSelectChange={(value) => handleSelectChange('status_id', value)}
                    />
                    <SearchableSelect
                        label="Prioridad"
                        searchValue={prioritySearch}
                        onSearchChange={(e) => setPrioritySearch(e.target.value)}
                        options={priorities.map((priority) => ({ label: priority.priority_name, value: priority.id }))}
                        selectedValue={formData.priority_id}
                        onSelectChange={(value) => handleSelectChange('priority_id', value)}
                    />
                    <SearchableSelect
                        label="Usuario"
                        searchValue={userSearch}
                        onSearchChange={(e) => setUserSearch(e.target.value)}
                        options={users.map((user) => ({ label: `${user.first_name} ${user.last_name}`, value: user.id }))}
                        selectedValue={formData.assigned_user_id}
                        onSelectChange={(value) => handleSelectChange('assigned_user_id', value)}
                    />
                    <SearchableSelect
                        label="Departamento"
                        searchValue={departmentSearch}
                        onSearchChange={(e) => setDepartmentSearch(e.target.value)}
                        options={departments.map((dept) => ({ label: dept.department_name, value: dept.id }))}
                        selectedValue={formData.department_id}
                        onSelectChange={(value) => handleSelectChange('department_id', value)}
                    />
                    <SearchableSelect
                        label="Categoría"
                        searchValue={categorySearch}
                        onSearchChange={(e) => setCategorySearch(e.target.value)}
                        options={categories.map((cat) => ({ label: cat.category_name, value: cat.id }))}
                        selectedValue={formData.category_id}
                        onSelectChange={(value) => handleSelectChange('category_id', value)}
                    />
                    <SearchableSelect
                        label="Dispositivo"
                        searchValue={deviceSearch}
                        onSearchChange={(e) => setDeviceSearch(e.target.value)}
                        options={devices.map((device) => ({ label: device.device_name, value: device.id }))}
                        selectedValue={formData.device_id}
                        onSelectChange={(value) => handleSelectChange('device_id', value)}
                    />
                </div>

                {/* Input para la descripción */}
                <div className="mt-6">
                    <TextAreaInput
                        label="Descripción"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required={true}
                        error={errors.description}
                    />
                </div>

                {/* Área para cargar archivos adjuntos */}
                <div className="mt-6">
                    <FileUploadArea onFileChange={handleFileChange} maxFiles={5} />
                </div>

                {/* Botón de guardar */}
                <div className="flex justify-end mt-6">
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateTicketForm;
