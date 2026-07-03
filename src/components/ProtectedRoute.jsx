import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Spinner, Container } from 'react-bootstrap';

const normalizeRoles = (roles) => {
    if (!roles) return [];
    if (typeof roles === 'string') {
        return roles
            .split(',')
            .map((role) => role.trim().toLowerCase())
            .filter(Boolean);
    }

    if (Array.isArray(roles)) {
        return roles
            .map((role) => typeof role === 'string' ? role.trim().toLowerCase() : '')
            .filter(Boolean);
    }

    if (typeof roles === 'object') {
        return Object.values(roles)
            .flatMap((role) => normalizeRoles(role))
            .filter(Boolean);
    }

    return [];
};

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading, isLoggedIn } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <Container className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
                <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
                <h5 className="mt-3 text-secondary">Verifying access...</h5>
            </Container>
        );
    }

    if (!isLoggedIn) {
        // If user is not logged in, redirect to the login page
        // Save the location they were trying to go to
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    const userRoles = normalizeRoles(user?.roles || user?.role);
    const allowed = normalizeRoles(allowedRoles);

    const isAuthorized = user && userRoles.some((role) => allowed.includes(role));

    if (!isAuthorized) {
        // If logged in but not authorized, redirect to unauthorized page
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default ProtectedRoute;
