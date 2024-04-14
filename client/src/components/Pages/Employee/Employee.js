import React from 'react';
import Container from 'react-bootstrap/Container';
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Badge from '../../Badges/Badge.js';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

function ChangeStatusModal(props) {
  const [isValid, setIsValid] = useState(true);

  function changeStatus() {
    // Validate
    let form = document.getElementById("changestatus");
    let err = document.getElementById("err");

    // Check status is selected and different
    if (!form.status.checkValidity() || form.status.value.length == 0 || form.status.value == props.status) {
        err.innerText = "Please select a new status"
        setIsValid(false)
        return
    }

    // Check reason is filled out
    if (!form.reason.checkValidity()) {
        err.innerText = "Please add a reason"
        setIsValid(false)
        return
    }

    // Send new status
    fetch("/api/changeEmployeeStatus", {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            "auth-token": props.token
        },
        body: JSON.stringify({
            reason: form.reason.value,
            empId: props.empid,
            status: form.status.value,
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
            err.innerText = "There was an issue submitting your change request. Please try again."
            setIsValid(false)
        }
    }).catch(error => {
        console.log(error)
        err.innerText = "There was an issue submitting your change request. Please try again."
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
          Change Status
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
          <Alert variant="danger" className={'text-danger m-3 bg-danger-subtle' + (isValid ? ' d-none' : '')} id="err">
              There was an issue retrieving your data. Please refresh to try again.
          </Alert> 
          <Form id="changestatus">
              <Form.Group className="mb-3" controlId="status">
                  <Form.Label>Status</Form.Label>
                  <Form.Select name="statusSelect" required>
                      <option value="">Select...</option>
                      <option value="Active">Active</option>
                      <option value="Terminated">Terminated</option>
                      <option value="Suspended">Suspended</option>                    
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
        <Button onClick={() => {changeStatus()}}>Save Changes</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default function Employee({token}) {
    const location = useLocation()
    const { empID } = location.state
    const [modalShow, setModalShow] = React.useState(false);
    const [details, setDetails] = useState({});
    const [isValid, setIsValid] = useState(true);

    // Get data
    useEffect(() => {
      // Get customers
      fetch("/api/getEmployeeDetails", {
        method: 'POST',
        headers: {
          "auth-token": token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({empId: empID}),
      })
      .then((res) => res.json())
      .then((data) => {
            if(data.error) {
                setIsValid(false);
                console.log(data.error);
            }
            else {
                setDetails(data[0])
            }
      }).catch(error => {
        setIsValid(false);
        console.log(error);
      });
    }, [modalShow])

    return (
        <main>
             <ChangeStatusModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                status={details.status ? details.status : ""}
                empid={details.empid ? details.empid : "-1"}
                token={token}
            />

            <Alert variant="danger" className={'text-danger m-3 bg-danger-subtle' + (isValid ? ' d-none' : '')}>
                There was an issue retrieving your data. Please refresh to try again.
            </Alert> 

            {!details.firstname ? <p className="mt-3"><Link to="/employees" className="link-underline link-underline-opacity-0"><i className="bi bi-chevron-left me-3 color-primary"></i>Back to Employees</Link><br/><br/>This employee does not exist.</p> :
              <Container fluid as={'section'}>
                  <p className="m-3"><Link to="/employees" className="link-underline link-underline-opacity-0"><i className="bi bi-chevron-left me-3 color-primary"></i>Back to Employees</Link></p>

                  <Row>
                      <Col md="auto">
                          <h1>{details.firstname + " " + details.lastname}</h1>
                      </Col>
                      <Col className="d-flex align-items-center">
                          <Button onClick={() => setModalShow(true)}>Change Status</Button>
                      </Col>
                  </Row>
                  <Badge status={details.status.toLowerCase()}/> 
                  <p className="mt-4"><b>Employee Type</b><br/>{details.title}</p>
                  <p><b>Location</b><br/>Unknown</p>
              </Container> 
            }
        </main>
    )
}