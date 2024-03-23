import * as React from 'react';
import { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import './EditPayments.scss';

let form_template = {
}

export default function EditPayments() {
    const form = form_template;
    const [step, setStep] = useState(0);
    const [isValid, setIsValid] = useState(true);
    const [isSent, setIsSent] = useState(false);

    useEffect(() => {
        // let profile = document.getElementById("profile");
        // profile.username.value = "jdoe1234";
    }, [])


    return (
        <Container as={'main'} className="py-5">
            <h1 className="mb-4 fw-bold">Edit Payment Methods</h1>
            <p className="mb-4">Click "save" to save new cards and updates to existing cards.</p>
            <Card className="border-0 grey-section p-4">
                <Card.Body>
                    <div id="cards">
                        <Form id="card-1" className="mb-4">
                            <Row>
                                <Col md={10} lg={11}>
                                    <h2 className="fw-bold mb-3">Credit Card</h2>
                                    <Form.Group className="mb-3" controlId="cardNum">
                                        <Form.Label>Credit Card Number</Form.Label>
                                        <Form.Control type="text" placeholder="1234567890" required />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="cardName">
                                        <Form.Label>Name on Card</Form.Label>
                                        <Form.Control type="text" placeholder="John Doe" required />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="cardExp">
                                        <Form.Label>Credit Card Expiration Date (MM/YY)</Form.Label>
                                        <Form.Control type="text" placeholder="01/25"  pattern="\d{1,2}/\d{2}" required />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="ccvNum">
                                        <Form.Label>CCV</Form.Label>
                                        <Form.Control type="password" placeholder="123" required />
                                    </Form.Group>
                                </Col>
                                <Col md={2} lg={1}>
                                    <Button className="float-end" variant="danger">Delete</Button>
                                </Col>
                            </Row>
                            <hr className="border-2 opacity-100" />
                        </Form>
                        <Form id="card-2" className="mb-4">
                            <Row>
                                <Col md={10} lg={11}>
                                    <h2 className="fw-bold mb-3">Credit Card</h2>
                                    <Form.Group className="mb-3" controlId="cardNum">
                                        <Form.Label>Credit Card Number</Form.Label>
                                        <Form.Control type="text" placeholder="1234567890" required />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="cardName">
                                        <Form.Label>Name on Card</Form.Label>
                                        <Form.Control type="text" placeholder="John Doe" required />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="cardExp">
                                        <Form.Label>Credit Card Expiration Date (MM/YY)</Form.Label>
                                        <Form.Control type="text" placeholder="01/25"  pattern="\d{1,2}/\d{2}" required />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="ccvNum">
                                        <Form.Label>CCV</Form.Label>
                                        <Form.Control type="password" placeholder="123" required />
                                    </Form.Group>
                                </Col>
                                <Col md={2} lg={1}>
                                    <Button className="float-end" variant="danger">Delete</Button>
                                </Col>
                            </Row>
                            <hr className="border-2 opacity-100" />
                        </Form>
                    </div>
                    <Button>Add New<i className="bi bi-plus mx-2"></i></Button>
                </Card.Body>
            </Card>
            <Button className="float-end">Save</Button>
        </Container>
    )
}