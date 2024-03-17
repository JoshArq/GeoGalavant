import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Header from '../../GeoHeader/GeoHeader.js';
import Card from 'react-bootstrap/Card';

export default function Account() {
    return (
        <main>
            <Header title="Your Account" />
            <Container as={'section'}>
                <h2 className="my-4 fw-bold">Profile</h2>
                <Card className="grey-section border-0 mb-3 px-4">
                    <Card.Body as={Container}>
                        <Row>
                            <h3 className="mb-3"><span className="fw-bold fs-5">Personal Information</span> <a className="fs-6 ms-4">Edit</a></h3>
                            <Col>
                                <p className="fw-bold mb-1">Email</p>
                                <p>something@something.com</p>
                                <p className="fw-bold mb-1">Username</p>
                                <p>johnsmith</p>
                                <p className="fw-bold mb-1">Password</p>
                                <p>**************</p>
                            </Col>
                        </Row>
                        <Row>
                            <h3 className="mb-3"><span className="fw-bold fs-5">Payment Information</span> <a className="fs-6 ms-4">Edit</a></h3>
                            <Col md={3}>
                                <p className="fw-bold mb-1">Default</p>
                                <p className="mb-1">Type of card</p>
                                <p>Credit card ending in ####</p>
                            </Col>
                            <Col md={3}>
                                <p className="fw-bold mb-1"><br/></p>
                                <p className="mb-1">Type of card</p>
                                <p>Credit card ending in ####</p>
                            </Col>
                            <Col md={3}>
                                <p className="fw-bold mb-1"><br/></p>
                                <p><a href="">Add New</a></p>
                            </Col>
                        </Row>
                        <Row>
                            <h3 className="mb-3"><span className="fw-bold fs-5">Address Information</span> <a className="fs-6 ms-4">Edit</a></h3>
                            <Col md={3}>
                                <p className="fw-bold mb-1">Default</p>
                                <p className="mb-1">123 Fake Street</p>
                                <p>Rochester, NY 14623</p>
                            </Col>
                            <Col md={3}>
                                <p className="fw-bold mb-1"><br/></p>
                                <p className="mb-1">123 Fake Street</p>
                                <p>Rochester, NY 14623</p>
                            </Col>
                            <Col md={3}>
                                <p className="fw-bold mb-1"><br/></p>
                                <p><a href="">Add New</a></p>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Container> 
            <Container as={'section'}>
                <h2 className="my-4 fw-bold">Upcoming Reservations</h2>
                <Card className="grey-section border-0 mb-3 px-4">
                    <Card.Body as={Container}>
                        <Row>
                            <Col md={6}>
                                <h3 className="fs-5 mb-3"><b>Pick-up:</b> Mon, Nov ##, #### - ##:## PM</h3>
                                <p className="mb-1">Location name</p>
                                <p className="mb-1">123 Fake Street</p>
                                <p>Rochester, NY 14623</p>
                            </Col>
                            <Col md={6}>
                                <h3 className="fs-5 mb-3"><b>Drop-off:</b> Mon, Nov ##, #### - ##:## PM</h3>
                                <p className="mb-1">Location name</p>
                                <p className="mb-1">123 Fake Street</p>
                                <p>Rochester, NY 14623</p>
                            </Col>
                        </Row>
                        <Row className="mt-3">
                            <Col md={6}>
                                <p><a href="#">More Details</a></p>
                            </Col>
                            <Col md={6}>
                                <p className="text-md-end mb-0"><a href="#">Modify / Cancel Reservation</a></p>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
                <Card className="grey-section border-0 mb-3 px-4">
                    <Card.Body as={Container}>
                        <Row>
                            <Col md={6}>
                                <h3 className="fs-5 mb-3"><b>Pick-up:</b> Mon, Nov ##, #### - ##:## PM</h3>
                                <p className="mb-1">Location name</p>
                                <p className="mb-1">123 Fake Street</p>
                                <p>Rochester, NY 14623</p>
                            </Col>
                            <Col md={6}>
                                <h3 className="fs-5 mb-3"><b>Drop-off:</b> Mon, Nov ##, #### - ##:## PM</h3>
                                <p className="mb-1">Location name</p>
                                <p className="mb-1">123 Fake Street</p>
                                <p>Rochester, NY 14623</p>
                            </Col>
                        </Row>
                        <Row className="mt-3">
                            <Col md={6}>
                                <p><a href="#">More Details</a></p>
                            </Col>
                            <Col md={6}>
                                <p className="text-md-end mb-0"><a href="#">Modify / Cancel Reservation</a></p>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            </Container> 
            <Container as={'section'} className="mb-5">
                <h2 className="my-4 fw-bold">Past Reservations</h2>
                <Card className="grey-section border-0 mb-3 px-4">
                    <Card.Body as={Container}>
                        <p className="mb-0"><em>No past reservations yet</em></p>
                    </Card.Body>
                </Card>
            </Container> 
        </main>
    )
}