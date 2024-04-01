import React from 'react';
import Container from 'react-bootstrap/Container';
import Header from '../../GeoHeader/GeoHeader.js';
import { Link } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Badge from '../../Badges/Badge.js';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';


export default function ContentDetail() {

    return (
        <main>

            <Container fluid as={'section'}>
                <p className="mt-3"><Link to="/content">Back to Content</Link></p>

                <Row>
                    <Col md="auto">
                        <h1>Need a ride?</h1>
                    </Col>
                    <Col className="d-flex align-items-center">
                        <Button>Edit</Button>
                    </Col>
                </Row>
                {/* Page this is from */}
                <Row className="mt-3">
                    <p><b>Webpage</b><br/>Marketing</p>
                    <p><b>Title</b><br/>Need a ride?</p>
                    <p><b>Content</b><br/>Rent an easy-to-drive gyrocar for your local commuting needs. Become a GyroGoGo member and enjoy the very best way to get around town!</p>
                </Row>
            </Container> 
        </main>
    )
}