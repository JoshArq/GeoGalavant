import React from 'react';
import Container from 'react-bootstrap/Container';
import Header from '../../GeoHeader/GeoHeader.js';
import { Link } from 'react-router-dom';

export default function Customers() {
    return (
        <main>
            <Header title="Customers" />
            <Container as={'section'}>
                <p>Employee stuff here :)</p>
                <p><Link to="/customers/customer">View a customer</Link></p>
            </Container> 
        </main>
    )
}