import React, { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ allowedRoles }) => {
    const { userRole, isAuthenticated } = useContext(AuthContext);

    if (!isAuthenticated()) {
        return <Navigate to="/" />;
    }

    if (!allowedRoles.includes(userRole)) {
        return <Navigate to="/unauthorized" />;
    }

    return <Outlet />;
};

export default PrivateRoute;
