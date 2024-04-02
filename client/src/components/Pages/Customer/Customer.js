import React from 'react';
import Container from 'react-bootstrap/Container';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Badge from '../../Badges/Badge.js';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import './Customer.scss';

function ChangeStatusModal(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Change Status
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group className="mb-3" controlId="state">
                    <Form.Label>Status</Form.Label>
                    <Form.Select name="statusSelect" required>
                        <option value="">Select...</option>
                        <option value="active">Active</option>
                        <option value="needsApproval">Needs Approval</option>
                        <option value="denied">Denied</option>  
                        <option value="suspended">Suspended</option> 
                        <option value="terminated">Terminated</option>                    
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="reason">
                    <Form.Label>Reason for Change</Form.Label>
                    <Form.Control type="text" placeholder="Reason for change" required />
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="" onClick={props.onHide}>Close</Button>
          <Button onClick={props.onHide}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    );
  }

export default function Customer({token}) {
    const location = useLocation()
    const { custID } = location.state
    const [modalShow, setModalShow] = React.useState(false);
    const [details, setDetails] = useState({});
    const [isValid, setIsValid] = useState(true);

    
    // Get data
    useEffect(() => {
        // Get customers
        fetch("/api/getAllCustomers", {
            method: 'POST',
            headers: {
              "auth-token": token
            },
            body: JSON.stringify({customerId: custID}),
          })
          .then((res) => res.json())
          .then((data) => {
                if(data.error) {
                    setIsValid(false);
                    console.log(data.error);
                }
                else {
                    setDetails(data)
                    console.log(data)
                }
          }).catch(error => {
            setIsValid(false);
            console.log(error);
          });
    }, [])

    return (
        <main>
             <ChangeStatusModal
                show={modalShow}
                onHide={() => setModalShow(false)}
            />

            <Container fluid as={'section'}>
                <p className="mt-3"><Link to="/customers" className="link-underline link-underline-opacity-0"><i className="bi bi-chevron-left me-3 color-primary"></i>Back to Customers</Link></p>
                <Alert variant="danger" className={'text-danger my-3 bg-danger-subtle' + (isValid ? ' d-none' : '')} id="err">
                    There was an issue retrieving your data. Please refresh to try again.
                </Alert> 
                <Row>
                    <Col md="auto">
                        <h1>Arlene McCoy</h1>
                    </Col>
                    <Col className="d-flex align-items-center">
                        <Button onClick={() => setModalShow(true)}>Change Status</Button>
                    </Col>
                </Row>
                <Badge status="active"/> 
                <Row className="mt-2">
                    <Col md="2">
                        <p><b>Username</b><br/>something</p>
                    </Col>
                    <Col md="2">
                        <p><b>Email</b><br/>arlenemccoy@gmail.com</p>
                    </Col>
                </Row>
            </Container> 
            <div className="grey-section">

                <Container as={'section'}>

                    <h2 className="pt-3 pb-3">Reservations</h2>

                    <h2>Upcoming</h2>
                    <Table responsive="md">
                    <thead>
                        <tr>
                        <th scope="col">Reservation #</th>
                        <th scope="col">Pickup</th>
                        <th scope="col">Dropoff</th>
                        <th scope="col">Gyrocar #</th>
                        <th scope="col">Payment</th>
                        <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="tr-width">
                            <td>123456</td>
                            <td>09/12/2024 at 12:00pm <br/>Monroe County <br/>GyroGoGo Center City</td>
                            <td>09/12/2024 at 12:00pm <br/>Monroe County <br/>GyroGoGo Center City</td>
                            <td>7654321</td>
                            <td>card ending in ####</td>
                            <td> <Link to="/ModifyReservation/ModifyReservation"><i class="bi bi-pencil-square"></i></Link></td>
                        </tr>                   
                    </tbody>
                    </Table>

                    <h2>Past</h2>
                    <Table responsive="md">
                    <thead>
                        <tr>
                        <th scope="col">Reservation #</th>
                        <th scope="col">Pickup</th>
                        <th scope="col">Dropoff</th>
                        <th scope="col">Gyrocar #</th>
                        <th scope="col">Payment</th>
                        <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="tr-width">
                            <td>123456</td>
                            <td>09/12/2024 at 12:00pm <br/>Monroe County <br/>GyroGoGo Center City</td>
                            <td>09/12/2024 at 12:00pm <br/>Monroe County <br/>GyroGoGo Center City</td>
                            <td>7654321</td>
                            <td>card ending in ####</td>
                            <td> <Link to="/ModifyReservation/ModifyReservation"><i class="bi bi-pencil-square"></i></Link></td>
                        </tr>                   
                    </tbody>
                    <tbody>
                        <tr className="tr-width">
                            <td>123456</td>
                            <td>09/12/2024 at 12:00pm <br/>Monroe County <br/>GyroGoGo Center City</td>
                            <td>09/12/2024 at 12:00pm <br/>Monroe County <br/>GyroGoGo Center City</td>
                            <td>7654321</td>
                            <td>card ending in ####</td>
                            <td> <Link to="/ModifyReservation/ModifyReservation"><i class="bi bi-pencil-square"></i></Link></td>
                        </tr>                   
                    </tbody>
                    </Table>
                </Container>
            </div>
        </main>
    )
}