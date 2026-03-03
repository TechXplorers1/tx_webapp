import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container } from 'react-bootstrap';
import { useAuth } from './AuthContext';

const Unauthorized = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    return (
        <Container className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '80vh', textAlign: 'center' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: 'bold', color: '#dc3545', marginBottom: '1rem' }}>Access Denied</h1>
            <p style={{ fontSize: '1.25rem', color: '#6c757d', marginBottom: '1rem' }}>
                You do not have the required permissions to view this page.
            </p>
            {user && (
                <p className="mb-4">
                    Logged in as: <strong>{user.email}</strong> (Roles: {user.roles?.join(', ') || 'None'})
                </p>
            )}
            <div className="d-flex gap-3">
                <Button variant="primary" onClick={() => navigate('/')}>Return to Homepage</Button>
            </div>
        </Container>
    );
};

export default Unauthorized;
