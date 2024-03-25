import * as React from 'react';
import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

// Outline for handling form data storage until we submit
// Put here so you can see the structure while debugging :)
let form_template = {
    username: "",
    email: "",
    driversLicense: {
        firstName: "",
        lastName: "",
        state: "",
        ID: "",
        expirationDate: "",
    },
}

export default function EditProfile({token}) {
    const form = form_template;
    const [step, setStep] = useState(0);
    const [userData, setUserData] = useState({driversLicense:{}});
    const [isValid, setIsValid] = useState(true);
    const [isSent, setIsSent] = useState(false);

    
    // Get data
    useEffect(() => {
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
                }
                else {
                    setUserData(data);
                    console.log(data)
                }
            }).catch(error => {
            setIsValid(false);
            console.log(error);
        });
    }, [])


    const handleCreateAcct = () => {
        console.log(form)
        fetch("/api/editUserData", {
            headers: {
                "auth-token": token
            },
            method: 'POST',
            body: JSON.stringify(form),
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                // Show just success message
                setIsSent(true);
                setStep(2);
                document.getElementById("step-heading").innerText = "Completed";
                document.getElementById("progBtns").classList.add("d-none");
                document.getElementById("step-1").classList.add("d-none");
            }
            else {
                document.getElementById("err").innerText = "There was an issue editing your profile. Please try again."
                setIsValid(false);
                setIsSent(false);
            }
        }).catch(error => {
            console.log(error)
            document.getElementById("err").innerText = "There was an issue editing your profile. Please try again."
            setIsValid(false);
            setIsSent(false);
        });

        
    }

    const validateStep = (step) => {
        // Get form data
        let profile = document.getElementById("profile");
        let err = document.getElementById("err");
        // Determine which fields to validate
        switch (step) {
            // If valid, save field. If false, return false.
            case 0:
                // Username
                if(profile.username.checkValidity()) {
                    form.username = profile.username.value;
                }
                else {
                    err.innerText = "Enter a username."
                    setIsValid(false);
                    return false;
                }
                // Email
                if (profile.email.checkValidity()) {
                    form.email = profile.email.value;
                }
                else {
                    err.innerText = "Enter an email of valid format."
                    setIsValid(false);
                    return false;
                }
                // Password
                if (profile.password.value.length > 0) {
                    // Checking confirm password, for the specific feedback
                    if (profile.password.value !== profile.confirmPassword.value) {
                        err.innerText = "Check that your password and confirmation match."
                        setIsValid(false);
                        return false;
                    }
                    form.password = profile.password.value;
                }
                // All good
                setIsValid(true);
                return true;
            case 1: 
                // First name
                if(profile.firstName.checkValidity()) {
                    form.driversLicense.firstName = profile.firstName.value;
                }
                else {
                    err.innerText = "Enter a first name."
                    setIsValid(false);
                    return false;
                }
                // Last name
                if(profile.lastName.checkValidity()) {
                    form.driversLicense.lastName = profile.lastName.value;
                }
                else {
                    err.innerText = "Enter a last name."
                    setIsValid(false);
                    return false;
                }
                // State
                if(profile.state.checkValidity() && profile.state.value.length > 0) {
                    form.driversLicense.state = profile.state.value;
                }
                else {
                    err.innerText = "Select a state."
                    setIsValid(false);
                    return false;
                }
                // DL number
                if(profile.licenseNumber.checkValidity()) {
                    form.driversLicense.ID = profile.licenseNumber.value;
                }
                else {
                    err.innerText = "Enter a driver's license number."
                    setIsValid(false);
                    return false;
                }
                // Exp date
                if(profile.licenseExp.checkValidity()) {
                    let splitDate = profile.licenseExp.value.split('/');
                    let date = new Date();
                    date.setFullYear(parseInt(splitDate[2]), (parseInt(splitDate[0]) - 1), parseInt(splitDate[1]));
                    if(date <= Date.now()) {
                        err.innerText = "Your license must not be expired"
                        setIsValid(false);
                        return false;
                    }
                    form.driversLicense.expirationDate = profile.licenseExp.value;
                }
                else {
                    err.innerText = "Enter an expiration in the format of MM/DD/YYYY"
                    setIsValid(false);
                    return false;
                }
                // All good
                setIsValid(true);
                return true;
        }
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
        // If it returns true, data was valid and saved
        // If false, corrections are needed before proceeding
        // (error msg handled in validation for specific feedback)
        if(!validateStep(oldStep)) {
            // Reactivate buttons
            nextBtn.removeAttribute("disabled");
            if (oldStep !== 0) {
                prevBtn.removeAttribute("disabled");
            }
            return;
        }

        // Check for submission case
        if (oldStep === 1) {
            handleCreateAcct()
            return;
        }

        // Increment step number
        setStep(step + 1)

        // Next / Prev button de/activation so it can't go out of bounds 
        if (newStep === 1) {
            prevBtn.removeAttribute("disabled");
        }
        else if (newStep === 1) {
            nextBtn.textContent = "Save";
        }

        // Hide old step / show new step
        document.getElementById("step-"+ (oldStep)).classList.add("d-none");
        document.getElementById("step-"+ newStep).classList.remove("d-none");

        // Reactivate btns
        nextBtn.removeAttribute("disabled");
        if (newStep !== 0) {
            prevBtn.removeAttribute("disabled");
        }
    }

    const handlePrev = () => {
        let nextBtn = document.getElementById("next");
        let prevBtn = document.getElementById("previous");

        // Check for invalid backing
        if (step === 0) {
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
        if (newStep === 0) {
            prevBtn.setAttribute("disabled", "disabled");
        }
        else if (oldStep === 1) {
            nextBtn.textContent = "Next";
        }

        // Hide error messages for the old step
        setIsValid(true);

        // Hide old step / show new step
        document.getElementById("step-"+ (oldStep)).classList.add("d-none");
        document.getElementById("step-"+ newStep).classList.remove("d-none");

        // Reactivate btns
        nextBtn.removeAttribute("disabled");
        if (newStep !== 0) {
            prevBtn.removeAttribute("disabled");
        }
    }

    return (
        <Container as={'main'} className="py-5">
            <h1 className="mb-4 fw-bold">Edit your profile</h1>
            <p className="mb-4">Review all of the form fields and hit "save" at the end.</p>
            <Form noValidate id="profile">
                <h2 className="fs-5 fw-bold mb-3" id="step-heading">Step {step + 1} of 2</h2>
                <ProgressBar className="mb-4" variant="secondary" now={step/2 * 100} label={`${step/2 * 100}%`} id="progress" />
                <Alert variant="danger" className={'text-danger bg-danger-subtle' + (isValid ? ' d-none' : '')} id="err">
                    Something is wrong with your submission. Please try again.
                </Alert> 
                <Alert variant="success" className={'grey-section p-5 fw-bold d-flex' + (isSent ? '' : ' d-none')} id="sent">
                    <Container>
                        <Row>
                            <Col md={2} className="d-flex justify-content-center align-items-center fs-1">
                                <i className="bi bi-check2-circle"></i>
                            </Col>
                            <Col md={10} className="mt-2 mt-md-0">
                                <p>Your profile changes have been saved.</p>
                            </Col>
                        </Row>
                    </Container>
                </Alert> 
                <section className="grey-section p-5 rounded" id="step-0">
                    <h3 className="mb-4 fw-bold">Profile Information</h3>
                    <Form.Group className="mb-3" controlId="username">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" placeholder="jdoe1234" required defaultValue={userData.username} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" placeholder="name@example.com" required defaultValue={userData.email}/>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control type="password" placeholder="password" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="confirmPassword">
                        <Form.Label>Confirm New Password</Form.Label>
                        <Form.Control type="password" placeholder="password" />
                    </Form.Group>
                </section>
                <section className="grey-section p-5 rounded d-none" id="step-1">
                    <h3 className="mb-4 fw-bold">Driver's License Information</h3>
                    <Form.Group className="mb-3" controlId="firstName">
                        <Form.Label>First Name (Same as Driver's License)</Form.Label>
                        <Form.Control type="text" placeholder="John" required defaultValue={userData.driversLicense.firstName} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="lastName">
                        <Form.Label>Last Name (Same as Driver's License)</Form.Label>
                        <Form.Control type="text" placeholder="Doe" required defaultValue={userData.driversLicense.lastName} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="state">
                        <Form.Label>Driver's License State</Form.Label>
                        <Form.Select name="stateSelect" required>
                            <option value="">Select...</option>
                            <option value="AL" selected={userData.driversLicense.state == "AL"}>Alabama</option>
                            <option value="AK" selected={userData.driversLicense.state == "AK"}>Alaska</option>
                            <option value="AZ" selected={userData.driversLicense.state == "AZ"}>Arizona</option>
                            <option value="AR" selected={userData.driversLicense.state == "AR"}>Arkansas</option>
                            <option value="CA" selected={userData.driversLicense.state == "CA"}>California</option>
                            <option value="CO" selected={userData.driversLicense.state == "CO"}>Colorado</option>
                            <option value="CT" selected={userData.driversLicense.state == "CT"}>Connecticut</option>
                            <option value="DE" selected={userData.driversLicense.state == "DE"}>Delaware</option>
                            <option value="DC" selected={userData.driversLicense.state == "DC"}>District Of Columbia</option>
                            <option value="FL" selected={userData.driversLicense.state == "FL"}>Florida</option>
                            <option value="GA" selected={userData.driversLicense.state == "GA"}>Georgia</option>
                            <option value="HI" selected={userData.driversLicense.state == "HI"}>Hawaii</option>
                            <option value="ID" selected={userData.driversLicense.state == "ID"}>Idaho</option>
                            <option value="IL" selected={userData.driversLicense.state == "IL"}>Illinois</option>
                            <option value="IN" selected={userData.driversLicense.state == "IN"}>Indiana</option>
                            <option value="IA" selected={userData.driversLicense.state == "IA"}>Iowa</option>
                            <option value="KS" selected={userData.driversLicense.state == "KS"}>Kansas</option>
                            <option value="KY" selected={userData.driversLicense.state == "KY"}>Kentucky</option>
                            <option value="LA" selected={userData.driversLicense.state == "LA"}>Louisiana</option>
                            <option value="ME" selected={userData.driversLicense.state == "ME"}>Maine</option>
                            <option value="MD" selected={userData.driversLicense.state == "MD"}>Maryland</option>
                            <option value="MA" selected={userData.driversLicense.state == "MA"}>Massachusetts</option>
                            <option value="MI" selected={userData.driversLicense.state == "MI"}>Michigan</option>
                            <option value="MN" selected={userData.driversLicense.state == "MN"}>Minnesota</option>
                            <option value="MS" selected={userData.driversLicense.state == "MS"}>Mississippi</option>
                            <option value="MO" selected={userData.driversLicense.state == "MO"}>Missouri</option>
                            <option value="MT" selected={userData.driversLicense.state == "MT"}>Montana</option>
                            <option value="NE" selected={userData.driversLicense.state == "NE"}>Nebraska</option>
                            <option value="NV" selected={userData.driversLicense.state == "NV"}>Nevada</option>
                            <option value="NH" selected={userData.driversLicense.state == "NH"}>New Hampshire</option>
                            <option value="NJ" selected={userData.driversLicense.state == "NJ"}>New Jersey</option>
                            <option value="NM" selected={userData.driversLicense.state == "NM"}>New Mexico</option>
                            <option value="NY" selected={userData.driversLicense.state == "NY"}>New York</option>
                            <option value="NC" selected={userData.driversLicense.state == "NC"}>North Carolina</option>
                            <option value="ND" selected={userData.driversLicense.state == "ND"}>North Dakota</option>
                            <option value="OH" selected={userData.driversLicense.state == "OH"}>Ohio</option>
                            <option value="OK" selected={userData.driversLicense.state == "OK"}>Oklahoma</option>
                            <option value="OR" selected={userData.driversLicense.state == "OR"}>Oregon</option>
                            <option value="PA" selected={userData.driversLicense.state == "PA"}>Pennsylvania</option>
                            <option value="RI" selected={userData.driversLicense.state == "RI"}>Rhode Island</option>
                            <option value="SC" selected={userData.driversLicense.state == "SC"}>South Carolina</option>
                            <option value="SD" selected={userData.driversLicense.state == "SD"}>South Dakota</option>
                            <option value="TN" selected={userData.driversLicense.state == "TN"}>Tennessee</option>
                            <option value="TX" selected={userData.driversLicense.state == "TX"}>Texas</option>
                            <option value="UT" selected={userData.driversLicense.state == "UT"}>Utah</option>
                            <option value="VT" selected={userData.driversLicense.state == "VT"}>Vermont</option>
                            <option value="VA" selected={userData.driversLicense.state == "VA"}>Virginia</option>
                            <option value="WA" selected={userData.driversLicense.state == "WA"}>Washington</option>
                            <option value="WV" selected={userData.driversLicense.state == "WV"}>West Virginia</option>
                            <option value="WI" selected={userData.driversLicense.state == "WI"}>Wisconsin</option>
                            <option value="WY" selected={userData.driversLicense.state == "WY"}>Wyoming</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="licenseNumber">
                        <Form.Label>Driver's License ID Number</Form.Label>
                        <Form.Control type="text" placeholder="1234567890" required defaultValue={userData.driversLicense.ID} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="licenseExp">
                        <Form.Label>Driver's License Expiration Date (MM/DD/YYYY)</Form.Label>
                        <Form.Control type="text" placeholder="01/02/2025"  pattern="\d{1,2}/\d{1,2}/\d{4}" required defaultValue={userData.driversLicense.expirationDate} />
                    </Form.Group>
                </section>
                <section className="my-4 d-flex justify-content-between" id="progBtns">
                    <Button variant="primary" id="previous" onClick={() => {handlePrev()}}>Previous</Button>
                    <Button variant="primary" onClick={() => {handleNext()}} id="next">Next</Button>
                </section>
            </Form>
        </Container>
    )
}