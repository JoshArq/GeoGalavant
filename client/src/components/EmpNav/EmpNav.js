import React from 'react';
import { useLocation } from 'react-router-dom'
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom';
import './EmpNav.scss'

export default function EmpNav({role, roles, clearData}) {
    const location = useLocation();
    console.log(roles.admins.includes(role))
    return (
        <Col md={2} className="d-none d-md-block px-0 empNav">
            <Nav>
                { roles.managerUp.includes(role) ?
                    <Nav.Link as={Link} to="/dashboard" id={location.pathname == "/dashboard" ? "active" : ''} className="d-block text-reset w-100 py-3 blue-hov">
                        <i className="bi bi-graph-up me-2"></i>Dashboard
                    </Nav.Link>
                : '' }
                {roles.sysadmin.includes(role) ?
                    <Nav.Link as={Link} to="/content" id={location.pathname == "/content" ? "active" : ''} className="d-block text-reset w-100 py-3 blue-hov">
                        <i className="bi bi-window-sidebar me-2"></i>Content
                    </Nav.Link>
                : '' }
                {roles.custserveUp.includes(role) ? 
                    <Nav.Link as={Link} to="/customers" id={location.pathname == "/customers" ? "active" : ''} className="d-block text-reset w-100 py-3 blue-hov">
                        <i className="bi bi-person-fill me-2"></i>Customers
                    </Nav.Link>
                : '' }
                <Nav.Link as={Link} to="/reports" id={location.pathname == "/reports" ? "active" : ''} className="d-block text-reset w-100 py-3 blue-hov">
                    <i className="bi bi-file-bar-graph-fill me-2"></i>Reports
                </Nav.Link>
                {roles.custserveUp.includes(role) ? 
                    <Nav.Link as={Link} to="/messages" id={location.pathname == "/messages" ? "active" : ''} className="d-block text-reset w-100 py-3 blue-hov">
                        <i className="bi bi-chat-left-fill me-2"></i>Messages
                    </Nav.Link>
                : '' }
                {roles.mechUp.includes(role) ? 
                    <Nav.Link as={Link} to="/gyrocars" id={location.pathname == "/gryocars" ? "active" : ''} className="d-block text-reset w-100 py-3 blue-hov">
                        <i className="bi bi-car-front-fill me-2"></i>Gyrocars
                    </Nav.Link>
                : '' }
                {roles.admins.includes(role) ? 
                <Nav.Link as={Link} to="/employees" id={location.pathname == "/employees" ? "active" : ''} className="d-block text-reset w-100 py-3 blue-hov">
                    <i className="bi bi-people-fill me-2"></i>Employees
                </Nav.Link>
                : '' }
                <Nav.Link as={Link} to="/employee/account" id={location.pathname == "/employee/account" ? "active" : ''} className="d-block text-reset w-100 py-3 blue-hov">
                    <i className="bi bi-person-circle me-2"></i>Account
                </Nav.Link>
            </Nav>
        </Col>
    )
}