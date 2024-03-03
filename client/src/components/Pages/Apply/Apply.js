import * as React from 'react';
import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Button from 'react-bootstrap/Button';
import tos from '../../../assets/GyroGoGo Rental Terms and Conditions.pdf';

// Outline for handling form data storage until we submit
let form_template = {
    data: {
        
    }
}

export default function Apply() {
    const form = form_template;
    const [step, setStep] = useState(0);

    useEffect(() => {
        document.getElementById("previous").setAttribute("disabled", "disabled")
    }, [])


    const handleCreateAcct = (event) => {
        console.log("create")
        console.log(event)
    }

    const handleNext = () => {
        let nextBtn = document.getElementById("next");
        let prevBtn = document.getElementById("previous");

        // Disable everything so we can process
        nextBtn.setAttribute("disabled", "disabled");
        prevBtn.setAttribute("disabled", "disabled");

        // Variables for step so we don't get caught up in weird state stuff
        let oldStep = step;
        let newStep = oldStep + 1;

        // Validate current step + save results

        // Check for submission case
        if (oldStep == 3) {
            handleCreateAcct()
            return;
        }

        // Increment step number
        setStep(step + 1)

        // Next / Prev button de/activation so it can't go out of bounds 
        if (newStep == 1) {
            prevBtn.removeAttribute("disabled");
        }
        else if (newStep == 3) {
            nextBtn.textContent = "Submit";
        }

        // Hide old step / show new step
        document.getElementById("step-"+ (oldStep)).classList.add("d-none");
        document.getElementById("step-"+ newStep).classList.remove("d-none");

        // Reactivate btns
        nextBtn.removeAttribute("disabled");
        if (newStep != 0) {
            prevBtn.removeAttribute("disabled");
        }
    }

    const handlePrev = () => {
        let nextBtn = document.getElementById("next");
        let prevBtn = document.getElementById("previous");

        // Check for invalid backing
        if (step == 0) {
            return;
        }
        
        // Disable everything so we can process
        nextBtn.setAttribute("disabled", "disabled");
        prevBtn.setAttribute("disabled", "disabled");

        // Variables for step so we don't get caught up in weird state stuff
        let oldStep = step;
        let newStep = oldStep - 1;

        // Save results (no validation; only really needs to happen on next and could cause frustration on prev)

        // Decrement step number
        setStep(step - 1)

        // Next / Prev button de/activation so it can't go out of bounds 
        if (newStep == 0) {
            prevBtn.setAttribute("disabled", "disabled");
        }
        else if (oldStep == 3) {
            nextBtn.textContent = "Next";
        }

        // Hide old step / show new step
        document.getElementById("step-"+ (oldStep)).classList.add("d-none");
        document.getElementById("step-"+ newStep).classList.remove("d-none");

        // Reactivate btns
        nextBtn.removeAttribute("disabled");
        if (newStep != 0) {
            prevBtn.removeAttribute("disabled");
        }
    }

    return (
        <Container as={'main'} className="py-5">
            <h1 className="mb-4 fw-bold">Join GyroGoGo!</h1>
            <p className="mb-4">Fill out all the fields in the form below in order to complete your application for GyroGoGo.</p>
            <Form noValidate onSubmit={handleNext}>
                <h2 className="fs-5 fw-bold mb-3">Step {step + 1} of 4</h2>
                <ProgressBar className="mb-4" now={step/4 * 100} label={`${step/4 * 100}%`} id="progress" />
                <section className="grey-section p-5 rounded" id="step-0">
                    <h3 className="mb-4 fw-bold">Profile Information</h3>
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
                <section className="grey-section p-5 rounded d-none" id="step-1">
                    <h3 className="mb-4 fw-bold">Driver's License Information</h3>
                    <Form.Group className="mb-3" controlId="firstName">
                        <Form.Label>First Name (Same as Driver's License)</Form.Label>
                        <Form.Control type="text" placeholder="John" required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="lastName">
                        <Form.Label>Last Name (Same as Driver's License)</Form.Label>
                        <Form.Control type="text" placeholder="Doe" required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="state">
                        <Form.Label>Driver's License State</Form.Label>
                        <Form.Select required>
                            <option>Select...</option>
                            <option value="AL">Alabama</option>
                            <option value="AK">Alaska</option>
                            <option value="AZ">Arizona</option>
                            <option value="AR">Arkansas</option>
                            <option value="CA">California</option>
                            <option value="CO">Colorado</option>
                            <option value="CT">Connecticut</option>
                            <option value="DE">Delaware</option>
                            <option value="DC">District Of Columbia</option>
                            <option value="FL">Florida</option>
                            <option value="GA">Georgia</option>
                            <option value="HI">Hawaii</option>
                            <option value="ID">Idaho</option>
                            <option value="IL">Illinois</option>
                            <option value="IN">Indiana</option>
                            <option value="IA">Iowa</option>
                            <option value="KS">Kansas</option>
                            <option value="KY">Kentucky</option>
                            <option value="LA">Louisiana</option>
                            <option value="ME">Maine</option>
                            <option value="MD">Maryland</option>
                            <option value="MA">Massachusetts</option>
                            <option value="MI">Michigan</option>
                            <option value="MN">Minnesota</option>
                            <option value="MS">Mississippi</option>
                            <option value="MO">Missouri</option>
                            <option value="MT">Montana</option>
                            <option value="NE">Nebraska</option>
                            <option value="NV">Nevada</option>
                            <option value="NH">New Hampshire</option>
                            <option value="NJ">New Jersey</option>
                            <option value="NM">New Mexico</option>
                            <option value="NY">New York</option>
                            <option value="NC">North Carolina</option>
                            <option value="ND">North Dakota</option>
                            <option value="OH">Ohio</option>
                            <option value="OK">Oklahoma</option>
                            <option value="OR">Oregon</option>
                            <option value="PA">Pennsylvania</option>
                            <option value="RI">Rhode Island</option>
                            <option value="SC">South Carolina</option>
                            <option value="SD">South Dakota</option>
                            <option value="TN">Tennessee</option>
                            <option value="TX">Texas</option>
                            <option value="UT">Utah</option>
                            <option value="VT">Vermont</option>
                            <option value="VA">Virginia</option>
                            <option value="WA">Washington</option>
                            <option value="WV">West Virginia</option>
                            <option value="WI">Wisconsin</option>
                            <option value="WY">Wyoming</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="licenseNumber">
                        <Form.Label>Driver's License ID Number</Form.Label>
                        <Form.Control type="text" placeholder="1234567890" required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="licsenseExp">
                        <Form.Label>Driver's License Experiation Date (MM/DD/YYYY)</Form.Label>
                        <Form.Control type="text" placeholder="01/02/2025"  pattern="\d{1,2}/\d{1,2}/\d{4}" required />
                    </Form.Group>
                </section>
                <section className="grey-section p-5 rounded d-none" id="step-2">
                    <h3 className="mb-4 fw-bold">Credit Card Information</h3>
                    <Form.Group className="mb-3" controlId="cardNum">
                        <Form.Label>Credit Card Number</Form.Label>
                        <Form.Control type="number" placeholder="1234567890" required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="cardName">
                        <Form.Label>Name on Card</Form.Label>
                        <Form.Control type="text" placeholder="John Doe" required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="cardExp">
                        <Form.Label>Credit Card Experiation Date (MM/YY)</Form.Label>
                        <Form.Control type="text" placeholder="01/25"  pattern="\d{1,2}/\d{2}" required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="ccv">
                        <Form.Label>CCV</Form.Label>
                        <Form.Control type="password" placeholder="123" required />
                    </Form.Group>
                </section>
                <section className="grey-section p-5 rounded d-none" id="step-3">
                    <Form.Group className="mb-3" controlId="appliedBefore">
                        <Form.Label>Have you applied to GyroGoGo before?</Form.Label>
                        <Form.Check name="appliedBefore" type="radio" label="Yes" required/>
                        <Form.Check name="appliedBefore" type="radio" label="No" required/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="terms">
                        <Form.Label>I agree to the <a href={tos} target="_blank">Terms and Conditions</a></Form.Label>
                        <Form.Check name="terms" type="check" label="Yes" required/>
                    </Form.Group>
                </section>
                <section className="my-4 d-flex justify-content-between">
                    <Button variant="primary" id="previous" onClick={() => {handlePrev()}}>Previous</Button>
                    <Button variant="primary" onClick={() => {handleNext()}} id="next">Next</Button>
                </section>
            </Form>
        </Container>
    )
}