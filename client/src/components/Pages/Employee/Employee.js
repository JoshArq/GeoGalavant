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

export default function Employee() {

    const [modalShow, setModalShow] = React.useState(false);

    return (
        <main>
             <ChangeStatusModal
                show={modalShow}
                onHide={() => setModalShow(false)}
            />

            <Container fluid as={'section'}>
                {/* <p>ooh customer details</p> */}
                <p className="mt-3"><Link to="/employees">Back to Employees</Link></p>

                <Row>
                    <Col md="auto">
                        <h1>Arlene McCoy</h1>
                    </Col>
                    <Col className="d-flex align-items-center">
                        <Button onClick={() => setModalShow(true)}>Change Status</Button>
                    </Col>
                </Row>
                <Badge status="active"/> 
                <p className="mt-4"><b>Employee Type</b><br/>Customer Service</p>
                <p><b>Location</b><br/>Monroe County</p>
            </Container> 
            
        </main>
    )
}