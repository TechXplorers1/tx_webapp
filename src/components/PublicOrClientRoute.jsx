import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Spinner, Container } from 'react-bootstrap';

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
        // Safely get roles as an array even if stored as a string
        const userRoles = Array.isArray(user?.roles) ? user.roles : (user?.roles ? [user.roles] : []);
        
        // If the user is logged in but NOT a client, deny access
        if (!userRoles.includes('client')) {
            return <Navigate to="/unauthorized" replace />;
        }
    }

    // If not logged in, or logged in as client, allow access
    return children;
};

export default PublicOrClientRoute;
