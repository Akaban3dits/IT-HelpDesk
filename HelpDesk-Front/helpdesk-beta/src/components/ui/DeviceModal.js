import React, { useState, useEffect } from 'react';
import Dialog from './Dialog';
import Alert from './Alert';
import TextInput from '../Inputs/TextInput';
import SearchableSelect from '../Inputs/SearchableSelect';
import { createDevice, updateDevice } from '../../api/devices/deviceService';
import { searchDeviceTypes } from '../../api/devices/deviceTService';

const DeviceModal = ({ isOpen, onClose, onSave, device = null }) => {
    const [deviceName, setDeviceName] = useState('');
    const [deviceTypeId, setDeviceTypeId] = useState('');
    const [alertMessage, setAlertMessage] = useState(null);
    const [alertType, setAlertType] = useState('info');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [deviceTypeSearch, setDeviceTypeSearch] = useState('');

    // Cargar datos en caso de edición
    useEffect(() => {
        if (device) {
            setDeviceName(device.device_name || '');
            setDeviceTypeId(device.device_type_id || '');
        } else {
            setDeviceName('');
            setDeviceTypeId('');
        }
    }, [device]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!deviceName.trim() || !deviceTypeId) {
            setAlertMessage('El nombre del dispositivo y el tipo son obligatorios.');
            setAlertType('error');
            return;
        }

        setIsSubmitting(true);
        try {
            if (device) {
                // Actualizar un dispositivo existente
                await updateDevice(device.id, deviceName, deviceTypeId);
                setAlertMessage('Dispositivo actualizado con éxito.');
            } else {
                // Crear un nuevo dispositivo
                await createDevice(deviceName, deviceTypeId);
                setAlertMessage('Dispositivo creado con éxito.');
            }

            setAlertType('success');

            setTimeout(() => {
                onSave(); // Callback para recargar la lista
                onClose(); // Cerrar el modal
            }, 1000);
        } catch (error) {
            setAlertMessage('Error al guardar el dispositivo. Intente nuevamente.');
            setAlertType('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const fetchDeviceTypesOptions = async (search) => {
        try {
            const result = await searchDeviceTypes(search);
            return result.map((type) => ({
                value: type.id,
                label: type.type_name,
            }));
        } catch (error) {
            console.error('Error al buscar tipos de dispositivos:', error);
            return [];
        }
    };

    return (
        <Dialog isOpen={isOpen} onClose={onClose}>
            <div className="w-full max-w-md mx-auto">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                    {device ? 'Editar Dispositivo' : 'Crear Dispositivo'}
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {alertMessage && (
                        <Alert
                            type={alertType}
                            message={alertMessage}
                            onClose={() => setAlertMessage(null)}
                        />
                    )}
                    <SearchableSelect
                        label="Categoria"
                        searchValue={deviceTypeSearch}
                        onSearchChange={setDeviceTypeSearch}
                        selectedValue={deviceTypeId}
                        onSelectChange={setDeviceTypeId}
                        fetchOptions={fetchDeviceTypesOptions}
                        required
                    />
                    <TextInput
                        label="Nombre del Dispositivo"
                        name="deviceName"
                        type="text"
                        value={deviceName}
                        onChange={(e) => setDeviceName(e.target.value)}
                        required
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

export default DeviceModal;
