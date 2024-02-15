import * as React from 'react';
import Header from '../../GeoHeader/GeoHeader.js';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import { Link } from 'react-router-dom';
import court from '../../../assets/Court-Building.jpg';
import woman from '../../../assets/Car-Woman.jpg';

export default function About() {
    return (
        <main>
            <Header title="About Us" />
            <Container>
                <Row as={'section'} className="py-5">
                    <Col md={6} className="d-flex flex-column justify-content-center">
                        <hr className="border-top border-secondary opacity-100 border-4 w-50"/>
                        <h2 className="fw-bold py-4">Our purpose</h2>
                        <p>We invite you to join us in using GyroGoGo for easy, convenient personal transportation. Rent a gyrocar for a single run into downtown, or rent it for the day to visit multiple destinations. The cars are designed to carry a single passenger and a small amount of cargo. </p>
                    </Col>
                    <Col md={6} className="d-flex align-items-center pt-4 pt-md-0">
                        <Image src={court} alt="Gyrocar in front of the Monroe County Courthouse" rounded fluid />
                    </Col>
                </Row>
                <Row as={'section'} className="py-5">
                    <Col md={{ span: 6, order: 'last' }} className="d-flex flex-column justify-content-center">
                        <hr className="border-top border-secondary opacity-100 border-4 w-50"/>
                        <h2 className="fw-bold py-4">Why gyrocars?</h2>
                        <p>Gyrocars are easy to drive because internal gyroscopes balance the cars for you. You don’t need any special training to drive a gyrocar, just slide in and go! These cars have a small profile, so are easy to navigate through traffic – and parking is a breeze. County regulations even allow gyrocars to be parked in designated motorcycle slots.</p>
                        <p>You can also save money! Renting an environmentally friendly gyrocar as needed is far more cost effective than commuting in an automobile that you own and maintain.</p>
                    </Col>
                    <Col md={{ span: 6, order: 'first' }} className="d-flex align-items-center pt-4 pt-md-0">
                        <Image src={woman} alt="Woman on the phone getting out of a Gyrocar" rounded fluid />
                    </Col>
                </Row>
                <Row as={'section'} className="py-5">
                    <Col md={10} lg={9}>
                        <hr className="border-top border-secondary opacity-100 border-4 w-25"/>
                        <h2 className="fw-bold py-4">How does it work?</h2>
                        <p>We have five convenient pick up/drop off locations in Monroe County, including in center city. Your rental is operated with a unique access code that prevents anyone else from entering your vehicle. If you’ve opted for a longer rental, our gyrocars can be recharged at any EV charging station.</p>
                        <p>If you need more information, check out the Q&A section or send us a message through our <Link to="/contact">Contact Page</Link>.</p>
                    </Col>
                </Row>
            </Container>
            <section className="bg-primary mb-5 py-5 text-white text-center">
                <Container>
                    <h2 className="fw-bold mb-4">It’s easy. It’s convenient. It’s cost effective. <em>GyroGoGo!</em></h2>
                    <hr className="opacity-100 border-2 w-25 mx-auto"/>
                    <p className="fw-bold mt-4">Gyrogogo, Inc. is a privately owned, United States based corporation that provides commuting solutions for individuals. </p>
                </Container>
            </section>
        </main>
    )
}