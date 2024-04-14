import React from 'react';
import Container from 'react-bootstrap/Container';
import Header from '../../GeoHeader/GeoHeader.js';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Badge from '../../Badges/Badge.js';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';

function AddNewEmployee(props) {
    const [isValid, setIsValid] = useState(true);

    function addEmp() {
        // Validation
        let form = document.getElementById("newEmp");
        let err = document.getElementById("err")

        // Role
        if(!form.role.checkValidity() && form.role.value.length == 0) {
            err.innerText = "Please select a role"
            setIsValid(false)
            return
        }
        // Check first name
        if(!form.first.checkValidity()) {
            err.innerText = "Please add a first name"
            setIsValid(false)
            return
        }
        // Check last name
        if(!form.last.checkValidity()) {
            err.innerText = "Please add a last name"
            setIsValid(false)
            return
        }
        // Check email
        if(!form.email.checkValidity()) {
            err.innerText = "Please add a valid email"
            setIsValid(false)
            return
        }
        // Check username
        if(!form.username.checkValidity()) {
            err.innerText = "Please add a username"
            setIsValid(false)
            return
        }
        // Check password
        if(!form.password.checkValidity()) {
            err.innerText = "Please add a password"
            setIsValid(false)
            return
        }
        // Status
        if(!form.status.checkValidity() && form.status.value.length == 0) {
            err.innerText = "Please select a status"
            setIsValid(false)
            return
        }

        // Create new emp
        fetch("/api/addEmployee", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "auth-token": props.token
            },
            body: JSON.stringify({
                username: form.username.value,
                firstName: form.first.value,
                lastName: form.last.value,
                password: form.password.value,
                email: form.email.value,
                status: form.status.value,
                role: parseInt(form.role.value),
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
                err.innerText = "There was an issue submitting your request. Please check that the username is unique and try again."
                setIsValid(false)
            }
        }).catch(error => {
            console.log(error)
            err.innerText = "There was an issue submitting your request. Please try again."
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
            New Employee
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Alert variant="danger" className={'text-danger bg-danger-subtle' + (isValid ? ' d-none' : '')} id="err">
                There was an issue loading the data. Please try again.
            </Alert>
            <Form id="newEmp">
                <Form.Group className="mb-3" controlId="role">
                    <Form.Label>Employee Role</Form.Label>
                    <Form.Select name="roleSelect" required>
                        <option value="">Select...</option>
                        <option value="5">Customer Service</option>
                        <option value="4">Mechanic</option>       
                        <option value="3">Manager</option> 
                        {!props.issysadmin ? '' :
                        <option value="2">Business Admin</option> }            
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="first">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control type="text" placeholder="John" required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="last">
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control type="text" placeholder="Doe" required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="name@example.com" required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder="Username" required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="status">
                    <Form.Label>Status</Form.Label>
                    <Form.Select name="statusSelect" required>
                        <option value="">Select...</option>
                        <option value="Active">Active</option>
                        <option value="Suspended">Suspended</option>       
                        <option value="Terminated">Terminated</option>          
                    </Form.Select>
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="" onClick={props.onHide}>Cancel</Button>
          <Button onClick={() => {addEmp()}}>Submit</Button>
        </Modal.Footer>
      </Modal>
    );
  }

export default function Employees({token, issysadmin}) {
    const [modalShow, setModalShow] = useState(false);
    const [isValid, setIsValid] = useState(true)
    const [employees, setEmployees] = useState([])

    // Get data
    useEffect(() => {
        // Get employees
        fetch("/api/getAllEmployees", {
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
                    setEmployees(data)
                }
          }).catch(error => {
            setIsValid(false);
            console.log(error);
          });
    }, [modalShow])

    return (
        <main>
             <AddNewEmployee
                show={modalShow}
                onHide={() => setModalShow(false)}
                token={token}
                issysadmin={issysadmin}
            />

            <Header title="Employees" />
            <Container as={'section'}>
                <Alert variant="danger" className={'text-danger my-3 bg-danger-subtle' + (isValid ? ' d-none' : '')}>
                    There was an issue retrieving your data. Please refresh to try again.
                </Alert> 
                <Button onClick={() => setModalShow(true)} className="mt-3"><i class="bi bi-plus"></i> Add New</Button>
                {employees.length == 0 ? <p>There are no employees.</p> : 
                    <Table className="my-5">
                        <thead>
                            <tr className="d-flex flex-wrap border-1">
                            <th className="border-0 col-12 col-md-6 col-lg-4" scope="col">Employee Name</th>
                            <th className="border-0 col-12 col-md-6 col-lg-4" scope="col">Employee Type</th>
                            <th className="border-0 col-12 col-md-6 col-lg-2" scope="col">Status</th>
                            <th className="border-0 col-12 col-md-6 col-lg-2" scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((emp) => { return (
                                <tr className="d-flex flex-wrap border-1">
                                    <td className="border-0 col-12 col-md-6 col-lg-4">{emp.firstname + " " + emp.lastname}</td>
                                    <td className="border-0 col-12 col-md-6 col-lg-4">{emp.title}</td>
                                    <td className="border-0 col-12 col-md-6 col-lg-2"><Badge status={emp.status.toLowerCase()} /></td>
                                    <td className="border-0 col-12 col-md-6 col-lg-2"><Link to="/employees/employee" state={{ empID: emp.empid }}>View Employee</Link></td>
                                </tr>     
                            )})}
                        </tbody>
                    </Table>
                }
            </Container> 
        </main>
    )
}