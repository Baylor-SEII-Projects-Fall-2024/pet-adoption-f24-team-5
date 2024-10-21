import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = useSelector((state) => state.user.token);

    if (!token) {
        return <Navigate to="/Login" replace />;
    }

    return children;
};

export default ProtectedRoute;