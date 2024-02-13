import  React, { useState } from 'react';
import Header from '../../GeoHeader/GeoHeader.js';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import './Contact.scss';

//TODO
// - form submission
// - favicon/page title stuff
// - images on other pages
// - real faq content

export default function Contact() {
    // Handling contact form
    const [isValid, setIsValid] = useState(true);
    const [isSent, setIsSent] = useState(false);
    const handleContact = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            setIsValid(false);
            
        }
        else {
            setIsValid(true);
            setIsSent(true);
        }
    };

    return (
        <main>
            <Header title="Contact" />
            <Container as={'section'} className="py-5">
                <h2 className="fw-bold">Frequently Asked Questions</h2>
                <Accordion className="mt-4">
                    <Accordion.Item eventKey="0" className="rounded-0 border-start-0 border-end-0 border-2">
                        <Accordion.Header>What do I need to sign up for GyroGoGo? </Accordion.Header>
                        <Accordion.Body>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                        minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                        aliquip ex ea commodo consequat. Duis aute irure dolor in
                        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                        culpa qui officia deserunt mollit anim id est laborum.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1" className="rounded-0 border-start-0 border-end-0 border-2">
                        <Accordion.Header>You declined my application for membership. What can I do about this?</Accordion.Header>
                        <Accordion.Body>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                        eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                        minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                        aliquip ex ea commodo consequat. Duis aute irure dolor in
                        reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                        pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                        culpa qui officia deserunt mollit anim id est laborum.
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Container>
            <section className="grey-section py-5">
                <Container>
                    <h2 className="fw-bold">Contact Us</h2>
                    <Row>
                        <Col md={10} lg={9} className="my-4">
                            <p>Our Customer Service staff will be happy to answer any questions you may have. Please use the form below to reach us. Our regular office hours are Monday through Friday, 8:00 AM – 8:00 PM in the Eastern time zone. Members will receive a 24-hour emergency service number in their rental confirmation. </p>
                        </Col>
                        <Col md={6}>
                            <Card className="py-3 px-1 mb-4 border-2">
                                <Card.Body>
                                    { isValid ? '' : // Error alert
                                        <Alert variant="danger" className="text-danger bg-danger-subtle">
                                            Something is wrong with your submission. Please try again.
                                        </Alert> 
                                    }
                                    { isSent ?  // Error alert
                                        <Alert variant="success" className="text-success bg-success-subtle">
                                            Your ticket has been submitted! A representative will reach out to you shortly.
                                        </Alert> 
                                        : ''
                                    }
                                    <Form noValidate onSubmit={handleContact}>
                                        <Form.Group className="mb-3" controlId="contact-email">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control type="email" placeholder="name@example.com" required />
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="contact-phone">
                                            <Form.Label>Phone</Form.Label>
                                            <Form.Control type="tel" placeholder="585-555-1234" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" required />
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="contact-message">
                                            <Form.Label>Message</Form.Label>
                                            <Form.Control as="textarea" placeholder="Let us know what you need help with!" required/>
                                        </Form.Group>
                                        <Button type="submit" className="float-end">Submit form</Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </section>
        </main>
    )
}