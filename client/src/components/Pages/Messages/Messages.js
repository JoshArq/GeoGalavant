import React from 'react';
import Container from 'react-bootstrap/Container';
import Header from '../../GeoHeader/GeoHeader.js';

export default function Messages() {
    return (
        <main>
            <Header title="Messages" />
            <Container as={'section'}>
                <p>Employee stuff here :)</p>
            </Container> 
        </main>
    )
}