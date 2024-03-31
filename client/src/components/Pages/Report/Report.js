import React from 'react';
import Container from 'react-bootstrap/Container';
import Header from '../../GeoHeader/GeoHeader.js';
import { Link } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Badge from '../../Badges/Badge.js';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

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

export default function Report() {

    const [modalShow, setModalShow] = React.useState(false);

    return (
        <main>
             <ChangeStatusModal
                show={modalShow}
                onHide={() => setModalShow(false)}
            />

            <Container fluid as={'section'}>
                {/* <p>ooh customer details</p> */}
                <p className="mt-3"><Link to="/customers">Back to customers</Link></p>

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