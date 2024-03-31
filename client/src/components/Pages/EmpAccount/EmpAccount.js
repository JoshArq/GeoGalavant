import React from 'react';
import Container from 'react-bootstrap/Container';
import Header from '../../GeoHeader/GeoHeader.js';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Badge from '../../Badges/Badge.js';

export default function EmpAccount() {
    return (
        <main>
            <Header title="Your Account" />
            
            <Container as={'section'}>
            
                <p className="mt-3">
                    <b>Employee Type</b><br/>
                    Customer Service
                </p>
                <p>
                    <b>Associated City</b><br/>
                    Rochester
                </p>
                <p>
                    <b>Email</b><br/>
                    something@something.com
                </p>
                <p>
                    <b>Username</b><br/>
                    something1234
                </p>
                <p>
                    <b>Password</b><br/>
                    ********************
                </p>
                <Button className="mt-2">Edit Account</Button>
            </Container> 
        </main>
    )
}