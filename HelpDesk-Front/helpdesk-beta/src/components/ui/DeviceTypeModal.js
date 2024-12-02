import React, { useState, useEffect } from 'react';
import Dialog from './Dialog';
import Alert from './Alert';
import TextInput from '../Inputs/TextInput';
import { createDeviceType, updateDeviceType } from '../../api/devices/deviceTService';

const DeviceTypeModal = ({ isOpen, onClose, onSave, deviceType = null }) => {
    const [typeName, setTypeName] = useState('');
    const [typeCode, setTypeCode] = useState('');
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertType, setAlertType] = useState('info');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Cargar datos en caso de edición
    useEffect(() => {
        if (deviceType) {
            setTypeName(deviceType.type_name || '');
            setTypeCode(deviceType.type_code || '');
        } else {
            setTypeName('');
            setTypeCode('');
        }
    }, [deviceType]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!typeName.trim() || !typeCode.trim()) {
            setAlertMessage('El nombre y el código del categoria son obligatorios.');
            setAlertType('error');
            return;
        }

        setIsSubmitting(true);
        try {
            if (deviceType) {
                // Actualizar un tipo de dispositivo existente
                await updateDeviceType(deviceType.id, { typeName, typeCode });
                setAlertMessage('Categoria actualizado con éxito.');
            } else {
                // Crear un nuevo tipo de dispositivo
                await createDeviceType(typeName, typeCode);
                setAlertMessage('Categoria creado con éxito.');
            }

            setAlertType('success');

            setTimeout(() => {
                onSave(); // Callback para recargar la lista
                onClose(); // Cerrar el modal
            }, 1000);
        } catch (error) {
            setAlertMessage('Error al guardar la categoria. Intente nuevamente.');
            setAlertType('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose}>
            <div className="w-full max-w-md mx-auto">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                    {deviceType ? 'Editar Categoria' : 'Crear Categoria'}
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
                        label="Nombre del Tipo"
                        name="typeName"
                        type="text"
                        value={typeName}
                        onChange={(e) => setTypeName(e.target.value)}
                        required
                    />
                    <TextInput
                        label="Código del Tipo"
                        name="typeCode"
                        type="text"
                        value={typeCode}
                        onChange={(e) => setTypeCode(e.target.value)}
                        required
                        maxLength={3}
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

export default DeviceTypeModal;
