import React from 'react';
import Container from 'react-bootstrap/Container';
import Header from '../../GeoHeader/GeoHeader.js';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

export default function ModifyReservation({token}) {
    const location = useLocation()
    const [isValid, setIsValid] = useState(true);
    const [data, setData] = useState({}); // current data
    const [dropoffLocations, setDropoffLocations] = useState([]);
    const [pickupLocations, setPickupLocations] = useState([]);
    const [dates, setDates] = useState({
        pickup: (new Date()).toISOString(),
        dropoff: (new Date()).toISOString()
    });
    const { resID, custID } = location.state
    let navigate = useNavigate();

    // Get form setup data
    useEffect(() => {
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
                    console.log(data)
                    document.getElementById("reservation").pickup.defaultValue = makeInputTimestamp(new Date(data.pickupDateTime));
                    document.getElementById("reservation").dropoff.defaultValue = makeInputTimestamp(new Date(data.dropoffDateTime));
                }
        }).catch(error => {
            err.innerText = "There was an error loading your form. Please refresh to try again.";
            setIsValid(false);
            console.log(error);
        });
    }, [])

    function editReservation() {
        let reservation = document.getElementById("reservation");
        let err = document.getElementById("err");
        // Make temp date vars for calculations
        let testPickup = new Date(reservation.pickup.value);
        let testDropoff = new Date(reservation.dropoff.value);
        // Pickup date - in the future
        if(!reservation.pickup.checkValidity() || testPickup <= (new Date())) {
            err.innerText = "Please choose a pickup date and time that is in the future."
            setIsValid(false);
            return
        }
        // Dropoff date - in the future of pickup && within 6 horus of pickup
        if(!reservation.dropoff.checkValidity() 
            || testDropoff <= testPickup
            || testDropoff >= testPickup.setHours(testPickup.getHours() + 6)
        ) {
            err.innerText = "Please choose a dropoff date and time that is in the future and within 6 hours of pickup."
            setIsValid(false);
            return
        }
        // A pickup loc has been selected
        if(reservation.pickupLoc.value == "") {
            err.innerText = "Please choose a pickup location."
            setIsValid(false);
            return
        }
        // A dropoff loc has been selected
        if(reservation.dropoffLoc.value == "") {
            err.innerText = "Please choose a dropoff location."
            setIsValid(false);
            return
        }
        // Send data
        fetch("/api/editReservation", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "auth-token": token
            },
            body: JSON.stringify({
                reservationID: resID,
                scheduledPickupTime: reservation.pickup.value,
                scheduledDropoffTime: reservation.dropoff.value,
                pickupStation: parseInt(reservation.pickupLoc.value),
                dropoffStation: parseInt(reservation.dropoffLoc.value)
            }),
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.success) {
                // Go back to customer page, where reservation iwll have been updated
                setIsValid(true)
                navigate("/customers/customer", {state : { custID: custID }});
            }
            else {
                document.getElementById("err").innerText = "There was an issue editing your reservation. Please try again."
                console.log(data)
                setIsValid(false);
            }
        }).catch(error => {
            console.log(error)
            document.getElementById("err").innerText = "There was an issue editing your reservation. Please try again."
            setIsValid(false);
        });
    }

    function deleteReservation() {
        // Delete car
        fetch("/api/deleteReservation", {
            method: 'DELETE',
            headers: {
              "auth-token": token,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({reservationID: resID}),
          })
          .then((res) => res.json())
          .then((data) => {
                if(data.error) {
                    setIsValid(false);
                    console.log(data.error);
                }
                else {
                    navigate("/customers/customer", {state : { custID: custID }});
                }
          }).catch(error => {
            setIsValid(false);
            console.log(error);
          });
    }

    function makeInputTimestamp(date) {
        return new Date(date.getTime() + new Date().getTimezoneOffset() * -60 * 1000).toISOString().slice(0, 19)
    }

    return (
        <main>
            <Header title={"Modify Reservation #" + resID} />
            <Container as={'section'} className="p-4">
                <Alert variant="danger" className={'text-danger bg-danger-subtle' + (isValid ? ' d-none' : '')} id="err">
                    Something is wrong with your submission. Please try again.
                </Alert> 
                <p><Link className="link-underline link-underline-opacity-0" to="/customers/customer" state={{ custID: custID }}><i className="bi bi-chevron-left me-3 color-primary"></i>Back to customer</Link></p>
                <h2 className="mb-3">Upcoming Reservation for Arlene McCoy</h2>
                <Form id="reservation">
                    <Form.Group className="mb-3" controlId="pickup">
                        <Form.Label>Date and Time</Form.Label>
                        <Form.Control type="datetime-local" required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="dropoff">
                        <Form.Label>Date and Time</Form.Label>
                        <Form.Control type="datetime-local" required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="pickupLoc">
                        <Form.Label>Pick-up Location</Form.Label>
                        <Form.Select name="pickupLocSelect" required>
                            <option value="">Select...</option>
                            {pickupLocations.map((location) => { return (
                                <option value={location.stationid} selected={data.pickupStationName == location.name}>{location.name}</option>
                            )})}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="dropoffLoc">
                        <Form.Label>Drop-off Location</Form.Label>
                        <Form.Select name="dropoffLoc" required>
                            <option value="">Select...</option>
                            {dropoffLocations.map((location) => { return (
                                <option value={location.stationid} selected={data.dropoffStationName == location.name}>{location.name}</option>
                            )})}               
                        </Form.Select>
                    </Form.Group>
                    {/* The gyrocar number assigned is currently not returned anywhere, so I can't display the current number. 
                    Leaving out until this is fixed. */}
                    {/*
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
                    */}
                    <Button variant="danger" className="mx-3 my-2" onClick={() => {deleteReservation()}}>Cancel Reservation</Button>
                    <Button variant="secondary" className="mx-3 my-2" as={Link} to="/customers/customer" state={{ custID: custID }}>Cancel Changes</Button>
                    <Button variant="primary" className="mx-3 my-2" onClick={() => {editReservation()}}>Save Changes</Button>
                </Form>
            </Container> 

        </main>
    )
}