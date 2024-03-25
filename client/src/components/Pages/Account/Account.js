import React from 'react';
import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Header from '../../GeoHeader/GeoHeader.js';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { Link } from 'react-router-dom';

export default function Account({token}) {
    const [userData, setUserData] = useState({driversLicense:{}});
    const [cards, setCards] = useState([]);
    const [isValid, setIsValid] = useState(true);

    // Get data
    useEffect(() => {
        // Get credit cards
        fetch("/api/getCreditCards", {
            headers: {
              "auth-token": token
            }
          })
          .then((res) => res.json())
          .then((data) => {
                if(data.error || !data.cards) {
                    setIsValid(false);
                    console.log(data.error);
                }
                else {
                    setCards(data.cards);
                }
          }).catch(error => {
            setIsValid(false);
            console.log(error);
          });
          // Get user data
        fetch("/api/getUserData", {
            headers: {
              "auth-token": token
            }
          })
          .then((res) => res.json())
          .then((data) => {
                if(data.error) {
                    setIsValid(false);
                    console.log(data.error);
                    console.log(data)
                }
                else {
                    setUserData(data);
                }
          }).catch(error => {
            setIsValid(false);
            console.log(error);
          });
    }, [])

    return (
        <main>
            <Header title="Your Account" />
            <Container as={'section'}>
                <h2 className="my-4 fw-bold">Profile</h2>
                <Alert variant="danger" className={'text-danger mb-3 bg-danger-subtle' + (isValid ? ' d-none' : '')} id="err">
                    There was an issue retrieving your data. Please refresh to try again.
                </Alert> 
                <Card className="grey-section border-0 mb-3 p-4">
                    <Card.Body as={Container}>
                        <Row>
                            <Col md={11}>
                                <h3 className="mb-3 fs-5 fw-bold">Personal Information</h3>
                                <p className="fw-bold mb-1">Email</p>
                                <p>{userData.email}</p>
                                <p className="fw-bold mb-1">Username</p>
                                <p>{userData.username}</p>
                                <p className="fw-bold mb-1">Driver's License</p>
                                <p className="mb-1">Name: {userData.driversLicense.firstName ? userData.driversLicense.firstName + " " + userData.driversLicense.lastName : ''}</p>
                                <p className="mb-1">State: {userData.driversLicense.state}</p>
                                <p className="mb-1">Expires: {userData.driversLicense.expirationDate}</p>
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
                                    {cards.map((card) => { return (
                                        <Col sm={6} md={4}>
                                            <p className="mb-1 fw-bold">{card.lastNumbers}</p>
                                            <p className="mb-1">{card.fullname}</p>
                                            <p className="mb-1">Expires {card.expirationDate}</p>
                                        </Col>
                                    )})}
                                </Row>
                            </Col>
                            <Col md={1}>
                                <Button className="float-end" as={Link} to="/account/editPayments">Edit</Button>
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