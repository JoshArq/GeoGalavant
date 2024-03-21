import React from 'react';
import Container from 'react-bootstrap/Container';
import Header from '../../GeoHeader/GeoHeader.js';
import { Link } from 'react-router-dom';

export default function Customer() {
    return (
        <main>
            <Header title="John Doe" />
            <Container as={'section'}>
                <p>ooh customer details</p>
                <p><Link to="/customers">Back to customers</Link></p>
            </Container> 
        </main>
    )
}