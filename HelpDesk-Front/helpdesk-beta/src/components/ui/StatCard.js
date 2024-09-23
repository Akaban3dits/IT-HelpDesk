import React from 'react';

const StatCard = ({ title, value, description }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-gray-500">{description}</p>
        </div>
    );
};

export default StatCard;
