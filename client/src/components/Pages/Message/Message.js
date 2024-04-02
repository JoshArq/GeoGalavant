import React from 'react';
import Container from 'react-bootstrap/Container';
import { Link, useLocation } from 'react-router-dom';
import Badge from '../../Badges/Badge.js';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function Message() {
    const location = useLocation()
    const { ticketID } = location.state

    return (
        <main>

            <Container fluid as={'section'}>
                <p className="mt-3"><Link to="/messages">Back to Messages</Link></p>

                <Row>
                    <Col md="auto">
                        <h1>Message</h1>
                    </Col>
                    <Col className="d-flex align-items-center">
                        {/* Button will either be "mark as resolved" or "mark as unresolved" depending on status */}
                        <Button>Mark as Resolved</Button>
                    </Col>
                </Row>
                <Badge status="resolved"/> 
               
                <p className="mt-4"><b>Date Submitted</b><br/>##/##/####</p>
                <p><b>Email</b><br/>arlenemccoy@gmail.com</p>
                <p><b>Message</b><br/>My application got denied. Can I apply again?</p>

            </Container> 
           
        </main>
    )
}