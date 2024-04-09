import React from 'react';
import Container from 'react-bootstrap/Container';
import Header from '../../GeoHeader/GeoHeader.js';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../../Badges/Badge.js';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

function AddNewGyrocar(props) {
    const [locations, setLocations] = useState([]);
    const [isValid, setIsValid] = useState(true);

    function addCar() {
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
        fetch("/api/addCar", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "auth-token": props.token
            },
            body: JSON.stringify({
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
            New Gyrocar
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Alert variant="danger" className={'text-danger m-3 bg-danger-subtle' + (isValid ? ' d-none' : '')} id="err">
                There was an issue retrieving the location data. Please refresh to try again.
            </Alert> 
            <Form id="addcar">
                <Form.Group className="mb-3" controlId="status">
                    <Form.Label>Status</Form.Label>
                    <Form.Select name="statusSelect" required>
                        <option value="">Select...</option>
                        <option value="1">Available</option>
                        <option value="2">Unavailable</option>      
                        <option value="3">Rented</option>
                        <option value="4">Non-operational</option>    
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="station">
                    <Form.Label>Station</Form.Label>
                    <Form.Select name="stationSelect" required>
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
          <Button onClick={() => {addCar()}}>Submit</Button>
        </Modal.Footer>
      </Modal>
    );
  }

export default function Gyrocars({token}) {
    const [cars, setCars] = useState([]);
    const [isValid, setIsValid] = useState(true);
    const [modalShow, setModalShow] = React.useState(false);

    // Get data
    useEffect(() => {
        // Get cars
        fetch("/api/getAllCars", {
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
                    setCars(data)
                }
          }).catch(error => {
            setIsValid(false);
            console.log(error);
          });
    }, [modalShow])

    return (
        <main>
            <AddNewGyrocar
                show={modalShow}
                onHide={() => setModalShow(false)}
                token={token}
            />
            <Header title="Gyrocars" />
            <Container as={'section'}>
                <Alert variant="danger" className={'text-danger my-3 bg-danger-subtle' + (isValid ? ' d-none' : '')} id="err">
                    There was an issue retrieving your data. Please refresh to try again.
                </Alert> 
                <Row>
                    <Col>
                        <Button onClick={() => setModalShow(true)} className="my-3"><i class="bi bi-plus"></i> Add New</Button>
                    </Col>
                </Row>
                {cars.length == 0 ? <p>There are no cars.</p> : 
                    <Table className="my-5">
                        <thead>
                            <tr className="d-flex flex-wrap border-1">
                            <th className="border-0 col-12 col-md-6 col-lg-4" scope="col">Vehicles</th>
                            <th className="border-0 col-12 col-md-6 col-lg-4" scope="col">Location</th>
                            <th className="border-0 col-12 col-md-6 col-lg-2" scope="col">Status</th>
                            <th className="border-0 col-12 col-md-6 col-lg-2" scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cars.map((car) => { return (
                                <tr className="d-flex flex-wrap border-1">
                                    <td className="border-0 col-12 col-md-6 col-lg-4">Gyrocar {car.carid}</td>
                                    <td className="border-0 col-12 col-md-6 col-lg-4">{car.stationname}</td>
                                    <td className="border-0 col-12 col-md-6 col-lg-2"><Badge status={car.status.toLowerCase()} /></td>
                                    <td className="border-0 col-12 col-md-6 col-lg-2"><Link to="/gyrocars/gyrocar" state={{ carID: car.carid }}>View Car</Link></td>
                                </tr>
                            )})}          
                        </tbody>
                    </Table>
                }  
            </Container> 
        </main>
    )
}