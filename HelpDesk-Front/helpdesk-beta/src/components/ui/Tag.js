const Tag = ({ color, children }) => {
    const colorClasses = {
        yellow: 'bg-yellow-200 text-yellow-800',
        green: 'bg-green-200 text-green-800',
        red: 'bg-red-200 text-red-800',
    };

    return (
        <span className={`px-2 py-1 rounded-full text-sm ${colorClasses[color]}`}>
            {children}
        </span>
    );
};

export default Tag;
