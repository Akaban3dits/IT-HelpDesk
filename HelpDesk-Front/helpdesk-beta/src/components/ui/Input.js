const Input = ({ type, value, onChange, placeholder, className = '' }) => {
    return (
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500 ${className}`}
        />
    );
};

export default Input;
