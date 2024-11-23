import React from 'react';

const TextInput = ({ 
    label, 
    name, 
    value, 
    onChange, 
    required = false, 
    error, 
    type = 'text', 
    pattern, 
    minLength, 
    maxLength 
}) => {
    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <input
                type={type}
                name={name}
                id={name}
                value={value}
                onChange={onChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required={required}
                pattern={pattern}
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

export default TextInput;
