import React from 'react';
import Container from 'react-bootstrap/Container';
import Header from '../../GeoHeader/GeoHeader.js';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';

export default function Dashboard() {
    return (
        <main>
            <Header title="Dashboard" />
            <Container as={'section'}>
                <Row>
                    <Col md="4">
                        <Card className="mt-4 grey-section">
                            <Card.Body>
                                <Card.Title as={'h3'} className="fs-4 fw-bold mb-3">
                                    Gyrogogo Northwest
                                </Card.Title>
                                <Card.Text>
                                    <p>3 Available Cars</p>
                                    <p>2 Cars Offline</p>
                                    <p>7 Pick-ups in past month</p>
                                    <p>6 Drop-offs in past month</p>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md="4">
                        <Card className="mt-4 grey-section">
                            <Card.Body>
                                <Card.Title as={'h3'} className="fs-4 fw-bold mb-3">
                                    Gyrogogo Northeast
                                </Card.Title>
                                <Card.Text>
                                    <p>3 Available Cars</p>
                                    <p>2 Cars Offline</p>
                                    <p>7 Pick-ups in past month</p>
                                    <p>6 Drop-offs in past month</p>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md="4">
                        <Card className="mt-4 grey-section">
                            <Card.Body>
                                <Card.Title as={'h3'} className="fs-4 fw-bold mb-3">
                                    Gyrogogo Center City
                                </Card.Title>
                                <Card.Text>
                                    <p>3 Available Cars</p>
                                    <p>2 Cars Offline</p>
                                    <p>7 Pick-ups in past month</p>
                                    <p>6 Drop-offs in past month</p>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col md="4">
                        <Card className="mt-4 grey-section">
                            <Card.Body>
                                <Card.Title as={'h3'} className="fs-4 fw-bold mb-3">
                                    Gyrogogo Southeast
                                </Card.Title>
                                <Card.Text>
                                    <p>3 Available Cars</p>
                                    <p>2 Cars Offline</p>
                                    <p>7 Pick-ups in past month</p>
                                    <p>6 Drop-offs in past month</p>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md="4">
                        <Card className="mt-4 grey-section">
                            <Card.Body>
                                <Card.Title as={'h3'} className="fs-4 fw-bold mb-3">
                                    Gyrogogo Airport
                                </Card.Title>
                                <Card.Text>
                                    <p>3 Available Cars</p>
                                    <p>2 Cars Offline</p>
                                    <p>7 Pick-ups in past month</p>
                                    <p>6 Drop-offs in past month</p>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container> 
        </main>
    )
}