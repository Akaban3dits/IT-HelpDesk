import React from 'react';

const ChartCard = ({ title, children }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
            <div className="h-[300px]">
                {children}
            </div>
        </div>
    );
};

export default ChartCard;
