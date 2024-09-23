import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchDepartments } from '../../../api/departments/departmentService';
import { fetchRoles } from '../../../api/roles/rolesService';
import { createUser } from '../../../api/users/userService';
import TextInput from '../../../components/Inputs/TextInput';
import SelectInput from '../../../components/Inputs/SelectInput';
import Alert from '../../../components/ui/Alert';
import SearchableSelect from '../../../components/Inputs/SearchableSelect';
import { jwtDecode } from 'jwt-decode';

const CreateUserForm = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        phone_number: '',
        role_id: '',
        department_id: '',
        status: true,
        company: ''
    });

    const [departmentSearch, setDepartmentSearch] = useState('');
    const [departments, setDepartments] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loadingDepartments, setLoadingDepartments] = useState(false);
    const [loadingRoles, setLoadingRoles] = useState(false);
    const [errors, setErrors] = useState({});
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertType, setAlertType] = useState('info');

    // Verificar si hay un token almacenado y redirigir en base al rol
    useEffect(() => {
        const token = sessionStorage.getItem('authToken');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const role = decodedToken.role;

                if (role === 'Administrador' || role === 'Superadministrador' || role === 'Observador') {
                    navigate('/admin/dashboard', { replace: true });
                } else {
                    navigate('/', { replace: true });
                }
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
    }, [navigate]);

    useEffect(() => {
        const loadRoles = async () => {
            setLoadingRoles(true);
            try {
                const rolesResult = await fetchRoles();
                console.log('Roles fetched:', rolesResult);  // Para ver qué roles están siendo retornados
                setRoles(rolesResult);
            } catch (error) {
                console.error('Error fetching roles:', error);
            } finally {
                setLoadingRoles(false);
            }
        };

        loadRoles();
    }, []);

    useEffect(() => {
        const fetchDepartmentsData = async () => {
            setLoadingDepartments(true);
            try {
                const result = await fetchDepartments(departmentSearch || '');
                console.log('Departments fetched:', result);  // Para verificar los datos de departamentos
                setDepartments(result);
            } catch (error) {
                console.error('Error fetching departments:', error);
            } finally {
                setLoadingDepartments(false);
            }
        };

        fetchDepartmentsData();
    }, [departmentSearch]);

    // Expresiones Regulares para validaciones
    const nameRegEx = /^[a-zA-ZÀ-ÿ\s]+$/;  // Solo letras y espacios, incluyendo acentos
    const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;  // Correo válido
    const phoneRegEx = /^[0-9]{10,15}$/;  // Teléfono de 10 a 15 dígitos
    const passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;  // Al menos 8 caracteres, 1 mayúscula, 1 número, 1 símbolo

    const validateForm = () => {
        const newErrors = {};

        if (!formData.first_name || !nameRegEx.test(formData.first_name)) {
            newErrors.first_name = 'El nombre es obligatorio y solo puede contener letras.';
        }

        if (!formData.last_name || !nameRegEx.test(formData.last_name)) {
            newErrors.last_name = 'El apellido es obligatorio y solo puede contener letras.';
        }

        if (!formData.email || !emailRegEx.test(formData.email)) {
            newErrors.email = 'El correo no es válido.';
        }

        if (!formData.password || !passwordRegEx.test(formData.password)) {
            newErrors.password = 'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un símbolo.';
        }

        if (!formData.phone_number || !phoneRegEx.test(formData.phone_number)) {
            newErrors.phone_number = 'El teléfono debe ser un número válido de 10 a 15 dígitos.';
        }

        if (formData.company === '') {
            newErrors.company = 'Debe seleccionar una marca.';
        }

        if (!formData.role_id) {
            newErrors.role_id = 'Debe seleccionar un rol.';
        }

        if (!formData.department_id) {
            newErrors.department_id = 'Debe seleccionar un departamento.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                await createUser(formData);
                setAlertType('success');
                setAlertMessage('Usuario creado con éxito');
            } catch (error) {
                console.error('Error creating user:', error);
                setAlertType('error');
                setAlertMessage('Error al crear el usuario');
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const fetchDepartmentsData = async (search) => {
        try {
            const result = await fetchDepartments(search);
            console.log('SearchableSelect fetched departments:', result);
            return result.map(dept => ({
                value: dept.id,
                label: dept.department_name,
            }));
        } catch (error) {
            console.error('Error fetching departments:', error);
            return [];
        }
    };

    const handleNavigate = () => {
        const token = sessionStorage.getItem('authToken');
        if (token) {
            navigate('/admin/users');
        } else {
            navigate('/');
        }
    };

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Crear usuario</h2>
                <button
                    onClick={handleNavigate}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Volver
                </button>
            </div>

            {alertMessage && (
                <Alert
                    type={alertType}
                    message={alertMessage}
                    onClose={() => setAlertMessage(null)}
                />
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-4">
                    <TextInput
                        label="Nombre"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        required={true}
                        error={errors.first_name}
                    />
                    <TextInput
                        label="Apellido"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        required={true}
                        error={errors.last_name}
                    />
                    <TextInput
                        label="Correo electrónico"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required={true}
                        error={errors.email}
                    />
                    <TextInput
                        label="Contraseña"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        required={true}
                        error={errors.password}
                    />
                    <TextInput
                        label="Teléfono"
                        name="phone_number"
                        type="tel"
                        value={formData.phone_number}
                        onChange={handleChange}
                        required={true}
                        error={errors.phone_number}
                    />

                    <SearchableSelect
                        label="Departamento"
                        searchValue={departmentSearch}
                        onSearchChange={setDepartmentSearch}
                        selectedValue={formData.department_id}
                        onSelectChange={(value) => setFormData({ ...formData, department_id: value })}
                        error={errors.department_id}
                        name="department_id"
                        fetchOptions={fetchDepartmentsData}
                    />

                    <SelectInput
                        label="Rol"
                        name="role_id"
                        value={formData.role_id}
                        onChange={handleChange}
                        options={roles.map(role => ({ label: role.role_name, value: role.id }))}
                        required={true}
                        error={errors.role_id}
                    />
                    <SelectInput
                        label="Marca"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        options={[
                            { label: 'Volkswagen', value: 'true' },
                            { label: 'Cupra', value: 'false' }
                        ]}
                        required={true}
                        error={errors.company}
                    />
                </div>

                <div className="flex justify-end mt-4">
                    <button
                        type="button"
                        onClick={handleNavigate}
                        className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateUserForm;
