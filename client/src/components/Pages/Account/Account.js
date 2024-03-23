import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Header from '../../GeoHeader/GeoHeader.js';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

export default function Account() {
    return (
        <main>
            <Header title="Your Account" />
            <Container as={'section'}>
                <h2 className="my-4 fw-bold">Profile</h2>
                <Card className="grey-section border-0 mb-3 p-4">
                    <Card.Body as={Container}>
                        <Row>
                            <Col md={11}>
                                <h3 className="mb-3 fs-5 fw-bold">Personal Information</h3>
                                <p className="fw-bold mb-1">Email</p>
                                <p>something@something.com</p>
                                <p className="fw-bold mb-1">Username</p>
                                <p>johnsmith</p>
                                <p className="fw-bold mb-1">Password</p>
                                <p>**************</p>
                                <p className="fw-bold mb-1">Driver's License</p>
                                <p className="mb-1">Expires ##/##/####</p>
                                <p className="mb-1">123 Fake Street</p>
                                <p>Rochester, NY 14623</p>
                            </Col>
                            <Col md={1}>
                                <Button className="float-end" as={Link} to="/account/editProfile">Edit</Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
                <Card className="grey-section border-0 mb-3 p-4">
                    <Card.Body as={Container}>
                        <Row>
                            <Col md={11}>
                                <h3 className="mb-3 fs-5 fw-bold">Payment Methods</h3>
                                <Row>
                                    <Col sm={6} md={4}>
                                        <p className="fw-bold mb-1">Default</p>
                                        <p className="mb-1">Type of card</p>
                                        <p className="mb-1">Ends in ####</p>
                                        <p className="mb-1">Expires ##/##</p>
                                        <p className="mb-1">123 Fake Street</p>
                                        <p>Rochester, NY 14623</p>
                                    </Col>
                                    <Col sm={6} md={4}>
                                        <p className="fw-bold mb-1"><br/></p>
                                        <p className="mb-1">Type of card</p>
                                        <p className="mb-1">Ends in ####</p>
                                        <p className="mb-1">Expires ##/##</p>
                                        <p className="mb-1">123 Fake Street</p>
                                        <p>Rochester, NY 14623</p>
                                    </Col>
                                    <Col sm={6} md={4}>
                                        <p className="fw-bold mb-1"><br/></p>
                                        <p className="mb-1">Type of card</p>
                                        <p className="mb-1">Ends in ####</p>
                                        <p className="mb-1">Expires ##/##</p>
                                        <p className="mb-1">123 Fake Street</p>
                                        <p>Rochester, NY 14623</p>
                                    </Col>
                                </Row>
                            </Col>
                            <Col md={1}>
                                <Button className="float-end">Edit</Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Container> 
            <Container as={'section'}>
                <h2 className="my-4 fw-bold">Upcoming Reservations</h2>
                <Card className="grey-section border-0 mb-3 p-4">
                    <Card.Body as={Container}>
                        <Row>
                            <Col md={11}>
                                <h3 className="fs-5 mb-4"><b>Reservation Number:</b> ############</h3>
                                <Row>
                                    <Col md={6}>
                                        <h3 className="fs-6 mb-3"><b>Pick-up:</b> Mon, Nov ##, #### - ##:## PM</h3>
                                        <p className="mb-1">Location name</p>
                                        <p className="mb-1">123 Fake Street</p>
                                        <p>Rochester, NY 14623</p>
                                    </Col>
                                    <Col md={6}>
                                        <h3 className="fs-6 mb-3"><b>Drop-off:</b> Mon, Nov ##, #### - ##:## PM</h3>
                                        <p className="mb-1">Location name</p>
                                        <p className="mb-1">123 Fake Street</p>
                                        <p>Rochester, NY 14623</p>
                                    </Col>
                                </Row>
                            </Col>
                            <Col md={1}>
                                <Button className="float-end" as={Link} to="/reserve/edit">Edit</Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Container> 
            <Container as={'section'} className="mb-5">
                <h2 className="my-4 fw-bold">Past Reservations</h2>
                <Card className="grey-section border-0 mb-3 p-4">
                    <Card.Body as={Container}>
                        <p className="mb-0"><em>No past reservations yet</em></p>
                    </Card.Body>
                </Card>
            </Container> 
        </main>
    )
}