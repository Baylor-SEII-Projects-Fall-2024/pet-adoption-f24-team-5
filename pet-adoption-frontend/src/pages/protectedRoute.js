import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { handleTokenExpiration } from '../utils/checkTokenExpiration';

const ProtectedRoute = ({ children }) => {
    const token = useSelector((state) => state.user.token);

    if (!token || handleTokenExpiration()) {
        return <Navigate to="/session-expired" replace />;
    }

    return children;
};

export default ProtectedRoute;