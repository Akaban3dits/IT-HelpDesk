const Select = ({ value, onChange, children, className = '' }) => {
    return (
        <select
            value={value}
            onChange={onChange}
            className={`border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500 ${className}`}
        >
            {children}
        </select>
    );
};

export default Select;
