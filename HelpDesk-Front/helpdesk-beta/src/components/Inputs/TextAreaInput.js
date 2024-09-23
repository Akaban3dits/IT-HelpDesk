import React from 'react';

const TextAreaInput = ({ label, name, value, onChange, required = false, error }) => {
    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            <textarea
                name={name}
                id={name}
                value={value}
                onChange={onChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                rows={4} // Puedes ajustar el tamaño según lo que necesites
                required={required}
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    );
};

export default TextAreaInput;
