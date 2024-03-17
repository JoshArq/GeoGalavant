import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Link } from 'react-router-dom';
import logo from '../../assets/Logo-Grey.jpg';
import tos from '../../assets/GyroGoGo Rental Terms and Conditions.pdf';
import './GeoFooter.scss'

export default function GeoFooter() {
    return (
        <footer className="mw-100 text-white py-5">
            <Container>
                <img src={logo} alt="GyroGoGo" id="logo" className="mw-100"/>
                <Row className="my-4 py-4 border-top border-bottom border-white border-2 border-opacity-10">
                    <Col sm={4}>
                        <p><b>Reservation</b></p>
                        <p><Link to="/apply" className="text-white link-underline link-underline-opacity-0">Apply</Link></p>
                        <p><Link to="/login" className="text-white link-underline link-underline-opacity-0">Login</Link></p>
                    </Col>
                    <Col sm={4}>
                        <p><b>Contact</b></p>
                        <p><Link to="/contact" className="text-white link-underline link-underline-opacity-0">FAQs</Link></p>
                        <p><Link to="/contact#contact" className="text-white link-underline link-underline-opacity-0">Contact Us</Link></p>
                    </Col>
                    <Col sm={4}>
                        <p><b>Company</b></p>
                        <p><Link to="/about" className="text-white link-underline link-underline-opacity-0">About</Link></p>
                        <p><a href={tos} target="_blank" className="text-white link-underline link-underline-opacity-0">Terms of Use</a></p>
                    </Col>
                </Row>
                <p className="text-center">Copyright &copy; 2023</p>
            </Container>
        </footer>
    )
}