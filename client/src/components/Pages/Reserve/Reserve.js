import React from 'react';
import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';

let form_template = {}

export default function Reserve() {
    const form = form_template;
    const [step, setStep] = useState(0);
    
    return (
        <Container as={'main'} className="py-5">
            <Form noValidate id="application">
                <div className={'' + (step > 0 ? '' : ' d-none')} id="progBar">
                    <h2 className="fs-5 fw-bold mb-3" id="step-heading">Step {step + 1} of 4</h2>
                    <ProgressBar className="mb-4" now={step/4 * 100} label={`${step/4 * 100}%`} id="progress" />
                </div>
                <section className="" id="step-0">
                    <h1 className="mb-4 fw-bold">Make a Reservation</h1>
                    <p className="mt-5 mb-4">Choose a date and time for picking up and dropping off a gyrocar and we’ll find you available locations!</p>
                    <Card className="grey-section border-0">
                        <Card.Body as={Container}>
                            <Row>
                                <Col md={6} className="py-2 px-4">
                                    <Form.Group controlId="pickup">
                                        <Form.Label>Pick-up Date and Time</Form.Label>
                                        <Form.Control type="datetime-local" required />
                                    </Form.Group>
                                </Col>
                                <Col md={6} className="py-2 px-4">
                                    <Form.Group controlId="dropoff">
                                        <Form.Label>Drop-off Date and Time</Form.Label>
                                        <Form.Control type="datetime-local" required />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                    <div className="d-flex justify-content-end mt-4">
                        <Button variant="primary" id="search">Search</Button>
                    </div>
                </section>
                <section className="d-none" id="step-1">
                    <h1 className="mb-4 fw-bold">Choose Pick-up Location</h1>
                    <p>5 results for Monroe County on ##/##/####</p>
                    <Container>
                        <Row>
                            <Col md={4} className="pb-4 pb-md-0 pe-md-2">
                                <Form.Group controlId="pickupLoc">
                                    <Card className="grey-section border-0" as={Form.Label} for="test1">
                                        <Card.Body as={Container}>
                                            <Row>
                                                <Col xs={9}>
                                                    <p><strong>1. LOCATION 1</strong></p>
                                                    <p className="m-0">123 Fake street</p>
                                                    <p className="m-0">Rochester, NY</p>
                                                </Col>
                                                <Col xs={3} className="d-flex align-items-center justify-content-end">
                                                    <Form.Check name="pickupLoc" type="radio" value="test1" id="test1" required/>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                    <Card className="grey-section border-0" as={Form.Label} for="test2">
                                        <Card.Body as={Container}>
                                            <Row>
                                                <Col xs={9}>
                                                    <p><strong>2. LOCATION 2</strong></p>
                                                    <p className="m-0">123 Fake street</p>
                                                    <p className="m-0">Rochester, NY</p>
                                                </Col>
                                                <Col xs={3} className="d-flex align-items-center justify-content-end">
                                                    <Form.Check name="pickupLoc" type="radio" value="test2" id="test2" required/>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                    <Card className="grey-section border-0" as={Form.Label} for="test3">
                                        <Card.Body as={Container}>
                                            <Row>
                                                <Col xs={9}>
                                                    <p><strong>3. LOCATION 3</strong></p>
                                                    <p className="m-0">123 Fake street</p>
                                                    <p className="m-0">Rochester, NY</p>
                                                </Col>
                                                <Col xs={3} className="d-flex align-items-center justify-content-end">
                                                    <Form.Check name="pickupLoc" type="radio" value="test3" id="test3" required/>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </Form.Group>
                            </Col>
                            <Col md={8}>
                                <Card className="grey-section p-5"><p>map</p></Card>
                            </Col>
                        </Row>
                    </Container>
                </section>
                <section className="d-none" id="step-2">
                    <h1 className="mb-4 fw-bold">Choose Drop-off Location</h1>
                    <p>5 results for Monroe County on ##/##/####</p>
                    <Container>
                        <Row>
                            <Col md={4} className="pb-4 pb-md-0 pe-md-2">
                                <Form.Group controlId="pickupLoc">
                                    <Card className="grey-section border-0" as={Form.Label} for="test4">
                                        <Card.Body as={Container}>
                                            <Row>
                                                <Col xs={9}>
                                                    <p><strong>1. LOCATION 1</strong></p>
                                                    <p className="m-0">123 Fake street</p>
                                                    <p className="m-0">Rochester, NY</p>
                                                </Col>
                                                <Col xs={3} className="d-flex align-items-center justify-content-end">
                                                    <Form.Check name="pickupLoc" type="radio" value="test4" id="test4" required/>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                    <Card className="grey-section border-0" as={Form.Label} for="test5">
                                        <Card.Body as={Container}>
                                            <Row>
                                                <Col xs={9}>
                                                    <p><strong>2. LOCATION 2</strong></p>
                                                    <p className="m-0">123 Fake street</p>
                                                    <p className="m-0">Rochester, NY</p>
                                                </Col>
                                                <Col xs={3} className="d-flex align-items-center justify-content-end">
                                                    <Form.Check name="pickupLoc" type="radio" value="test5" id="test5" required/>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                    <Card className="grey-section border-0" as={Form.Label} for="test6">
                                        <Card.Body as={Container}>
                                            <Row>
                                                <Col xs={9}>
                                                    <p><strong>3. LOCATION 3</strong></p>
                                                    <p className="m-0">123 Fake street</p>
                                                    <p className="m-0">Rochester, NY</p>
                                                </Col>
                                                <Col xs={3} className="d-flex align-items-center justify-content-end">
                                                    <Form.Check name="pickupLoc" type="radio" value="test6" id="test6" required/>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </Form.Group>
                            </Col>
                            <Col md={8}>
                                <Card className="grey-section p-5"><p>map</p></Card>
                            </Col>
                        </Row>
                    </Container>
                </section>
                <section className="d-none" id="step-3">
                    <h1 className="mb-4 fw-bold">Payment</h1>
                    <Container>
                        <Row>
                            <Col md={6} lg={4} className="d-flex align-items-stretch">
                                <Card className="border-0 grey-section py-4 mb-3 mb-md-0">
                                    <Card.Body>
                                        <h3 className="fw-bold fs-5">Reservation Details</h3>
                                        <h4 className="fw-bold fs-6 mt-4">Dates & Times</h4>
                                        <p>Pick-up: Mon, Nov ##, #### - ##:## PM</p>
                                        <p>Drop-off: Mon, Nov ##, #### - ##:## PM</p>
                                        <h4 className="fw-bold fs-6 mt-4">Pick-up Location</h4>
                                        <p className="m-0">Location name</p>
                                        <p className="m-0">123 Fake St</p>
                                        <p>Rochester, NY</p>
                                        <h4 className="fw-bold fs-6 mt-4">Drop-off Location</h4>
                                        <p className="m-0">Location name</p>
                                        <p className="m-0">123 Fake St</p>
                                        <p>Rochester, NY</p>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={6} lg={8}>
                                <Card className="grey-section border-0 mb-3 py-4 px-lg-5">
                                    <Card.Body as={Container}>
                                        <Row>
                                            <Col lg={6}>
                                                <h3 className="fw-bold fs-5">Total Cost:</h3>
                                                <p className="fw-bold fs-1">$75.99</p>
                                            </Col>
                                            <Col lg={6}>
                                                <p>Breakdown</p>
                                                <hr className="border-2 opacity-100" />
                                                <p>Subtotal: <span className="float-end">$60.00</span></p>
                                                <p>Taxes & Fees: <span className="float-end">$15.99</span></p>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                                <Card className="grey-section border-0 py-4 px-lg-5">
                                    <Card.Body>
                                        <h3 className="fw-bold fs-5">Choose Payment</h3>
                                        <p>Gyrogogo accepts Visa, Mastercard, Discover, and American Express.</p>
                                        <Form.Group className="mt-4" controlId="paymentMethod">
                                            <Form.Label className="m-0">Payment Method</Form.Label>
                                            <hr className="border-2 opacity-100" />
                                            <Form.Check name="paymentMethod" type="radio" label="Card 1" value="card1" required/>
                                            <Form.Check name="paymentMethod" type="radio" label="Card 2" value="card2" required/>
                                        </Form.Group>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </section>
                <section className="d-none" id="done">
                    <h1 className="mb-4 fw-bold">Reservation Successful</h1>
                    <p>Your reservation number is #####. Use this code to unlock your Gyrocar.</p>
                    <Card className="grey-section border-0 my-4 p-4">
                        <Card.Body as={Container}>
                            <h3 className="fw-bold fs-5">Choose Payment</h3>
                            <Row>
                                <Col lg={6}>
                                    <h4 className="fw-bold fs-6 mt-4">Dates & Times</h4>
                                    <p>Pick-up: Mon, Nov ##, #### - ##:## PM</p>
                                    <p>Drop-off: Mon, Nov ##, #### - ##:## PM</p>
                                </Col>
                                <Col md={6} lg={3}>
                                    <h4 className="fw-bold fs-6 mt-4">Pick-up Location</h4>
                                    <p className="m-0">Location name</p>
                                    <p className="m-0">123 Fake St</p>
                                    <p>Rochester, NY</p>
                                </Col>
                                <Col md={6} lg={3}>
                                    <h4 className="fw-bold fs-6 mt-4">Drop-off Location</h4>
                                    <p className="m-0">Location name</p>
                                    <p className="m-0">123 Fake St</p>
                                    <p>Rochester, NY</p>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                    <p>Go to your <Link to="/account">account</Link> to view, modify, or cancel your reservation.</p>
                </section>
                <div className={'my-4 d-flex justify-content-between' + (step > 0 ? '' : ' d-none')} id="progBtns">
                    <Button variant="primary" id="previous">Previous</Button>
                    <Button variant="primary" id="next">Next</Button>
                </div>
            </Form>
        </Container> 
    )
}