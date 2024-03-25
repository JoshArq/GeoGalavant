import React from 'react';
import Container from 'react-bootstrap/Container';
import Header from '../../GeoHeader/GeoHeader.js';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

export default function ModifyReservation() {
    return (
        <main>
            <Header title="Modify Reservation #1234567" />
            <Container as={'section'}>
                {/* <p><Link to="/customers/customer">Back to customer</Link></p> */}
                <h2 className="mb-3">Upcoming Reservation for Arlene McCoy</h2>
                <Form>
                <Form.Group className="mb-3" controlId="datetime">
                    <Form.Label>Date and Time</Form.Label>
                    <Form.Control type="datetime-local" />
                </Form.Group>
                <Form.Group className="mb-3" controlId="datetime">
                    <Form.Label>Date and Time</Form.Label>
                    <Form.Control type="datetime-local" />
                </Form.Group>
                    <Form.Group className="mb-3" controlId="pickupLocation">
                        <Form.Label>Pick-up Location</Form.Label>
                        <Form.Select name="pickupLocation" required>
                            <option value="">Select...</option>
                            <option value="northweest">Gyrogogo Northwest</option>
                            <option value="nirtheast">Gyrogogo Northeast</option> 
                            <option value="centercity">Gyrogogo Center City</option> 
                            <option value="southeast">Gyrogogo Southeast</option> 
                            <option value="airport">Gyrogogo Airport</option>                    
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="dropoffLocation">
                        <Form.Label>Drop-off Location</Form.Label>
                        <Form.Select name="dropoffLocation" required>
                            <option value="">Select...</option>
                            <option value="northweest">Gyrogogo Northwest</option>
                            <option value="nirtheast">Gyrogogo Northeast</option> 
                            <option value="centercity">Gyrogogo Center City</option> 
                            <option value="southeast">Gyrogogo Southeast</option> 
                            <option value="airport">Gyrogogo Airport</option>                    
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="gyrocarNumber">
                        <Form.Label>Gyrocar Number</Form.Label>
                        <Form.Select name="gyrocarNumber" required>
                            <option value="">Select...</option>
                            <option value="123456">123456</option>
                            <option value="213454">213454</option>
                            <option value="765432">765432</option>  
                            <option value="948372">948372</option> 
                            <option value="222222">222222</option>                    
                        </Form.Select>
                    </Form.Group>
                    <Button variant="danger" className="mx-3 my-2">Cancel Reservation</Button>
                    <Button variant="secondary" className="mx-3 my-2" as={Link} to="/customers/customer">Cancel Changes</Button>
                    <Button variant="primary" className="mx-3 my-2">Save Changes</Button>
            </Form>
            </Container> 

        </main>
    )
}