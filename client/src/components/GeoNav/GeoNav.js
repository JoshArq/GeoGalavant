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
                <Navbar.Collapse className="justify-content-end">
                    <Nav>
                        { employees.includes(role) ? '' : <Nav.Link as={Link} to="/about" className="text-center mx-md-4 my-xs-4 my-md-0">About</Nav.Link> }
                        { employees.includes(role) ? '' : <Nav.Link as={Link} to="/contact" className="text-center mx-md-4 my-xs-4 my-md-0">Contact</Nav.Link> }
                        { customers.includes(role) ? <Nav.Link as={Link} to="/account" className="text-center mx-md-4 my-xs-4 my-md-0">My Account</Nav.Link> : '' }
                        { role ? <Nav.Link onClick={() => {clearData()}} className="text-center mx-md-4 my-xs-4 my-md-0">Logout</Nav.Link> : '' }
                        { role ? '' : <Nav.Link as={Link} to="/login" className="text-center mx-md-4 my-xs-4 my-md-0">Login</Nav.Link> }
                        { role ? '' : <Button as={Link} to="/apply" className="text-center mx-md-4 my-xs-4 my-md-0 d-inline d-sm-none d-md-inline" variant="primary">Apply</Button> }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}