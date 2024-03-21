import React from 'react';
import Container from 'react-bootstrap/Container';
import Header from '../../GeoHeader/GeoHeader.js';

export default function Gyrocars() {
    return (
        <main>
            <Header title="Gyrocars" />
            <Container as={'section'}>
                <p>Employee stuff here :)</p>
            </Container> 
        </main>
    )
}