import * as React from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default function Apply() {
    const handleCreateAcct = (event) => {
        console.log("create")
    }

    return (
        <Container as={'main'} className="py-5">
            <h1 className="mb-4 fw-bold">Join GyroGoGo!</h1>
            <p className="mb-4">Fill out all the fields in the form below in order to complete your application for GyroGoGo.</p>
            <Form noValidate onSubmit={handleCreateAcct}>
                <section className="grey-section p-5 rounded">
                    <Form.Group className="mb-3" controlId="username">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" placeholder="jdoe1234" required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" placeholder="name@example.com" required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="password" required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="confirmPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type="password" placeholder="password" required />
                    </Form.Group>
                </section>
                <section className="my-4 d-flex flex-column align-items-end">
                    <Button type="submit">Next</Button>
                </section>
            </Form>
        </Container>
    )
}