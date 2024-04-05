import React from 'react';
import Container from 'react-bootstrap/Container';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Badge from '../../Badges/Badge.js';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';

export default function Message({token}) {
    const location = useLocation()
    const { ticket, timestamp } = location.state
    const [isValid, setIsValid] = useState(true);

    function markResolved(id) {
        // Send req
        fetch("/api/markMessageResolved", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "auth-token": token
            },
            body: JSON.stringify({
                ticketId: id
            }),
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                setIsValid(true)
            }
            else {
                console.log(data.error)
                setIsValid(false)
            }
        }).catch(error => {
            console.log(error)
            setIsValid(false)
        });
    }

    return (
        <main>
            <Container fluid as={'section'}>
                <Alert variant="danger" className={'text-danger my-3 bg-danger-subtle' + (isValid ? ' d-none' : '')} id="err">
                    There was an issue changing the status. Please refresh to try again.
                </Alert> 
                <p className="mt-3"><Link to="/messages" className="link-underline link-underline-opacity-0"><i className="bi bi-chevron-left me-3 color-primary"></i>Back to Messages</Link></p>
                { !ticket.comment ? <p>This ticket does not exist.</p> :
                    <>
                        <Row>
                            <Col md="auto">
                                <h1>Message #{ticket.ticketid}</h1>
                            </Col>
                            <Col className="d-flex align-items-center">
                                <Button disabled={!ticket.isopen} onClick={() => {markResolved(ticket.ticketid)}}>Mark as Resolved</Button>
                            </Col>
                        </Row>
                        <Badge status={ticket.isopen ? "unresolved" : "resolved"} /> 
                    
                        <p className="mt-4"><b>Date Submitted</b><br/>{timestamp}</p>
                        <p><b>Name</b><br/>{ticket.name}</p>
                        <p><b>Phone</b><br/>{ticket.phone}</p>
                        <p><b>Email</b><br/>{ticket.email}</p>
                        <p><b>Message</b><br/>{ticket.comment}</p>
                    </>
                }
            </Container> 
        </main>
    )
}