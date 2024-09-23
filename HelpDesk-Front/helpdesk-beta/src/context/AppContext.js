import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [userRole, setUserRole] = useState('Usuario'); // Cambia esto según el rol del usuario

    return (
        <AppContext.Provider value={{ userRole, setUserRole }}>
            {children}
        </AppContext.Provider>
    );
};
