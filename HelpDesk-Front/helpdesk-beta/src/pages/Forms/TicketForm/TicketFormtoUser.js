import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserNames } from '../../../api/users/userService';
import { fetchDevices } from '../../../api/devices/deviceService';
import { fetchDepartments } from '../../../api/departments/departmentService';
import { fetchPriorities } from '../../../api/priorities/priorityService';
import { createTicket } from '../../../api/tickets/ticketService';
import TextInput from '../../../components/Inputs/TextInput';
import TextAreaInput from '../../../components/Inputs/TextAreaInput';
import SearchableSelect from '../../../components/Inputs/SearchableSelect';
import FileUploadArea from '../../../components/Inputs/FileUploadData';
import SelectInput from '../../../components/Inputs/SelectInput';
import Alert from '../../../components/ui/Alert';

const CreateTickettoUserForm = () => {
    const navigate = useNavigate();
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

    const [departmentSearch, setDepartmentSearch] = useState('');
    const [userSearch, setUserSearch] = useState('');
    const [deviceSearch, setDeviceSearch] = useState('');
    const [departments, setDepartments] = useState([]);
    const [errors, setErrors] = useState({});
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertType, setAlertType] = useState('info');

    const fetchDepartmentsData = async (search) => {
        try {
            const result = await fetchDepartments(search);
            return result.map(dept => ({
                value: dept.id,
                label: dept.department_name,
            }));
        } catch (error) {
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

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title) newErrors.title = 'El título es obligatorio.';
        if (!formData.description) newErrors.description = 'La descripción es obligatoria.';
        if (!formData.department_id) newErrors.department_id = 'Debe seleccionar un departamento.';
        if (!formData.device_id) newErrors.device_id = 'Debe seleccionar un dispositivo.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const formDataToSend = new FormData();
                Object.entries(formData).forEach(([key, value]) => {
                    if (key === 'attachments' && Array.isArray(value)) {
                        value.forEach(file => formDataToSend.append('attachments', file));
                    } else {
                        formDataToSend.append(key, value);
                    }
                });

                await createTicket(formDataToSend);
                setAlertType('success');
                setAlertMessage('Ticket creado con éxito');
                setTimeout(() => navigate('/home'), 2000);
            } catch (error) {
                console.error('Error al crear el ticket:', error);
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

    return (
        <div className="flex-grow">
            <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900">Crear Ticket</h2>
                </div>

                {alertMessage && (
                    <Alert
                        type={alertType}
                        message={alertMessage}
                        onClose={() => setAlertMessage(null)}
                    />
                )}

                <form onSubmit={handleSubmit} className="mt-6">
                    <div className="flex flex-col md:flex-row gap-6">
                        {/* Columna izquierda - Inputs */}
                        <div className="md:w-2/3 space-y-6">
                            <TextInput
                                label="Título"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required={true}
                                minLength={5}
                                maxLength={100}
                                error={errors.title}
                            />
                            <TextAreaInput
                                label="Descripción"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required={true}
                                minLength={10}
                                maxLength={500}
                                error={errors.description}
                            />
                            <div className="grid grid-cols-1 gap-y-6">
                                <SearchableSelect
                                    label="Departamento"
                                    searchValue={departmentSearch}
                                    onSearchChange={setDepartmentSearch}
                                    selectedValue={formData.department_id}
                                    onSelectChange={(value) => handleSelectChange('department_id', value)}
                                    error={errors.department_id}
                                    fetchOptions={fetchDepartmentsData}
                                    required={true}
                                />
                                <SearchableSelect
                                    label="Dispositivo"
                                    searchValue={deviceSearch}
                                    onSearchChange={setDeviceSearch}
                                    fetchOptions={fetchDeviceOptions}
                                    selectedValue={formData.device_id}
                                    onSelectChange={(value) => handleSelectChange('device_id', value)}
                                    error={errors.device_id}
                                    required={true}
                                />
                            </div>
                        </div>

                        {/* Columna derecha - FileUpload */}
                        <div className="md:w-1/3">
                            <div className="sticky top-6">
                                <FileUploadArea
                                    onFileChange={handleFileChange}
                                    maxFiles={5}
                                    className="h-full"
                                />
                                {errors.attachments && <p className="text-red-500 mt-2">{errors.attachments}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Botones */}
                    <div className="flex justify-end mt-6">
                        <button
                            type="button"
                            onClick={() => navigate('/home')}
                            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            Crear Ticket
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTickettoUserForm;