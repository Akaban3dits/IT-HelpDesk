import React from 'react';

export const Card = ({ children, className = '' }) => (
    <div className={`bg-white shadow-md rounded-lg p-6 ${className}`}>{children}</div>
);

export const CardHeader = ({ children, className = '' }) => (
    <div className={`mb-4 ${className}`}>{children}</div>
);

export const CardContent = ({ children, className = '' }) => (
    <div className={`mb-4 ${className}`}>{children}</div>
);

export const CardFooter = ({ children, className = '' }) => (
    <div className={`mt-4 ${className}`}>{children}</div>
);