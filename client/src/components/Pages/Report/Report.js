import React from 'react';
import Container from 'react-bootstrap/Container';
import Header from '../../GeoHeader/GeoHeader.js';
import { Link } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


export default function Report() {

    return (
        <main>
            <Container fluid as={'section'}>
                <p className="mt-3"><Link to="/reports">Back to Reports</Link></p>

                <Row>
                    <Col md="auto">
                        <h1>Report Name</h1>
                    </Col>
                </Row>
            </Container> 
        </main>
    )
}