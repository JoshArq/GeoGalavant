import React from 'react';
import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link, useLocation } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import LocMap from '../../LocMap/LocMap.js';

let form_template = {};

export default function EditReservation({token}) {
    const form = form_template;
    const [dates, setDates] = useState({
        pickup: (new Date()).toISOString(),
        dropoff: (new Date()).toISOString()
    });
    const [data, setData] = useState({}); // current data
    const [dropoffLocations, setDropoffLocations] = useState([]);
    const [pickupLocations, setPickupLocations] = useState([]);
    const [price, setPrice] = useState("0.00")
    const [cards, setCards] = useState([]);
    const [step, setStep] = useState(0);
    const [isValid, setIsValid] = useState(true);
    const location = useLocation()
    const { resID } = location.state
    
    // Get form setup data
    useEffect(() => {
        let err = document.getElementById("err");
        // Get credit cards
        fetch("/api/getCreditCards", {
            headers: {
              "auth-token": token
            }
          })
          .then((res) => res.json())
          .then((data) => {
                if(data.error || !data.cards) {
                    err.innerText = "There was an error loading your form. Please refresh to try again.";
                    setIsValid(false);
                    console.log(data.error);
                }
                else {
                    setCards(data.cards);
                }
          }).catch(error => {
            err.innerText = "There was an error loading your form. Please refresh to try again.";
            setIsValid(false);
            console.log(error);
          });
        // Get locations
        requestLocations()
        // Get current reservation data
        fetch("/api/getReservationByID", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "auth-token": token
            },
            body: JSON.stringify({
                reservationID: resID
            }),
        })
        .then((res) => res.json())
        .then((data) => {
                if(data.error) {
                    err.innerText = "There was an error loading your form. Please refresh to try again.";
                    setIsValid(false);
                    console.log(data.error);
                }
                else {
                    setData(data);
                    // for datetime-local input setting value manually being a pain
                    console.log(data.pickupDateTime)
                    document.getElementById("reservation").pickup.defaultValue = makeInputTimestamp(new Date(data.pickupDateTime));
                    document.getElementById("reservation").dropoff.defaultValue = makeInputTimestamp(new Date(data.dropoffDateTime));
                }
        }).catch(error => {
            err.innerText = "There was an error loading your form. Please refresh to try again.";
            setIsValid(false);
            console.log(error);
        });
    }, [])

    function makeInputTimestamp(date) {
        return new Date(date.getTime() + new Date().getTimezoneOffset() * -60 * 1000).toISOString().slice(0, 19)
    }

    function requestLocations() {
        let err = document.getElementById("err");
        // Get locations
        // This is currently not set up very well because of API quirks that still need resolution
        fetch("/api/getAvailableLocations", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "auth-token": token
            },
            body: JSON.stringify(dates),
          })
          .then((res) => res.json())
          .then((data) => {
                if(data.error || !data.locations) {
                    err.innerText = "There was an error loading your form. Please refresh to try again.";
                    setIsValid(false);
                    console.log(data.error);
                }
                else {
                    setPickupLocations(data.locations);
                    console.log(data.locations)
                    setDropoffLocations(data.locations);
                }
          }).catch(error => {
            err.innerText = "There was an error loading your form. Please refresh to try again.";
            setIsValid(false);
            console.log(error);
          });
    }

    function fetchPrice() {
        let err = document.getElementById("err");
        // Get ride price
        fetch("/api/getReservePrice", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "auth-token": token
            },
            body: JSON.stringify({
                pickupDateTime: dates.pickup,
                dropoffDateTime: dates.dropoff
            }),
          })
          .then((res) => res.json())
          .then((data) => {
                if(data.error) {
                    err.innerText = "There was an error loading your price. Please refresh to try again.";
                    setIsValid(false);
                    console.log(data.error);
                }
                else {
                    setPrice(data.cost)
                }
          }).catch(error => {
            err.innerText = "There was an error loading your price. Please refresh to try again.";
            setIsValid(false);
            console.log(error);
          });
    }

    const handleReserveCar = () => {
        form.reservationID = resID;
        console.log(form.scheduledPickupTime)
        fetch("/api/editReservation", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "auth-token": token
            },
            body: JSON.stringify(form),
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                // Show just success message
                setStep(4);
                document.getElementById("step-heading").innerText = "Completed";
                document.getElementById("progBtns").classList.add("d-none");
                document.getElementById("step-3").classList.add("d-none");
                document.getElementById("done").classList.remove("d-none");
            }
            else {
                console.log(data)
                document.getElementById("err").innerText = "There was an issue editing your reservation. Please try again."
                setIsValid(false);
            }
        }).catch(error => {
            console.log(error)
            document.getElementById("err").innerText = "There was an issue editing your reservation. Please try again."
            setIsValid(false);
        });
    }

    const validateStep = (step) => {
        // Get form data
        let reservation = document.getElementById("reservation");
        let err = document.getElementById("err");
        // Determine which fields to validate
        switch (step) {
            case 0: 
                // Make temp date vars for calculations
                let testPickup = new Date(reservation.pickup.value);
                let testDropoff = new Date(reservation.dropoff.value);
                // Pickup date - in the future
                if(reservation.pickup.checkValidity() && testPickup > (new Date())) {
                    form.scheduledPickupTime = reservation.pickup.value;
                }
                else {
                    err.innerText = "Please choose a pickup date and time that is in the future."
                    setIsValid(false);
                    return false;
                }
                // Dropoff date - in the future of pickup && within 6 horus of pickup
                if(reservation.dropoff.checkValidity() 
                    && testDropoff > testPickup
                    && testDropoff < testPickup.setHours(testPickup.getHours() + 6)
                ) {
                    form.scheduledDropoffTime = reservation.dropoff.value;
                }
                else {
                    err.innerText = "Please choose a dropoff date and time that is in the future and within 6 hours of pickup."
                    setIsValid(false);
                    return false;
                }
                // Update dates (for getting locations)
                let newDates = dates;
                newDates.pickup = reservation.pickup.value;
                newDates.dropoff = reservation.dropoff.value;
                setDates(newDates)
                requestLocations()
                // All good
                setIsValid(true);
                return true;
            case 1: 
                // A pickup loc has been selected
                if(reservation.pickupLoc.value != "") {
                    // There is a "pickup-" before the station id in the value to prevent value overlap with dropoffLoc
                    form.pickupStation = parseInt(reservation.pickupLoc.value.split('-')[1])
                }
                else {
                    err.innerText = "Please choose a pickup location."
                    setIsValid(false);
                    return false;
                }
                // All good
                setIsValid(true);
                return true;
            case 2: 
                // A dropoff loc has been selected
                if(reservation.dropoffLoc.value != "") {
                    // There is a "dropoff-" before the station id in the value to prevent value overlap with pickupLoc
                    form.dropoffStation = parseInt(reservation.dropoffLoc.value.split('-')[1])
                }
                else {
                    err.innerText = "Please choose a dropoff location."
                    setIsValid(false);
                    return false;
                }
                // All good
                setIsValid(true);
                return true;
            case 3:
                // A cc has been selected (this will be replaced with stripe)
                if(reservation.paymentMethod.value != "") {
                    form.payment = reservation.paymentMethod.value
                }
                else {
                    err.innerText = "Please choose a payment method."
                    setIsValid(false);
                    return false;
                }
                // All good
                setIsValid(true);
                return true;
        }
        return true;
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
            if (newStep !== 0) {
                prevBtn.removeAttribute("disabled");
            }
            return;
        }

        // Check for fetch price case 
        if (oldStep == 2) {
            fetchPrice()
        }

        // Check for submission case
        if (oldStep === 3) {
            handleReserveCar()
            return;
        }

        // Increment step number
        setStep(step + 1)

        // Next / Prev button de/activation so it can't go out of bounds 
        if (newStep === 1) {
            prevBtn.removeAttribute("disabled");
        }
        else if (newStep === 3) {
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

        // Don't need to check for invalid backing bc prev is hidden on step 0
        
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
        else if (oldStep === 3) {
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

    function makeTimestamp(date) {
        let mins = date.getMinutes();
        if (mins < 10) {
            mins = "0" + mins;
        }

        return date.getMonth() 
                + "/" + date.getDate() + "/" 
                + date.getFullYear() + " at " 
                + date.getHours() 
                + ":" + mins
    }

    function findLoc(time, value) {
        let loc = null;
        if (time == "pickup") {
            loc = pickupLocations.find((loc) => loc.stationID == value)
        }
        else {
            loc = dropoffLocations.find((loc) => loc.stationID == value)
        }
        return (loc ? loc : {})
    }
    
    return (
        <Container as={'main'} className="py-5">
            <Form noValidate id="reservation">
                <div className={'' + (step > 0 ? '' : ' d-none')} id="progBar">
                    <h2 className="fs-5 fw-bold mb-3" id="step-heading">Step {step + 1} of 4</h2>
                    <ProgressBar className="mb-4" variant="secondary" now={step/4 * 100} label={`${step/4 * 100}%`} id="progress" />
                </div>
                <Alert variant="danger" className={'text-danger bg-danger-subtle' + (isValid ? ' d-none' : '')} id="err">
                    Something is wrong with your submission. Please try again.
                </Alert> 
                <section className="" id="step-0">
                    <h1 className="mb-4 fw-bold">Edit Reservation</h1>
                    <p className="mt-5 mb-4">Review all information and hit "save" at the end.</p>
                    <Card className="grey-section border-0">
                        <Card.Body as={Container}>
                            <Row>
                                <Col md={6} className="py-2 px-4">
                                    <Form.Group controlId="pickup">
                                        <Form.Label>Pick-up Date and Time</Form.Label>
                                        <Form.Control type="datetime-local" required />
                                    </Form.Group>
                                </Col>
                                <Col md={6} className="py-2 px-4">
                                    <Form.Group controlId="dropoff">
                                        <Form.Label>Drop-off Date and Time</Form.Label>
                                        <Form.Control type="datetime-local" required />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                    <div className="d-flex justify-content-end mt-4">
                        <Button variant="primary" onClick={() => {handleNext()}} id="search">Search</Button>
                    </div>
                </section>
                <section className="d-none" id="step-1">
                    <h1 className="mb-4 fw-bold">Pick-up Location</h1>
                    <p>5 results for Monroe County on {makeTimestamp(new Date(dates.pickup))}</p>
                    <Container>
                        <Row>
                            <Col md={4} className="pb-4 pb-md-0 pe-md-2">
                                <Form.Group controlId="pickupLoc">
                                    {pickupLocations.map((location) => { return (
                                        <Card className="grey-section border-0" as={Form.Label} for={"pickup-" + location.stationID}>
                                            <Card.Body as={Container}>
                                                <Row>
                                                    <Col xs={9}>
                                                        <p><strong>{location.stationID + ". " + location.name}</strong></p>
                                                        <p className="m-0">{location.address}</p>
                                                    </Col>
                                                    <Col xs={3} className="d-flex align-items-center justify-content-end">
                                                        <Form.Check name="pickupLoc" type="radio" value={"pickup-" + location.stationID} id={"pickup-" + location.stationID} required defaultChecked={location.name == data.pickupStationName ? true : false}/>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    )})}
                                </Form.Group>
                            </Col>
                            <Col md={8}>
                                <LocMap locations={pickupLocations} />
                            </Col>
                        </Row>
                    </Container>
                </section>
                <section className="d-none" id="step-2">
                    <h1 className="mb-4 fw-bold">Drop-off Location</h1>
                    <p>5 results for Monroe County on {makeTimestamp(new Date(dates.dropoff))}</p>
                    <Container>
                        <Row>
                            <Col md={4} className="pb-4 pb-md-0 pe-md-2">
                                <Form.Group controlId="dropoffLoc">
                                    {dropoffLocations.map((location) => { return (
                                        <Card className="grey-section border-0" as={Form.Label} for={"dropoff-" + location.stationID}>
                                            <Card.Body as={Container}>
                                                <Row>
                                                    <Col xs={9}>
                                                        <p><strong>{location.stationID + ". " + location.name}</strong></p>
                                                        <p className="m-0">{location.address}</p>
                                                    </Col>
                                                    <Col xs={3} className="d-flex align-items-center justify-content-end">
                                                        <Form.Check name="dropoffLoc" type="radio" value={"dropoff-" + location.stationID} id={"dropoff-" + location.stationID} required defaultChecked={location.name == data.dropoffStationName ? true : false}/>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    )})}
                                </Form.Group>
                            </Col>
                            <Col md={8}>
                                <LocMap locations={dropoffLocations} />
                            </Col>
                        </Row>
                    </Container>
                </section>
                <section className="d-none" id="step-3">
                    <h1 className="mb-4 fw-bold">Payment</h1>
                    <Container>
                        <Row>
                            <Col md={6} lg={4} className="d-flex align-items-stretch">
                                <Card className="border-0 grey-section py-4 mb-3 mb-md-0 w-100">
                                    <Card.Body>
                                        <h3 className="fw-bold fs-5">Reservation Details</h3>
                                        <h4 className="fw-bold fs-6 mt-4">Dates & Times</h4>
                                        <p>Pick-up: {makeTimestamp(new Date(dates.pickup))}</p>
                                        <p>Drop-off: {makeTimestamp(new Date(dates.dropoff))}</p>
                                        {/* has some error prevention from trying to display data thats not there when we're in earlier steps */}
                                        {pickupLocations.length == 0 || dropoffLocations.length == 0 || !form.pickupStation || !form.dropoffStation ? '' :
                                        <>
                                            <h4 className="fw-bold fs-6 mt-4">Pick-up Location</h4>
                                            <p className="m-0">{findLoc("pickup", form.pickupStation).name ? findLoc("pickup", form.pickupStation).name : ''}</p>
                                            <p>{findLoc("pickup", form.pickupStation).address ? findLoc("pickup", form.pickupStation).address : ''}</p>
                                            <h4 className="fw-bold fs-6 mt-4">Drop-off Location</h4>
                                            <p className="m-0">{findLoc("dropoff", form.dropoffStation).name ? findLoc("dropoff", form.dropoffStation).name : ''}</p>
                                            <p>{findLoc("dropoff", form.dropoffStation).address ? findLoc("dropoff", form.dropoffStation).address : ''}</p>
                                        </>
                                        }
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={6} lg={8}>
                                <Card className="grey-section border-0 mb-3 py-4 px-lg-5">
                                    <Card.Body as={Container}>
                                        <Row>
                                            <Col>
                                                <h3 className="fw-bold fs-5 text-center">Total Cost:</h3>
                                                <p className="fw-bold fs-1 text-center">${price}</p>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Card>
                                <Card className="grey-section border-0 py-4 px-lg-5">
                                    <Card.Body>
                                        <h3 className="fw-bold fs-5">Choose Payment</h3>
                                        <p>Gyrogogo accepts Visa, Mastercard, Discover, and American Express.</p>
                                        <Form.Group className="mt-4" controlId="paymentMethod">
                                            <Form.Label className="m-0">Payment Method</Form.Label>
                                            <hr className="border-2 opacity-100" />
                                            {cards.map((card) => { return (
                                                <Form.Check name="paymentMethod" type="radio" label={card.lastNumbers} value={card.cardToken} id={card.cardToken} required/>
                                            )})}
                                        </Form.Group>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </Container>
                </section>
                <section className="d-none" id="done">
                    <h1 className="mb-4 fw-bold"><i class="bi bi-check-circle-fill me-3"></i> Reservation Changes Successful</h1>
                    <p>Your reservation number is <span id="confNum">{data.confirmationNumber}</span>. Use this code to unlock your Gyrocar.</p>
                    <Card className="grey-section border-0 my-4 p-4">
                        <Card.Body as={Container}>
                            <h3 className="fw-bold fs-5">Resevation Details</h3>
                            <Row>
                                <Col lg={6}>
                                    <h4 className="fw-bold fs-6 mt-4">Dates & Times</h4>
                                    <p>Pick-up: {makeTimestamp(new Date(dates.pickup))}</p>
                                    <p>Drop-off: {makeTimestamp(new Date(dates.dropoff))}</p>
                                </Col>
                                {pickupLocations.length == 0 || dropoffLocations.length == 0 || !form.pickupStation || !form.dropoffStation ? '' :
                                    <>
                                        <Col md={6} lg={3}>
                                            <h4 className="fw-bold fs-6 mt-4">Pick-up Location</h4>
                                            <p className="m-0">{findLoc("pickup", form.pickupStation).name ? findLoc("pickup", form.pickupStation).name : ''}</p>
                                            <p>{findLoc("pickup", form.pickupStation).address ? findLoc("pickup", form.pickupStation).address : ''}</p>
                                        </Col>
                                        <Col md={6} lg={3}>
                                            <h4 className="fw-bold fs-6 mt-4">Drop-off Location</h4>
                                            <p className="m-0">{findLoc("dropoff", form.dropoffStation).name ? findLoc("dropoff", form.dropoffStation).name : ''}</p>
                                            <p>{findLoc("dropoff", form.dropoffStation).address ? findLoc("dropoff", form.dropoffStation).address : ''}</p>
                                        </Col>
                                    </>
                                }
                            </Row>
                        </Card.Body>
                    </Card>
                    <p>Go to your <Link to="/account">account</Link> to view, modify, or cancel your reservation.</p>
                </section>
                <div className={'my-4 d-flex justify-content-between' + (step > 0 ? '' : ' d-none')} id="progBtns">
                    <Button variant="primary" onClick={() => {handlePrev()}} id="previous">Previous</Button>
                    <Button variant="primary" onClick={() => {handleNext()}} id="next">Next</Button>
                </div>
            </Form>
        </Container> 
    )
}