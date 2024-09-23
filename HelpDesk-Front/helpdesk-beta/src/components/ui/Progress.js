const Progress = ({ value, className = '' }) => {
    return (
        <div className={`bg-gray-200 rounded-full h-2 ${className}`}>
            <div className="bg-blue-500 h-full rounded-full" style={{ width: `${value}%` }}></div>
        </div>
    );
};

export default Progress;
