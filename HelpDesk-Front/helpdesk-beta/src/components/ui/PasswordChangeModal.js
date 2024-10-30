import React, { useState } from 'react';
import Dialog from './Dialog';
import Alert from './Alert';
import TextInput from '../Inputs/TextInput';
import { changeUserPassword } from '../../api/users/userService'; // Importar el servicio de cambio de contraseña

const PasswordChangeModal = ({ isOpen, onClose, friendlyCode }) => {
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertType, setAlertType] = useState('info');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        const newErrors = {};
        const passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

        if (!formData.newPassword || !passwordRegEx.test(formData.newPassword)) {
            newErrors.newPassword = 'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un símbolo.';
        }

        if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                // Realizar el cambio de contraseña
                await changeUserPassword(friendlyCode, formData.newPassword);
                setAlertType('success');
                setAlertMessage('Contraseña cambiada con éxito');

                // Cierra el modal después de un breve tiempo
                setTimeout(() => {
                    onClose();
                    setFormData({ newPassword: '', confirmPassword: '' });
                    setAlertMessage(null);
                }, 2000);
            } catch (error) {
                setAlertType('error');
                setAlertMessage('Error al cambiar la contraseña. Por favor, intente de nuevo.');
            }
        }
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose}>
            <div className="w-full max-w-md mx-auto">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Cambiar Contraseña</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {alertMessage && (
                        <Alert
                            type={alertType}
                            message={alertMessage}
                            onClose={() => setAlertMessage(null)}
                        />
                    )}
                    <TextInput
                        label="Nueva Contraseña"
                        name="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        required={true}
                        error={errors.newPassword}
                    />
                    <TextInput
                        label="Confirmar Contraseña"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required={true}
                        error={errors.confirmPassword}
                    />
                    <div className="flex flex-col sm:flex-row-reverse sm:justify-start space-y-2 sm:space-y-0 sm:space-x-2 sm:space-x-reverse mt-4">
                        <button
                            type="submit"
                            className="w-full sm:w-auto px-4 py-2 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Guardar
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full sm:w-auto px-4 py-2 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </Dialog>
    );
};

export default PasswordChangeModal;
