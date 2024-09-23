const Button = ({ children, onClick, variant = 'primary', size = 'md', className = '' }) => {
    const baseStyles = `px-4 py-2 font-semibold rounded-lg focus:outline-none focus:ring transition-all ${className}`;
    const variantStyles = {
        primary: 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-300',
        ghost: 'bg-transparent text-blue-500 hover:bg-blue-100 focus:ring-blue-200',
    };
    const sizeStyles = {
        sm: 'text-sm',
        md: 'text-base',
    };

    return (
        <button onClick={onClick} className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]}`}>
            {children}
        </button>
    );
};

export default Button;
