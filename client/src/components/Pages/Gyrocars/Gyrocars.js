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
            <Form>
                <Form.Group className="mb-3" controlId="state">
                    <Form.Label>Status</Form.Label>
                    <Form.Select name="statusSelect" required>
                        <option value="">Select...</option>
                        <option value="available">Available</option>
                        <option value="offline">Offline</option>               
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="station">
                    <Form.Label>Station</Form.Label>
                    <Form.Select name="stationSelect" required>
                        <option value="">Select...</option>
                        <option value="Center City">Gyrogogo Center City</option>   
                        <option value="Airport">Gyrogogo Airport</option> 
                    </Form.Select>
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