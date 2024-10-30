import React, { useState, useEffect, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';
import { debounce } from 'lodash';

const SearchableSelect = ({
    label,
    searchValue,
    onSearchChange,
    selectedValue,
    onSelectChange,
    placeholder,
    error,
    name,
    fetchOptions,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [selectedLabel, setSelectedLabel] = useState('');

    const debouncedFetchOptions = useCallback(
        debounce(async (search) => {
            setLoading(true);
            try {
                const data = await fetchOptions(search);
                setOptions(data);
            } catch (err) {
                console.error('Error al obtener opciones:', err);
            } finally {
                setLoading(false);
            }
        }, 300),
        [fetchOptions]
    );

    useEffect(() => {
        const fetchInitialOptions = async () => {
            setLoading(true);
            try {
                const data = await fetchOptions(searchValue);
                setOptions(data);
            } catch (err) {
                console.error('Error al obtener opciones iniciales:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialOptions();
    }, [fetchOptions, searchValue]);

    useEffect(() => {
        if (selectedValue) {
            const selectedOption = options.find(option => option.value === selectedValue);
            if (selectedOption) {
                setSelectedLabel(selectedOption.label);
            }
        }
    }, [selectedValue, options]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        onSearchChange(value);
        debouncedFetchOptions(value);
    };

    const handleInputFocus = () => {
        setIsOpen(true);
    };

    const handleSelectOption = (option) => {
        setSelectedLabel(option.label);
        onSelectChange(option.value);
        setInputValue('');
        setIsOpen(false);
    };

    return (
        <div className="relative w-full">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <div className="relative">
                <div
                    className="p-2 bg-white border border-gray-300 rounded-md shadow-sm cursor-pointer sm:text-sm"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {selectedLabel || placeholder || `Selecciona ${label}`}
                    <ChevronDown
                        className={`absolute right-3 top-3 h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
                    />
                </div>

                {isOpen && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg sm:text-sm">
                        <input
                            type="text"
                            name={name}
                            id={name}
                            className="block w-full border-b border-gray-300 py-2 pl-3 pr-10 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            placeholder={`Buscar ${label}`}
                            value={inputValue}
                            onChange={handleInputChange}
                            onFocus={handleInputFocus}
                            autoComplete="off"
                        />

                        <ul className="max-h-60 overflow-auto sm:text-sm">
                            {loading ? (
                                <li className="px-4 py-2 text-gray-500">Cargando...</li>
                            ) : options.length === 0 ? (
                                <li className="px-4 py-2 text-gray-500">No se encontraron resultados</li>
                            ) : (
                                options.map((option) => (
                                    <li
                                        key={option.value}
                                        className={`px-4 py-2 cursor-pointer hover:bg-blue-100 ${selectedValue === option.value ? 'bg-blue-200' : ''}`}
                                        onClick={() => handleSelectOption(option)}
                                    >
                                        {option.label}
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                )}
            </div>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};

export default SearchableSelect;
