import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import logo from '../../assets/Logo.png';
import './GeoNav.scss'

export default function GeoNav({role, roles, clearData}) {
    return (
        <Navbar expand="md" bg="light" data-bs-theme="light" className="shadow-sm">
            <Container>
                <Navbar.Toggle aria-controls="basic-navbar-nav" id="toggle" className="me-2"/>
                <Navbar.Brand  as={Link} to="/" className="flex-grow-1">
                    <img 
                        src={logo} alt="GyroGoGo"
                        width="100"
                        className="mw-100"
                    />
                </Navbar.Brand>
                { role ? '' : <Button as={Link} to="/apply" className="d-none d-sm-block d-md-none" variant="primary">Apply</Button> }
                { roles.approvedCustomer.includes(role) ? <Button as={Link} to="/reserve" className="d-none d-sm-block d-md-none" variant="primary">Reserve</Button> : '' }
                <Navbar.Collapse className="justify-content-end">
                    <Nav className="align-items-center">
                        { roles.employees.includes(role) ? '' : <Nav.Link as={Link} to="/about" className="text-center mx-md-4 my-xs-4 my-md-0">About</Nav.Link> }
                        { roles.employees.includes(role) ? '' : <Nav.Link as={Link} to="/contact" className="text-center mx-md-4 my-xs-4 my-md-0">Contact</Nav.Link> }
                        { roles.customers.includes(role) ? <Nav.Link as={Link} to="/account" className="text-center mx-md-4 my-xs-4 my-md-0">My Account</Nav.Link> : '' }
                        { roles.managerUp.includes(role) ? <Nav.Link as={Link} to="/dashboard" className="d-md-none text-center mx-md-4 my-xs-4 my-md-0"><i className="bi bi-graph-up me-2"></i>Dashboard</Nav.Link> : ''}
                        { roles.sysadmin.includes(role) ? <Nav.Link as={Link} to="/content" className="d-md-none text-center mx-md-4 my-xs-4 my-md-0"><i className="bi bi-window-sidebar me-2"></i>Content</Nav.Link>  : ''}
                        { roles.custserveUp.includes(role) ? <Nav.Link as={Link} to="/customers" className="d-md-none text-center mx-md-4 my-xs-4 my-md-0"><i className="bi bi-person-fill me-2"></i>Customers</Nav.Link>  : ''}
                        { roles.employees.includes(role) ? <Nav.Link as={Link} to="/reports" className="d-md-none text-center mx-md-4 my-xs-4 my-md-0"><i className="bi bi-file-bar-graph-fill me-2"></i>Reports</Nav.Link>  : ''}
                        { roles.custserveUp.includes(role) ? <Nav.Link as={Link} to="/messages" className="d-md-none text-center mx-md-4 my-xs-4 my-md-0"><i className="bi bi-chat-left-fill me-2"></i>Messages</Nav.Link>  : ''}
                        { roles.mechUp.includes(role) ? <Nav.Link as={Link} to="/gyrocars" className="d-md-none text-center mx-md-4 my-xs-4 my-md-0"><i className="bi bi-car-front-fill me-2"></i>Gyrocars</Nav.Link>  : ''}
                        { roles.admins.includes(role) ? <Nav.Link as={Link} to="/employees" className="d-md-none text-center mx-md-4 my-xs-4 my-md-0"><i className="bi bi-people-fill me-2"></i>Employees</Nav.Link>  : ''}
                        { roles.employees.includes(role) ? <Nav.Link as={Link} to="/employee/account" className="d-md-none text-center mx-md-4 my-xs-4 my-md-0"><i className="bi bi-person-circle me-2"></i>Account</Nav.Link>  : ''}
                        { role ? <Nav.Link onClick={() => {clearData()}} className="text-center mx-md-4 my-xs-4 my-md-0">Logout</Nav.Link> : '' }
                        { role ? '' : <Nav.Link as={Link} to="/login" className="text-center mx-md-4 my-xs-4 my-md-0">Login</Nav.Link> }
                        { role ? '' : <Button as={Link} to="/apply" className="text-center mx-md-4 my-xs-4 my-md-0 d-inline d-sm-none d-md-inline" variant="primary">Apply</Button> }
                        { roles.approvedCustomer.includes(role) ? <Button as={Link} to="/reserve" className="text-center mx-md-4 my-xs-4 my-md-0 d-inline d-sm-none d-md-inline" variant="primary">Reserve</Button> : '' }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}