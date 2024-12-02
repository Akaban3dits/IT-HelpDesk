import React, { useState, useEffect } from 'react';
import Dialog from './Dialog';
import Alert from './Alert';
import TextInput from '../Inputs/TextInput';
import { createDepartment, updateDepartment } from '../../api/departments/departmentService';

const DepartmentModal = ({ isOpen, onClose, department, onSave }) => {
    const [departmentName, setDepartmentName] = useState('');
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertType, setAlertType] = useState('info');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (department) {
            setDepartmentName(department.department_name || '');
        } else {
            setDepartmentName('');
        }
    }, [department]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!departmentName.trim()) {
            setAlertMessage('El nombre del departamento es obligatorio.');
            setAlertType('error');
            return;
        }

        if (isSubmitting) return; // Evita múltiples envíos

        setIsSubmitting(true);
        try {
            if (department) {
                await updateDepartment(department.department_id, { department_name: departmentName });
                setAlertMessage('Departamento actualizado con éxito.');
            } else {
                await createDepartment({ department_name: departmentName });
                setAlertMessage('Departamento creado con éxito.');
            }

            setAlertType('success');
            setTimeout(() => {
                onSave();
                onClose();
            }, 1000);
        } catch (error) {
            setAlertMessage('Error al guardar el departamento. Por favor, intente de nuevo.');
            setAlertType('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose}>
            <div className="w-full max-w-md mx-auto">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                    {department ? 'Editar Departamento' : 'Crear Departamento'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {alertMessage && (
                        <Alert
                            type={alertType}
                            message={alertMessage}
                            onClose={() => setAlertMessage(null)}
                        />
                    )}
                    <TextInput
                        label="Nombre del Departamento"
                        name="departmentName"
                        type="text"
                        value={departmentName}
                        onChange={(e) => setDepartmentName(e.target.value)}
                        required={true}
                    />
                    <div className="flex flex-col sm:flex-row-reverse sm:justify-start space-y-2 sm:space-y-0 sm:space-x-2 sm:space-x-reverse mt-4">
                        <button
                            type="submit"
                            className="w-full sm:w-auto px-4 py-2 text-base font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Guardando...' : 'Guardar'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-full sm:w-auto px-4 py-2 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </Dialog>
    );
};

export default DepartmentModal;
