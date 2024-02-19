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

export default function Contact() {
    // Handling contact form
    const [isValid, setIsValid] = useState(true);
    const [isSent, setIsSent] = useState(false);
    const handleContact = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget;
        // Error in validation (validation is mostly handled via HTML elements + browser)
        if (form.checkValidity() === false) {
            setIsValid(false);
            setIsSent(false);
        }
        // Valid input, sending comment
        else {
            fetch("/api/submitContactForm", {
                method: 'POST',
                body: JSON.stringify({
                    name: form.contactName.value, 
                    phone: form.contactPhone.value, 
                    email: form.contactEmail.value, 
                    comment: form.contactMessage.value
                }),
            })
            .then((res) => res.json())
            .then((data) => {
                // Server returned successful
                if(data.success) {
                    setIsValid(true);
                    setIsSent(true);
                    // Clearing out inputs
                    form.contactName.value = '';
                    form.contactPhone.value = '';
                    form.contactEmail.value = '';
                    form.contactMessage.value = '';
                }
                // Server returned unsuccessful
                else {
                    setIsValid(false);
                    setIsSent(false);
                }
            // Error with server
            }).catch(error => {
                setIsValid(false);
                setIsSent(false);
            });
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
                        All you need to do is provide some basic information on yourself plus your driver’s license information and a valid credit card. You will receive your approval within 24-72 hours.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1" className="rounded-0 border-start-0 border-end-0 border-2">
                        <Accordion.Header>You declined my application for membership. What can I do about this?</Accordion.Header>
                        <Accordion.Body>
                        When your application was declined, you were provided a reason for the decision. You need to rectify this problem. Most commonly this is because either a license or a credit card has expired. If you provide us with current credentials, we are happy to move your membership forward. 
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="2" className="rounded-0 border-start-0 border-end-0 border-2">
                        <Accordion.Header>What is the process for renting a gyrocar?</Accordion.Header>
                        <Accordion.Body>
                            Your first step is to apply for a membership in GyroGoGo on this website. You will have access to our rental functions as soon as your information has been verified. The step-by-step reservation process is clear and easy to use; just select your desired pick up and drop off locations and start/return dates and times. You’ll receive a confirmation email with pick up instructions and the necessary access code for your vehicle.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="3" className="rounded-0 border-start-0 border-end-0 border-2">
                        <Accordion.Header>Do I need a special kind of license to drive a gyrocar?</Accordion.Header>
                        <Accordion.Body>
                            No. A current, regular driver’s license is all that is required to legally drive a gyrocar.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="4" className="rounded-0 border-start-0 border-end-0 border-2">
                        <Accordion.Header>I have never ridden a motorcycle. How will I be able to safely drive a gyrocar?</Accordion.Header>
                        <Accordion.Body>
                            A gyrocar uses a gyroscope for balance, so you do not need to learn the kind of skills required for riding a motorcycle. Driving a gyrocar is much like driving your automobile, just more slender and more nimble. 
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="5" className="rounded-0 border-start-0 border-end-0 border-2">
                        <Accordion.Header>How far in advance can I make reservations for a GyroGoGo car?</Accordion.Header>
                        <Accordion.Body>
                            Reservations are allowed up to one month in advance.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="6" className="rounded-0 border-start-0 border-end-0 border-2">
                        <Accordion.Header>I regularly commute to the county courthouse. Can I make reservations for several trips at the same time? </Accordion.Header>
                        <Accordion.Body>
                            Yes, a member may have more than one reservation booked at a time. 
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="7" className="rounded-0 border-start-0 border-end-0 border-2">
                        <Accordion.Header>Do I have to return the gyrocar to the same location I picked it up from? </Accordion.Header>
                        <Accordion.Body>
                            No, you are not required to return the vehicle to the same location. During the rental process you will be asked the return destination.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="8" className="rounded-0 border-start-0 border-end-0 border-2">
                        <Accordion.Header>Is there any limit to the distance from the pick up site I can drive the gyrocar? </Accordion.Header>
                        <Accordion.Body>
                            Yes, our vehicles are geo-fenced to operate no more than 20 miles outside Monroe County. The car will shut off if you exceed this perimeter. 
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="9" className="rounded-0 border-start-0 border-end-0 border-2">
                        <Accordion.Header>Is there a limit to the number of hours or days I can rent the gyrocar? </Accordion.Header>
                        <Accordion.Body>
                            You can rent a GyroGoGo car for the time duration that meets you needs up to one month. If you wish to reserve the car for longer, you will need to make sequential reservations.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="10" className="rounded-0 border-start-0 border-end-0 border-2">
                        <Accordion.Header>Can I change the date after I’ve made a reservation?</Accordion.Header>
                        <Accordion.Body>
                            Yes. You always have the ability to view and edit a reservation when signed into your account.
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="11" className="rounded-0 border-start-0 border-end-0 border-2">
                        <Accordion.Header>Can I recharge the gyrocar at and EV recharge station? </Accordion.Header>
                        <Accordion.Body>
                            Yes, the gyrocars can be charged at any standard EV station. However, other vehicles cannot access the GyroGoGo chargers; the chargers have a deterrent feature that prevent such use. 
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="12" className="rounded-0 border-start-0 border-end-0 border-2">
                        <Accordion.Header>What do I do if there is a mechanical problem during my rental?</Accordion.Header>
                        <Accordion.Body>
                            Just call our 800 Customer Service number and we will promptly send a mechanic with a replacement vehicle to assist you.
                        </Accordion.Body>
                    </Accordion.Item>

                </Accordion>
            </Container>
            <section className="grey-section py-5" id="contact">
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
                                    { isSent ?  // Message sent alert
                                        <Alert variant="success" className="text-success bg-success-subtle">
                                            Your ticket has been submitted! A representative will reach out to you shortly.
                                        </Alert> 
                                        : ''
                                    }
                                    <Form noValidate onSubmit={handleContact}>
                                        <Form.Group className="mb-3" controlId="contactName">
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control type="text" placeholder="John Doe" required />
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="contactEmail">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control type="email" placeholder="name@example.com" required />
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="contactPhone">
                                            <Form.Label>Phone</Form.Label>
                                            <Form.Control type="tel" placeholder="585-555-1234" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" required />
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="contactMessage">
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