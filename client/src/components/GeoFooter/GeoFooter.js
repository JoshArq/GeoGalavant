import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import logo from '../../assets/Logo-Grey.jpg';
import './GeoFooter.scss'

export default function GeoFooter() {
    return (
        <footer className="mw-100 text-white py-5">
            <Container>
                <img src={logo} alt="GyroGoGo" id="logo" className="mw-100"/>
                <Row className="my-4 py-4 border-top border-bottom border-white border-2 border-opacity-10">
                    <Col sm={4}>
                        <p><b>Reservation</b></p>
                        <p><a href="#apply" className="text-white link-underline link-underline-opacity-0">Apply</a></p>
                        <p><a href="#login" className="text-white link-underline link-underline-opacity-0">Login</a></p>
                    </Col>
                    <Col sm={4}>
                        <p><b>Contact</b></p>
                        <p><a href="#contact" className="text-white link-underline link-underline-opacity-0">FAQs</a></p>
                        <p><a href="#contact" className="text-white link-underline link-underline-opacity-0">Contact Us</a></p>
                    </Col>
                    <Col sm={4}>
                        <p><b>Company</b></p>
                        <p><a href="#about" className="text-white link-underline link-underline-opacity-0">About</a></p>
                        <p><a href="#tos" className="text-white link-underline link-underline-opacity-0">Terms of Use</a></p>
                    </Col>
                </Row>
                <p className="text-center">Copyright &copy; 2023</p>
            </Container>
        </footer>
    )
}