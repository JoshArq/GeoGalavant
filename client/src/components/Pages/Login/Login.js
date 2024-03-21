import  React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { useNavigate } from "react-router-dom";

export default function Login({saveData, customers}) {
    const [isValid, setIsValid] = useState(true);
    let navigate = useNavigate();
    
    const handleLogin = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget;// Error in validation (validation is mostly handled via HTML elements + browser)
        if (form.checkValidity() === false) {
            setIsValid(false);
        }
        // Valid input, logging in
        else { 
            fetch("/api/login", {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: form.username.value, 
                    password: form.password.value, 
                }),
            })
            .then((res) => res.json())
            .then((data) => {
                if(data.success) {
                    setIsValid(true);
                    
                    // Save user data
                    saveData(data);

                    // Redirect to acct page if user
                    if (customers.includes(data.role)) {
                        navigate("/account");
                    }
                    else {
                        navigate("/employee/account")
                    }
                }
                // Server returned unsuccessful
                else {
                    setIsValid(false);
                }
            }).catch(error => {
                console.log(error);
                setIsValid(false);
            });
        }
    }

    return (
        <Container as={'main'} className="py-5">
            <h1 className="mb-4 fw-bold">Login</h1>
            <Form noValidate onSubmit={handleLogin}>
                { isValid ? '' : // Error alert
                    <Alert variant="danger" className="text-danger bg-danger-subtle">
                        Something is wrong with your submission. Please try again.
                    </Alert> 
                }
                <section className="grey-section p-5 rounded">
                    <Form.Group className="mb-3" controlId="username">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" placeholder="jdoe1234" required />
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