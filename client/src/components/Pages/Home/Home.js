import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import front from '../../../assets/Car-Front.jpg';
import side from '../../../assets/Car-Side.jpg';
import interior from '../../../assets/Car-Interior.jpg';
import rear from '../../../assets/Car-Rear.jpg';
import './Home.scss'

export default function About() {
    return (
        <main>
            <Container as={'header'}>
                <Row>
                    <Col md={{ span: 8, order: 'last' }}>
                        <Image src={front} alt="Front end of a parked Gyrocar" className="h-100" fluid/>
                    </Col>
                    <Col md={{ span: 4, order: 'first' }} className="p-4 d-flex flex-column justify-content-center">
                        <h1 className="fw-bold">Need a ride?</h1>
                        <p>Rent an easy-to-drive gyrocar for your local commuting needs. Become a GyroGoGo member and enjoy the very best way to get around town!</p>
                        <Button>APPLY NOW</Button>
                    </Col>
                </Row>
            </Container>
            <section className="grey-section py-5">
                <Container>
                    <h2 className="mb-4 fw-semibold">Our Services</h2>
                    <Row>
                        <Col md="4">
                            <Card className="py-3 px-1 mb-4 text-center shadow">
                                <Card.Body>
                                    <Card.Title as={'h3'} className="fs-4 fw-semibold mb-3">
                                        Better Transportation
                                    </Card.Title>
                                    <Card.Text>
                                        Navigate city traffic with ease. Parking is a breeze. 
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md="4">
                            <Card className="py-3 px-1 mb-4 text-center shadow">
                                <Card.Body>
                                    <Card.Title as={'h3'} className="fs-4 fw-semibold mb-3">
                                        Multiple Locations
                                    </Card.Title>
                                    <Card.Text>
                                        Five convenient locations for pick up and drop off!
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md="4">
                            <Card className="py-3 px-1 mb-4 text-center shadow">
                                <Card.Body>
                                    <Card.Title as={'h3'} className="fs-4 fw-semibold mb-3">
                                        Customer Support
                                    </Card.Title>
                                    <Card.Text>
                                        Members will receive a 24-hour emergency service number in their rental confirmation.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>
            <section className="py-5">
                <Container>
                    <h2 className="mb-4 fw-semibold">Benefits</h2>
                    <Row>
                        <Col md="4">
                            <Card className="mb-4 text-center shadow">
                                <Card.Img variant="top" src={front} alt="PLACEHOLDER" />
                                <Card.Body className="py-3 px-1">
                                    <Card.Title as={'h3'} className="fs-4 fw-semibold mb-3">
                                        Avoid Bad Weather
                                    </Card.Title>
                                    <hr className="mb-3 w-25 mx-auto border border-black opacity-100" />
                                    <Card.Text>
                                        Arrive at your destination in comfort and looking professional regardless of the weather.
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md="4">
                            <Card className="mb-4 text-center shadow">
                                <Card.Img variant="top" src={front} alt="PLACEHOLDER" />
                                <Card.Body className="py-3 px-1">
                                    <Card.Title as={'h3'} className="fs-4 fw-semibold mb-3">
                                        Easier Parking
                                    </Card.Title>
                                    <hr className="mb-3 w-25 mx-auto border border-black opacity-100" />
                                    <Card.Text>
                                        Gyrocars are authorized to park in designated motorcycle spaces. 
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md="4">
                            <Card className="mb-4 text-center shadow">
                                <Card.Img variant="top" src={front} alt="PLACEHOLDER" />
                                <Card.Body className="py-3 px-1">
                                    <Card.Title as={'h3'} className="fs-4 fw-semibold mb-3">
                                        Make Deliveries
                                    </Card.Title>
                                    <hr className="mb-3 w-25 mx-auto border border-black opacity-100" />
                                    <Card.Text>
                                    The bus and the subway just aren’t going to work. Light deliveries are a piece of cake with GyroGoGo!
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>
            <section className="grey-section py-5">
                <Container>
                    <h2 className="mb-4 fw-semibold">The Gyrocar</h2>
                    <Row className="text-center">
                        <Col md={8} className="d-flex flex-column justify-content-center">
                            <Image src={side} rounded fluid className="shadow mb-2" />
                            <p>Side View</p>
                        </Col>
                        <Col md={4}>
                            <Image src={interior} rounded fluid className="shadow mb-2" />
                            <p>Interior View</p>
                            <Image src={rear} rounded fluid className="shadow mb-2" />
                            <p>Rear View</p>
                        </Col>
                    </Row>
                </Container>
            </section>
        </main>
    )
}