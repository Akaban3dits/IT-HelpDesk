import React, { useState, useEffect, useCallback, useRef } from 'react';
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
    required = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [selectedLabel, setSelectedLabel] = useState('');
    const [dropdownPosition, setDropdownPosition] = useState('bottom');
    const wrapperRef = useRef(null);
    const dropdownRef = useRef(null);

    const debouncedFetchOptions = useCallback(
        debounce(async (search) => {
            setLoading(true);
            try {
                const data = await fetchOptions(search);
                if (Array.isArray(data)) {
                    setOptions(data);
                } else {
                    console.error('fetchOptions should return an array:', data);
                    setOptions([]);
                }
            } catch (err) {
                console.error('Error al obtener opciones:', err);
                setOptions([]);
            } finally {
                setLoading(false);
            }
        }, 300),
        [fetchOptions]
    );

    useEffect(() => {
        if (selectedValue) {
            const selectedOption = options.find(option => option.value === selectedValue);
            if (selectedOption) {
                setSelectedLabel(selectedOption.label);
            } else {
                setSelectedLabel('');
            }
        }
    }, [selectedValue, options]);

    const calculateDropdownPosition = useCallback(() => {
        if (!wrapperRef.current || !dropdownRef.current) return;

        const wrapperRect = wrapperRef.current.getBoundingClientRect();
        const dropdownHeight = dropdownRef.current.offsetHeight;
        const viewportHeight = window.innerHeight;
        const spaceBelow = viewportHeight - wrapperRect.bottom;
        const spaceAbove = wrapperRect.top;

        // Si hay más espacio abajo que el alto del dropdown, o si hay más espacio abajo que arriba
        if (spaceBelow >= dropdownHeight || spaceBelow >= spaceAbove) {
            setDropdownPosition('bottom');
        } else {
            setDropdownPosition('top');
        }
    }, []);

    useEffect(() => {
        const fetchInitialOptions = async () => {
            setLoading(true);
            try {
                const data = await fetchOptions(searchValue);
                if (Array.isArray(data)) {
                    setOptions(data);
                } else {
                    console.error('Initial fetchOptions should return an array:', data);
                    setOptions([]);
                }
            } catch (err) {
                console.error('Error al obtener opciones iniciales:', err);
                setOptions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialOptions();
    }, [fetchOptions, searchValue]);

    useEffect(() => {
        if (isOpen) {
            calculateDropdownPosition();
            // Recalcular posición al cambiar el tamaño de la ventana
            window.addEventListener('resize', calculateDropdownPosition);
            return () => window.removeEventListener('resize', calculateDropdownPosition);
        }
    }, [isOpen, calculateDropdownPosition]);

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        onSearchChange(value);
        if (value) {
            debouncedFetchOptions(value);
        } else {
            setOptions([]);
        }
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

    const handleClickOutside = (event) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
                <div
                    className={`p-2 bg-white border ${
                        error ? 'border-red-500' : 'border-gray-300'
                    } rounded-md shadow-sm cursor-pointer sm:text-sm`}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {selectedLabel || placeholder || `Selecciona ${label}`}
                    <ChevronDown
                        className={`absolute right-3 top-3 h-5 w-5 text-gray-400 transition-transform ${
                            isOpen ? 'transform rotate-180' : ''
                        }`}
                    />
                </div>

                {isOpen && (
                    <div
                        ref={dropdownRef}
                        className={`absolute z-50 w-full bg-white border border-gray-300 rounded-md shadow-lg sm:text-sm ${
                            dropdownPosition === 'top'
                                ? 'bottom-full mb-1'
                                : 'top-full mt-1'
                        }`}
                    >
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
                                        className={`px-4 py-2 cursor-pointer hover:bg-blue-100 ${
                                            selectedValue === option.value ? 'bg-blue-200' : ''
                                        }`}
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
            {required && !selectedValue && (
                <p className="mt-1 text-sm text-red-600">Este campo es obligatorio.</p>
            )}
        </div>
    );
};

export default SearchableSelect;