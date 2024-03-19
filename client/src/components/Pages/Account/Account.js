import React from 'react';
import Container from 'react-bootstrap/Container';
import Header from '../../GeoHeader/GeoHeader.js';

export default function Account() {
    return (
        <main>
            <Header title="Your Account" />
            <Container as={'section'}>
                <p>Stuff here :)</p>
            </Container> 
        </main>
    )
}