import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserNames } from '../../../api/users/userService';
import { fetchDevices } from '../../../api/devices/deviceService';
import { fetchDepartments } from '../../../api/departments/departmentService';
import { fetchPriorities } from '../../../api/priorities/priorityService';
import { createTicket } from '../../../api/tickets/ticketService'; // Importar la función para crear ticket
import TextInput from '../../../components/Inputs/TextInput';
import TextAreaInput from '../../../components/Inputs/TextAreaInput';
import SearchableSelect from '../../../components/Inputs/SearchableSelect';
import FileUploadArea from '../../../components/Inputs/FileUploadData';
import ProgressBar from '../../../components/ui/ProgressBar';
import Alert from '../../../components/ui/Alert';
import SelectInput from './../../../components/Inputs/SelectInput';

const CreateTicketForm = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const steps = ['Información básica', 'Detalles', 'Asignación', 'Archivos adjuntos'];

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        status_id: '4',
        priority_id: '',
        device_id: '',
        assigned_user_id: '',
        department_id: '',
        attachments: []
    });

    const [userSearch, setUserSearch] = useState('');
    const [deviceSearch, setDeviceSearch] = useState('');
    const [departmentSearch, setDepartmentSearch] = useState('');
    const [priorities, setPriorities] = useState([]);
    const [errors, setErrors] = useState({});
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertType, setAlertType] = useState('info');

    const fetchDepartmentOptions = async (search) => {
        try {
            const result = await fetchDepartments(search);
            return result.map(dept => ({
                value: dept.id,
                label: dept.department_name,
            }));
        } catch (error) {
            console.error('Error al obtener opciones de departamentos:', error);
            return [];
        }
    };

    const fetchUserOptions = async (search) => {
        try {
            const result = await fetchUserNames(search);
            return result.map(user => ({
                value: user.id,
                label: `${user.first_name} ${user.last_name}`,
            }));
        } catch (error) {
            console.error('Error al obtener opciones de usuarios:', error);
            return [];
        }
    };

    const fetchDeviceOptions = async (search) => {
        try {
            const result = await fetchDevices(search);
            return result.map(device => ({
                value: device.id,
                label: device.device_name,
            }));
        } catch (error) {
            console.error('Error al obtener opciones de dispositivos:', error);
            return [];
        }
    };

    useEffect(() => {
        const loadPriorities = async () => {
            try {
                const prioritiesResult = await fetchPriorities();
                setPriorities(prioritiesResult);
            } catch (error) {
                console.error('Error al obtener prioridades:', error);
            }
        };

        loadPriorities();
    }, []);

    const validateForm = () => {
        const newErrors = {};
        if (currentStep === 0) {
            if (!formData.title) {
                newErrors.title = 'El título es obligatorio.';
            }
            if (!formData.description) {
                newErrors.description = 'La descripción es obligatoria.';
            }
        }
        if (currentStep === 1) {
            if (!formData.department_id) {
                newErrors.department_id = 'Debe seleccionar un departamento.';
            }
            if (!formData.priority_id) {
                newErrors.priority_id = 'Debe seleccionar una prioridad.';
            }
        }
        if (currentStep === 2) {
            if (!formData.assigned_user_id) {
                newErrors.assigned_user_id = 'Debe asignar un usuario.';
            }
            if (!formData.device_id) {
                newErrors.device_id = 'Debe seleccionar un dispositivo.';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateFinalStep = () => {
        const newErrors = {};
        if (formData.attachments.length === 0) {
            newErrors.attachments = 'Debe subir al menos un archivo.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (validateFinalStep()) {
            try {
                // Preparar los datos para enviar
                const formDataToSend = new FormData();
                formDataToSend.append('title', formData.title);
                formDataToSend.append('description', formData.description);
                formDataToSend.append('status_id', formData.status_id);
                formDataToSend.append('priority_id', formData.priority_id);
                formDataToSend.append('device_id', formData.device_id);
                formDataToSend.append('assigned_user_id', formData.assigned_user_id);
                formDataToSend.append('department_id', formData.department_id);
    
                // Adjuntar archivos al FormData
                if (formData.attachments && formData.attachments.length > 0) {
                    formData.attachments.forEach((file) => {
                        formDataToSend.append('attachments', file);
                    });
                }
    
                // Log para verificar el contenido de FormData
                for (let [key, value] of formDataToSend.entries()) {
                    if (value instanceof File) {
                        console.log(`${key}: ${value.name}`);
                    } else {
                        console.log(`${key}: ${value}`);
                    }
                }
    
                // Enviar la solicitud al backend
                await createTicket(formDataToSend);
    
                setAlertType('success');
                setAlertMessage('Ticket creado con éxito');
    
                setTimeout(() => {
                    navigate('/admin/dashboard');
                    // Recargar la página
                    window.location.reload();
                }, 2000);
            } catch (error) {
                console.error('Error al crear el ticket:', error); // Log de error
                if (error.response) {
                    // El servidor respondió con un estado distinto de 2xx
                    console.error('Response data:', error.response.data);
                    console.error('Response status:', error.response.status);
                    console.error('Response headers:', error.response.headers);
                } else if (error.request) {
                    // La solicitud se realizó pero no se recibió respuesta
                    console.error('Request data:', error.request);
                } else {
                    // Otro tipo de error
                    console.error('Error', error.message);
                }
                setAlertType('error');
                setAlertMessage('Error al crear el ticket');
            }
        }
    };
    

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSelectChange = (name, value) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (files) => {
        setFormData({ ...formData, attachments: files });
    };

    const nextStep = () => {
        if (currentStep < steps.length - 1 && validateForm()) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleNavigateToDashboard = () => {
        navigate('/admin/dashboard');
    };

    const renderStep = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div className="space-y-4">
                        <TextInput
                            label="Título"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required={true}
                            error={errors.title}
                        />
                        <TextAreaInput
                            label="Descripción"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required={true}
                            error={errors.description}
                        />
                    </div>
                );
            case 1:
                return (
                    <div className="space-y-4">
                        <SearchableSelect
                            key={`department-${formData.department_id}`}
                            label="Departamento"
                            searchValue={departmentSearch}
                            onSearchChange={setDepartmentSearch}
                            fetchOptions={fetchDepartmentOptions}
                            selectedValue={formData.department_id}
                            onSelectChange={(value) => handleSelectChange('department_id', value)}
                            error={errors.department_id}
                        />

                        <SelectInput
                            label="Prioridad"
                            name="priority_id"
                            value={formData.priority_id}
                            onChange={(e) => handleSelectChange(e.target.name, e.target.value)}
                            options={priorities.map(priority => ({ label: priority.priority_name, value: priority.id }))}
                            required={true}
                            error={errors.priority_id}
                        />
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-4">
                        <SearchableSelect
                            key={`user-${formData.assigned_user_id}`}
                            label="Usuario Asignado"
                            searchValue={userSearch}
                            onSearchChange={setUserSearch}
                            fetchOptions={fetchUserOptions}
                            selectedValue={formData.assigned_user_id}
                            onSelectChange={(value) => handleSelectChange('assigned_user_id', value)}
                            error={errors.assigned_user_id}
                        />

                        <SearchableSelect
                            label="Dispositivo"
                            searchValue={deviceSearch}
                            onSearchChange={setDeviceSearch}
                            fetchOptions={fetchDeviceOptions}
                            selectedValue={formData.device_id}
                            onSelectChange={(value) => handleSelectChange('device_id', value)}
                            error={errors.device_id}
                        />
                    </div>
                );
            case 3:
                return (
                    <div>
                        <FileUploadArea onFileChange={handleFileChange} maxFiles={5} />
                        {errors.attachments && <p className="text-red-500">{errors.attachments}</p>}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="w-full px-4 py-8 bg-gray-100">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Crear Nuevo Ticket</h1>
                    <button
                        type="button"
                        onClick={handleNavigateToDashboard}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Ir al Dashboard
                    </button>
                </div>

                {alertMessage && (
                    <Alert type={alertType} message={alertMessage} onClose={() => setAlertMessage(null)} />
                )}

                <div className="mb-8">
                    <ProgressBar steps={steps} currentStep={currentStep} />
                </div>

                <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg overflow-visible">
                    <div className="p-6 space-y-6">
                        {renderStep()}
                    </div>

                    <div className="px-6 py-4 bg-gray-50 flex justify-end items-center gap-4">
                        {currentStep > 0 && (
                            <button
                                type="button"
                                onClick={prevStep}
                                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Anterior
                            </button>
                        )}
                        {currentStep < steps.length - 1 ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Siguiente
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Crear Ticket
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTicketForm;
