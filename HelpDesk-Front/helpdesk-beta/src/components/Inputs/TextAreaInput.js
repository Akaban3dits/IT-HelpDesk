import React from 'react';

const TextAreaInput = ({ 
    label, 
    name, 
    value, 
    onChange, 
    required = false, 
    error, 
    minLength, 
    maxLength, 
    rows = 4 // Número predeterminado de filas
}) => {
    return (
        <div className="mb-4">
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <textarea
                name={name}
                id={name}
                value={value}
                onChange={onChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                rows={rows}
                required={required}
                minLength={minLength}
                maxLength={maxLength}
            />
            {(minLength || maxLength) && (
                <p className="text-gray-500 text-xs">
                    {minLength && `Mínimo: ${minLength}`} {maxLength && `| Máximo: ${maxLength}`}
                </p>
            )}
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    );
};

export default TextAreaInput;
