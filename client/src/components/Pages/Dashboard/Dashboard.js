import React from 'react';
import Container from 'react-bootstrap/Container';
import { useState, useEffect } from 'react';
import Header from '../../GeoHeader/GeoHeader.js';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

function AddNewLocation(props) {
    const [isValid, setIsValid] = useState(true);

    function addLoc() {
        // Validation
        let form = document.getElementById("newLoc");
        let err = document.getElementById("err")

        // Check name
        if(!form.name.checkValidity()) {
            err.innerText = "Please add a name"
            setIsValid(false)
            return
        }
        // Check lat
        if(!form.lat.checkValidity()) {
            err.innerText = "Please add a latitude"
            setIsValid(false)
            return
        }
        // Check lon
        if(!form.lon.checkValidity()) {
            err.innerText = "Please add a longitude"
            setIsValid(false)
            return
        }
        // Check addr
        if(!form.addr.checkValidity()) {
            err.innerText = "Please add an address"
            setIsValid(false)
            return
        }
        // Open
        if(!form.open.checkValidity() && form.open.value.length == 0) {
            err.innerText = "Please select an open status"
            setIsValid(false)
            return
        }

        // Create new loc
        fetch("/api/addLocation", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "auth-token": props.token
            },
            body: JSON.stringify({
                stationName: form.name.value,
                address: form.addr.value,
                isClosed: form.open.value,
                latitude: form.lat.value,
                longitude: form.lon.value,

            }),
        })
        .then((res) => res.json())
        .then((data) => {
            if (!data.error) {
                // Close modal. The page should update to show the new status
                setIsValid(true)
                props.onHide()
            }
            else {
                console.log(data.error)
                err.innerText = "There was an issue submitting your request. Please try again."
                setIsValid(false)
            }
        }).catch(error => {
            console.log(error)
            err.innerText = "There was an issue submitting your request. Please try again."
            setIsValid(false)
        });
    }

    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            New Location
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Alert variant="danger" className={'text-danger bg-danger-subtle' + (isValid ? ' d-none' : '')} id="err">
                There was an issue loading the data. Please try again.
            </Alert>
            <Form id="newLoc">
                <Form.Group className="mb-3" controlId="name">
                    <Form.Label>Location Name</Form.Label>
                    <Form.Control type="text" placeholder="Example Location" required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="lat">
                    <Form.Label>Latitude</Form.Label>
                    <Form.Control type="number" placeholder="-40.00000" step="0.00001" min="-90.00000" max="90.00000" required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="lon">
                    <Form.Label>Longitude</Form.Label>
                    <Form.Control type="number" placeholder="-40.00000" step="0.00001" min="-180.00000" max="180.00000" required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="addr">
                    <Form.Label>Address</Form.Label>
                    <Form.Control type="text" placeholder="Enter address" required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="open">
                    <Form.Label>Is the location open?</Form.Label>
                    <Form.Select name="openSelect" required>
                        <option value="">Select...</option>
                        {/* The API requires isClosed, so it's reverse of question */}
                        <option value="false">Yes</option> 
                        <option value="true">No</option>
                    </Form.Select>
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="" onClick={props.onHide}>Cancel</Button>
          <Button onClick={() => {addLoc()}}>Submit</Button>
        </Modal.Footer>
      </Modal>
    );
  }

export default function Dashboard({token, isadmin}) {
    const [modalShow, setModalShow] = useState(false);
    const [locations, setLocations] = useState([]);
    const [isValid, setIsValid] = useState(true);

    // Get data
    useEffect(() => {
        // Get locations
        fetch("/api/getLocations", {
            headers: {
              "auth-token": token
            }
          })
          .then((res) => res.json())
          .then((data) => {
                if(data.error || !data.locations) {
                    setIsValid(false);
                    console.log(data.error);
                }
                else {
                    setLocations(data.locations);
                }
          }).catch(error => {
            setIsValid(false);
            console.log(error);
          });
    }, [modalShow])

    return (
        <main>
            {isadmin ?
                <AddNewLocation
                    show={modalShow}
                    onHide={() => setModalShow(false)}
                    token={token}
                />
            : '' }
            <Header title="Dashboard" />
            <Container as={'section'}>
                <Alert variant="danger" className={'text-danger bg-danger-subtle' + (isValid ? ' d-none' : '')}>
                    There was an issue loading the data. Please try again.
                </Alert>

                <Button onClick={() => setModalShow(true)} className="mt-3" disabled={!isadmin}><i class="bi bi-plus"></i> Add New Location</Button>

                <Row className="p-4">
                    {locations.map((loc) => {return(
                        <Col sm="6" lg="4">
                            <Card className="mt-4 grey-section">
                                <Card.Body>
                                    <Card.Title as={'h3'} className="fs-4 fw-bold mb-3">
                                        {loc.name}
                                    </Card.Title>
                                    <Card.Text>
                                        <p>{loc.address}</p>
                                        <hr className="border-2 border-dark" />
                                        <p>? Available Cars</p>
                                        <p>? Cars Offline</p>
                                        <p>? Pick-ups in past month</p>
                                        <p>? Drop-offs in past month</p>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    )})}
                </Row>
            </Container> 
        </main>
    )
}