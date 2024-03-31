import React from 'react';
import Container from 'react-bootstrap/Container';
import Header from '../../GeoHeader/GeoHeader.js';
import { Link } from 'react-router-dom';
import Badge from '../../Badges/Badge.js';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

function AddNewReport(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            New Report
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group className="mb-3" controlId="reportName">
                    <Form.Label>Report Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter report name" required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="startDate">
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control type="datetime-local" required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="endDate">
                    <Form.Label>End Date</Form.Label>
                    <Form.Control type="datetime-local" required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="reportType">
                    <Form.Label>Report Type</Form.Label>
                    <Form.Select name="reportTypeSelect" required>
                        <option value="">Select...</option>
                        <option value="applications">Applications</option>   
                        <option value="rentals">Rentals</option> 
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

export default function Reports() {
    const [modalShow, setModalShow] = React.useState(false);

    return (
        <main>
             <AddNewReport
                show={modalShow}
                onHide={() => setModalShow(false)}
            />

            <Header title="Reports" />
            <Container as={'section'}>
                <Button onClick={() => setModalShow(true)} className="mt-3"><i class="bi bi-plus"></i> Add New</Button>
                <Table className="mt-3">
                    <thead>
                        <tr className="d-flex flex-wrap border-1">
                        <th className="border-0 col-12 col-md-6 col-lg-4" scope="col">Report Name</th>
                        <th className="border-0 col-12 col-md-6 col-lg-4" scope="col">Created By</th>
                        <th className="border-0 col-12 col-md-6 col-lg-2" scope="col">Date Created</th>
                        <th className="border-0 col-12 col-md-6 col-lg-2" scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="d-flex flex-wrap border-1">
                            <td className="border-0 col-12 col-md-6 col-lg-4">Report Name</td>
                            <td className="border-0 col-12 col-md-6 col-lg-4">Jane Jane</td>
                            <td className="border-0 col-12 col-md-6 col-lg-2">12/03/2024</td>
                            <td className="border-0 col-12 col-md-6 col-lg-2"><Link to="/reports/report">View Report</Link></td>
                        </tr>     
                        <tr className="d-flex flex-wrap border-1">
                            <td className="border-0 col-12 col-md-6 col-lg-4">Report Name</td>
                            <td className="border-0 col-12 col-md-6 col-lg-4">Employee Name</td>
                            <td className="border-0 col-12 col-md-6 col-lg-2">01/04/2024</td>
                            <td className="border-0 col-12 col-md-6 col-lg-2"><Link to="/reports/report">View Report</Link></td>
                        </tr>               
                    </tbody>
                </Table>
            </Container> 
        </main>
    )
}