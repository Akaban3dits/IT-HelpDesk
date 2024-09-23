import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
    return (
        <div className="unauthorized-container" style={styles.container}>
            <h1 style={styles.title}>Acceso Denegado</h1>
            <p style={styles.message}>No tienes permisos para acceder a esta página.</p>
            <Link to="/" style={styles.link}>Regresar a la página de inicio</Link>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
    },
    title: {
        fontSize: '2rem',
        color: '#e74c3c', // Color de error
    },
    message: {
        fontSize: '1.2rem',
        marginBottom: '1rem',
    },
    link: {
        fontSize: '1rem',
        color: '#3498db', // Color del enlace
        textDecoration: 'none',
    }
};

export default Unauthorized;
