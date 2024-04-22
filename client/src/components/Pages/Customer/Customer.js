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
    const [isValid, setIsValid] = useState(true);
    
    function changeStatus() {
        // Validate
        let form = document.getElementById("changestatus");
        let err = document.getElementById("err");

        // Check status is selected and different
        if (!form.status.checkValidity() || form.status.value.length == 0 || parseInt(form.status.value) == props.statusid) {
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
        fetch("/api/changeStatus", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "auth-token": props.token
            },
            body: JSON.stringify({
                reason: form.reason.value,
                userId: props.userid,
                statusId: parseInt(form.status.value),
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
                    <Form.Select name="statusSelect" required defaultValue={props.statusid}>
                        <option value="">Select...</option>
                        <option value="1">Needs Approval</option>
                        <option value="3">Active</option>
                        <option value="4">Denied</option>  
                        <option value="2">Suspended</option> 
                        <option value="5">Terminated</option>                    
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

export default function Customer({token}) {
    const location = useLocation()
    const { custID } = location.state
    const [modalShow, setModalShow] = React.useState(false);
    const [details, setDetails] = useState({});
    const [reservations, setReservations] = useState([]);
    const [isValid, setIsValid] = useState(true);
    const [expDate, setExpDate] = useState("");

    
    // Get data
    useEffect(() => {
        // Get customer
        fetch("/api/getCustomerDetails", {
            method: 'POST',
            headers: {
              "auth-token": token,
              "Content-Type": "application/json"
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
                    setExpDate(new Date(data.licenseexpires))

                    // Get reservations
                    fetch("/api/getReservationsByUserID ", {
                        method: 'POST',
                        headers: {
                        "auth-token": token,
                        "Content-Type": "application/json"
                        },
                        body: JSON.stringify({userID: data.userid}),
                    })
                    .then((res) => res.json())
                    .then((data) => {
                            if(data.error || data.reservations.error) {
                            // turned off bc this is throwing off the page load for unapproved customers
                                setIsValid(false);
                                console.log(data.error);
                            }
                            else {
                            setReservations(data.reservations)
                            }
                    }).catch(error => {
                        setIsValid(false);
                        console.log(error);
                    });
                }
          }).catch(error => {
            setIsValid(false);
            console.log(error);
          });
    }, [modalShow])

    function makeTimestamp(date) {
        let mins = date.getMinutes();
        if (mins < 10) {
            mins = "0" + mins;
        }

        return date.getMonth() 
                + "/" + date.getDate() + "/" 
                + date.getFullYear() + " at " 
                + date.getHours() 
                + ":" + mins
    }

    return (
        <main>
             <ChangeStatusModal
                show={modalShow}
                onHide={() => setModalShow(false)}
                statusid={details.statusid ? details.statusid : "0"}
                userid={details.userid ? details.userid : "-1"}
                token={token}
            />

            <Alert variant="danger" className={'text-danger m-3 bg-danger-subtle' + (isValid ? ' d-none' : '')}>
                There was an issue retrieving your data. Please refresh to try again.
            </Alert> 

            {!details.firstname ? <p className="m-3"><Link to="/customers" className="link-underline link-underline-opacity-0"><i className="bi bi-chevron-left me-3 color-primary"></i>Back to Customers</Link><br/><br/>This customer does not exist.</p> : 
                <>
                    <Container fluid as={'section'}>
                        <p className="mt-3"><Link to="/customers" className="link-underline link-underline-opacity-0"><i className="bi bi-chevron-left me-3 color-primary"></i>Back to Customers</Link></p>
                        <Row>
                            <Col md="auto">
                                <h1>{details.firstname + " " + details.lastname}</h1>
                            </Col>
                            <Col className="d-flex align-items-center">
                                <Button onClick={() => setModalShow(true)}>Change Status</Button>
                            </Col>
                        </Row>
                        <Badge status={details.statusname.toLowerCase()}/> 
                        <Row className="mt-2">
                            <Col md="4">
                                <p><b>Username</b><br/>{details.username}</p>
                            </Col>
                            <Col md="4">
                                <p><b>Email</b><br/>{details.email}</p>
                            </Col>
                            <Col md="4">
                                <p className="fw-bold mb-1">Driver's License</p>
                                <p className="mb-1">Number: {details.licensenumber}</p>
                                <p className="mb-1">Expires: {expDate.getMonth() + "/" + expDate.getDate() + "/" + expDate.getFullYear()}</p>
                            </Col>
                        </Row>
                    </Container> 
                    <div className="grey-section pb-4">

                        <Container as={'section'}>

                            <h2 className="pt-3 pb-3">Reservations</h2>
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
                                {reservations.length == 0 ? '' : reservations.map((res) => { return (
                                    <tr className="tr-width">
                                        <td>{res.reservationNumber}</td>
                                        <td>{makeTimestamp(new Date(res.pickupDateTime))} <br/>{res.pickupStationName}</td>
                                        <td>{makeTimestamp(new Date(res.dropoffDateTime))} <br/>{res.dropoffStationName}</td>
                                        <td>unknown</td>
                                        <td>unknown</td>
                                        <td> <Link to="/ModifyReservation/ModifyReservation" state={{ resID: res.reservationNumber, custID: custID }}><i class="bi bi-pencil-square"></i></Link></td>
                                    </tr>  
                                )})}                 
                            </tbody>
                            </Table>
                        </Container>
                    </div>
                </>
            }
        </main>
    )
}