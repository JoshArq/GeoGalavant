import React from 'react';
import Container from 'react-bootstrap/Container';
import Header from '../../GeoHeader/GeoHeader.js';

export default function Dashboard() {
    return (
        <main>
            <Header title="Dashboard" />
            <Container as={'section'}>
                <p>Employee stuff here :)</p>
            </Container> 
        </main>
    )
}