import React from 'react';
import { Navigate } from 'react-router-dom';
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

const PublicOrClientRoute = ({ children }) => {
    const { user, loading, isLoggedIn } = useAuth();

    if (loading) {
        return (
            <Container className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '80vh' }}>
                <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
                <h5 className="mt-3 text-secondary">Verifying access...</h5>
            </Container>
        );
    }

    if (isLoggedIn) {
        const userRoles = normalizeRoles(user?.roles);
        if (!userRoles.includes('client')) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    return children;
};

export default PublicOrClientRoute;
