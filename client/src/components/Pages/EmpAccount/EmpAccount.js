import React from 'react';
import Container from 'react-bootstrap/Container';
import Header from '../../GeoHeader/GeoHeader.js';

export default function EmpAccount() {
    return (
        <main>
            <Header title="Your Account" />
            <Container as={'section'}>
                <p>Employee stuff here :)</p>
            </Container> 
        </main>
    )
}