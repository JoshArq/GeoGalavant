import React from 'react';
import Container from 'react-bootstrap/Container';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Badge from '../../Badges/Badge.js';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';

function SubmitWorkReport(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            New Work Report
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group className="mb-3" controlId="gyrocar">
                    <Form.Label>Gyrocar</Form.Label>
                    <Form.Select name="gyrocarSelect" required>
                        <option value="">Select...</option>
                        <option value="1">Gyrocar #####</option>   
                        <option value="2">Gyrocar #####</option>               
                        <option value="3">Gyrocar #####</option>   
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="service">
                    <Form.Label>Service Performed</Form.Label>
                    <Form.Control type="text" placeholder="Describe service" required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="pickup">
                    <Form.Label>Date Time Performed</Form.Label>
                    <Form.Control type="datetime-local" required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="station">
                    <Form.Label>Station</Form.Label>
                    <Form.Select name="stationSelect" required>
                        <option value="">Select...</option>
                        <option value="Center City">Gyrogogo Center City</option>   
                        <option value="Airport">Gyrogogo Airport</option> 
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="damage">
                    <Form.Label>Was there physical damage?</Form.Label>
                    <Form.Check name="yesDamage" type="radio" label="Yes" required/>
                    <Form.Check name="noDamage" type="radio" label="No" required/>
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="" onClick={props.onHide}>Cancel</Button>
          <Button onClick={props.onHide}>Submit</Button>
        </Modal.Footer>
      </Modal>
    );
  }

  function EditGyrocar(props) {
    const [locations, setLocations] = useState([]);
    const [isValid, setIsValid] = useState(true);

    function editCar() {
        // Validate
        let form = document.getElementById("addcar");
        let err = document.getElementById("err");

        // Check status is selected
        if (!form.status.checkValidity() || form.status.value.length == 0) {
            err.innerText = "Please select a status"
            setIsValid(false)
            return
        }

        // Check location is selected
        if (!form.station.checkValidity() || form.station.value.length == 0) {
            err.innerText = "Please select a station"
            setIsValid(false)
            return
        }

        // Send new car data
        fetch("/api/updateCar", {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "auth-token": props.token
            },
            body: JSON.stringify({
                carId: props.carID,
                stationId: parseInt(form.station.value),
                carStatusId: parseInt(form.status.value),
            }),
        })
        .then((res) => res.json())
        .then((data) => {
            if (!data.error) {
                // Close modal. The page should update to show the new car
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

    // Get data
    useEffect(() => {
        // Get locations
        fetch("/api/getLocations", {
            headers: {
                "auth-token": props.token
            }
        })
        .then((res) => res.json())
        .then((data) => {
                if(data.error || !data.locations) {
                    setIsValid(false);
                    console.log(data.error);
                }
                else {
                    setLocations(data.locations)
                }
        }).catch(error => {
            setIsValid(false);
            console.log(error);
        });
    }, [])

    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Gyrocar {props.carID}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Alert variant="danger" className={'text-danger m-3 bg-danger-subtle' + (isValid ? ' d-none' : '')} id="err">
                There was an issue retrieving the location data. Please refresh to try again.
            </Alert> 
            <Form id="addcar">
                <Form.Group className="mb-3" controlId="status">
                    <Form.Label>Status</Form.Label>
                    <Form.Select name="statusSelect" required defaultValue={props.carStatusId}>
                        <option value="">Select...</option>
                        <option value="1">Available</option>
                        <option value="2">Unavailable</option>      
                        <option value="3">Rented</option>
                        <option value="4">Non-operational</option>    
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="station">
                    <Form.Label>Station</Form.Label>
                    <Form.Select name="stationSelect" required defaultValue={props.carStationId}>
                        <option value="">Select...</option>
                        {locations.map((loc) => {return (
                            <option value={loc.stationID}>{loc.name}</option>
                        )})}   
                    </Form.Select>
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="" onClick={props.onHide}>Cancel</Button>
          <Button onClick={() => {editCar()}}>Submit</Button>
        </Modal.Footer>
      </Modal>
    );
  }

export default function Gyrocar({token}) {
    const location = useLocation()
    const { carID } = location.state
    const [details, setDetails] = useState({});
    const [reports, setReports] = useState({});
    const [isValid, setIsValid] = useState(true);
    const [modalShow, setModalShow] = React.useState(false);
    const [modalTwoShow, setModalTwoShow] = React.useState(false);
    let navigate = useNavigate();

    // Delete car
    function deleteCar() {
        // Delete car
        fetch("/api/removeCar", {
            method: 'DELETE',
            headers: {
              "auth-token": token,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({carId: carID}),
          })
          .then((res) => res.json())
          .then((data) => {
                if(data.error) {
                    setIsValid(false);
                    console.log(data.error);
                }
                else {
                    navigate("/gyrocars");
                }
          }).catch(error => {
            setIsValid(false);
            console.log(error);
          });
    }
    
    // Get data
    useEffect(() => {
        // Get car
        fetch("/api/getCarDetails", {
            method: 'POST',
            headers: {
              "auth-token": token,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({carId: carID}),
          })
          .then((res) => res.json())
          .then((data) => {
                if(data.error) {
                    setIsValid(false);
                    console.log(data.error);
                }
                else {
                    setDetails(data)
                }
          }).catch(error => {
            setIsValid(false);
            console.log(error);
          });
    }, [modalShow, modalTwoShow])

    return (
        <main>
            <EditGyrocar
                show={modalTwoShow}
                onHide={() => setModalTwoShow(false)}
                token={token}
                carID={carID}
                carStatusId={details.statusid}
                carStationId={details.stationid}
            />

             <SubmitWorkReport
                show={modalShow}
                onHide={() => setModalShow(false)}
            />

            <Alert variant="danger" className={'text-danger m-3 bg-danger-subtle' + (isValid ? ' d-none' : '')}>
                There was an issue retrieving your data. Please refresh to try again.
            </Alert> 

            {!details.carid ? <p className="m-3"><Link to="/gyrocars" className="link-underline link-underline-opacity-0"><i className="bi bi-chevron-left me-3 color-primary"></i>Back to Gyrocars</Link><br/><br/>This car does not exist.</p> : 
                <>
                    <Container fluid as={'section'}>
                        <p className="mt-3"><Link to="/gyrocars" className="link-underline link-underline-opacity-0"><i className="bi bi-chevron-left me-3 color-primary"></i>Back to Gyrocars</Link></p>

                        <Row>
                            <Col md="auto">
                                <h1>Gyrocar {carID}</h1>
                            </Col>
                            <Col className="d-flex align-items-center">
                                <Button variant="primary" className="me-2" onClick={() => setModalTwoShow(true)}>Edit Car</Button>
                                <Button variant="danger" onClick={() => deleteCar()}>Delete Car</Button>
                            </Col>
                        </Row>
                        <Badge status={details.statusname.toLowerCase()} />
                        <Row className="mt-2">
                            <Col md="4">
                                <p><b>Location</b><br/>Unknown</p>
                            </Col>
                            <Col>
                                <p><b>Station</b><br/>{details.stationname}</p>
                            </Col>
                        </Row>
                    </Container> 
                    <div className="grey-section pb-4">

                        <Container as={'section'}>

                            <h2 className="pt-3 pb-3">Work Reports</h2>
                            <Button className="mb-3" onClick={() => setModalShow(true)}><i class="bi bi-plus"></i> Add New</Button>

                            <Table responsive="md">
                            <thead>
                                <tr>
                                <th scope="col">Date/Time #</th>
                                <th scope="col">Location</th>
                                <th scope="col">Service</th>
                                <th scope="col">Physical Damage</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="tr-width">
                                    <td>0/12/2024 at 12:00pm</td>
                                    <td>Monroe County <br/>GyroGoGo Center City</td>
                                    <td>Oil Change</td>
                                    <td>No</td>
                                </tr>                   
                            </tbody>
                            </Table>

                        </Container>
                    </div>
                </>
            }
        </main>
    )
}