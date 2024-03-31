import React from 'react';
import Container from 'react-bootstrap/Container';
import Header from '../../GeoHeader/GeoHeader.js';
import { Link } from 'react-router-dom';
import Badge from '../../Badges/Badge.js';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

function AddNewEmployee(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            New Employee
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group className="mb-3" controlId="state">
                    <Form.Label>Employee Type</Form.Label>
                    <Form.Select name="statusSelect" required>
                        <option value="">Select...</option>
                        <option value="customerService">Customer Service</option>
                        <option value="mechanic">Mechanic</option>       
                        <option value="manager">Manager</option> 
                        {/* business admin option is only seen by sysadmin employees*/}
                        <option value="businessAdmin">Business Admin</option>              
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="station">
                    <Form.Label>Location</Form.Label>
                    <Form.Select name="stationSelect" required>
                        <option value="">Select...</option>
                        <option value="monroeCounty">Rochester (Monroe County)</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Username" required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="text" placeholder="Password" required />
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

export default function Employees() {
    const [modalShow, setModalShow] = React.useState(false);

    return (
        <main>
             <AddNewEmployee
                show={modalShow}
                onHide={() => setModalShow(false)}
            />

            <Header title="Employees" />
            <Container as={'section'}>
                <Button onClick={() => setModalShow(true)} className="mt-3"><i class="bi bi-plus"></i> Add New</Button>
                <Table className="mt-3">
                    <thead>
                        <tr className="d-flex flex-wrap border-1">
                        <th className="border-0 col-12 col-md-6 col-lg-4" scope="col">Employee Name</th>
                        <th className="border-0 col-12 col-md-6 col-lg-4" scope="col">Employee Type</th>
                        <th className="border-0 col-12 col-md-6 col-lg-2" scope="col">Status</th>
                        <th className="border-0 col-12 col-md-6 col-lg-2" scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="d-flex flex-wrap border-1">
                            <td className="border-0 col-12 col-md-6 col-lg-4">Jane Smith</td>
                            <td className="border-0 col-12 col-md-6 col-lg-4">Customer Service</td>
                            <td className="border-0 col-12 col-md-6 col-lg-2"><Badge status="active" /></td>
                            <td className="border-0 col-12 col-md-6 col-lg-2"><Link to="/employees/employee">View Employee</Link></td>
                        </tr>     
                        <tr className="d-flex flex-wrap border-1">
                            <td className="border-0 col-12 col-md-6 col-lg-4">Jane Jones</td>
                            <td className="border-0 col-12 col-md-6 col-lg-4">Mechanic</td>
                            <td className="border-0 col-12 col-md-6 col-lg-2"><Badge status="terminated" /></td>
                            <td className="border-0 col-12 col-md-6 col-lg-2"><Link to="/employees/employee">View Employee</Link></td>
                        </tr>               
                    </tbody>
                </Table>
            </Container> 
        </main>
    )
}