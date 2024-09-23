import React from 'react';
import { XCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';

const Alert = ({ type = 'info', message, onClose }) => {
    const alertStyles = {
        success: 'bg-green-100 border-green-500 text-green-700',
        error: 'bg-red-100 border-red-500 text-red-700',
        warning: 'bg-yellow-100 border-yellow-500 text-yellow-700',
        info: 'bg-blue-100 border-blue-500 text-blue-700',
    };

    const icons = {
        success: <CheckCircle className="w-5 h-5" />,
        error: <XCircle className="w-5 h-5" />,
        warning: <AlertTriangle className="w-5 h-5" />,
        info: <Info className="w-5 h-5" />,
    };

    return (
        <div className={`border-l-4 p-4 mb-4 rounded-r ${alertStyles[type]}`} role="alert">
            <div className="flex items-center">
                <div className="flex-shrink-0 mr-3">
                    {icons[type]}
                </div>
                <div className="flex-grow">{message}</div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="flex-shrink-0 ml-auto -mx-1.5 -my-1.5 bg-transparent text-current p-1.5 hover:bg-white rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-50 focus:ring-green-600"
                    >
                        <span className="sr-only">Cerrar</span>
                        <XCircle className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );
};

export default Alert;