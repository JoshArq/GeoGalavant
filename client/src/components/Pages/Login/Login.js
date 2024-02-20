import * as React from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default function About() {
    const handleLogin = (event) => {
        console.log("logging in")
    }

    return (
        <Container as={'main'} className="py-5">
            <h1 className="mb-4 fw-bold">Login</h1>
            <Form noValidate onSubmit={handleLogin}>
                <section className="grey-section p-5 rounded">
                    <Form.Group className="mb-3" controlId="username">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="email" placeholder="name@example.com" required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="password" required />
                    </Form.Group>
                </section>
                <section className="my-4 d-flex flex-column align-items-center">
                    <Button type="submit" className="w-50">Login</Button>
                </section>
            </Form>
        </Container>
    )
}