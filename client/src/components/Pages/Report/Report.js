import React from 'react';
import Container from 'react-bootstrap/Container';
import Header from '../../GeoHeader/GeoHeader.js';
import { Link } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';


export default function Report() {

    const reportType = 'rental';

    return (
        <main>
            <Container fluid as={'section'}>
                <p className="mt-3"><Link to="/reports">Back to Reports</Link></p>

                <Row>
                    <Col md="auto">
                        <h1>Report Name</h1>
                        <p className="mt-4">Date Range: 03/04/24</p>
                        <p>Created By: Employee Name</p>
                        <p>Type: Rentals</p>
                    </Col>
                </Row>
                <hr />
                {reportType === 'rental' ? (
                    <div>
                    <p className="mt-4"><b>Gyrogogo Center City</b></p>
                    <Table className="mt-3">
                        <thead>
                            <tr className="d-flex flex-wrap border-1">
                            <th className="border-0 col-12 col-md-6 col-lg-3" scope="col">Date</th>
                            <th className="border-0 col-12 col-md-6 col-lg-2" scope="col">Completed Rentals</th>
                            <th className="border-0 col-12 col-md-6 col-lg-2" scope="col">Current Rentals</th>
                            <th className="border-0 col-12 col-md-6 col-lg-2" scope="col">Pending Rentals</th>
                            <th className="border-0 col-12 col-md-6 col-lg-3" scope="col">Total Rentals</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="d-flex flex-wrap border-1">
                                <td className="border-0 col-12 col-md-6 col-lg-3">03/04/24</td>
                                <td className="border-0 col-12 col-md-6 col-lg-2">#</td>
                                <td className="border-0 col-12 col-md-6 col-lg-2">#</td>
                                <td className="border-0 col-12 col-md-6 col-lg-2">#</td>
                                <td className="border-0 col-12 col-md-6 col-lg-3">##</td>
                            </tr>
                            <tr className="d-flex flex-wrap border-1">
                                <td className="border-0 col-12 col-md-6 col-lg-3">03/05/24</td>
                                <td className="border-0 col-12 col-md-6 col-lg-2">#</td>
                                <td className="border-0 col-12 col-md-6 col-lg-2">#</td>
                                <td className="border-0 col-12 col-md-6 col-lg-2">#</td>
                                <td className="border-0 col-12 col-md-6 col-lg-3">##</td>
                            </tr>    
                            <tr className="d-flex flex-wrap border-1">
                                <td className="border-0 col-12 col-md-6 col-lg-3">03/06/24</td>
                                <td className="border-0 col-12 col-md-6 col-lg-2">#</td>
                                <td className="border-0 col-12 col-md-6 col-lg-2">#</td>
                                <td className="border-0 col-12 col-md-6 col-lg-2">#</td>
                                <td className="border-0 col-12 col-md-6 col-lg-3">##</td>
                            </tr>          
                            <tr className="d-flex flex-wrap border-1 grey-section" >
                                <td className="grey-section border-0 col-12 col-md-6 col-lg-3">Total</td>
                                <td className="grey-section border-0 col-12 col-md-6 col-lg-2">##</td>
                                <td className="grey-section border-0 col-12 col-md-6 col-lg-2">##</td>
                                <td className="grey-section border-0 col-12 col-md-6 col-lg-2">##</td>
                                <td className="grey-section border-0 col-12 col-md-6 col-lg-3">###</td>
                            </tr>             
                        </tbody>
                    </Table>
                    <p className="mt-4"><b>Totals</b></p>
                    <Row>
                        <Col className="mb-4" md="3">
                            <Card className="grey-section">
                                <Card.Body>
                                    <Card.Title as={'h3'} className="fs-4 fw-bold mb-3">
                                        Completed Total
                                    </Card.Title>
                                    <Card.Text>
                                        <p>###</p>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col className="mb-4" md="3">
                            <Card className="grey-section">
                                <Card.Body>
                                    <Card.Title as={'h3'} className="fs-4 fw-bold mb-3">
                                        Current Total
                                    </Card.Title>
                                    <Card.Text>
                                        <p>###</p>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col className="mb-4" md="3">
                            <Card className="grey-section">
                                <Card.Body>
                                    <Card.Title as={'h3'} className="fs-4 fw-bold mb-3">
                                        Pending Total
                                    </Card.Title>
                                    <Card.Text>
                                        <p>###</p>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col className="mb-4" md="3">
                            <Card className="grey-section">
                                <Card.Body>
                                    <Card.Title as={'h3'} className="fs-4 fw-bold mb-3">
                                        Overall Total
                                    </Card.Title>
                                    <Card.Text>
                                        <p>###</p>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                    </div>
                ) : (

                    <Table className="mt-3">
                        <thead>
                            <tr className="d-flex flex-wrap border-1">
                            <th className="border-0 col-12 col-md-6 col-lg-3" scope="col">Month</th>
                            <th className="border-0 col-12 col-md-6 col-lg-2" scope="col">Approved Applications</th>
                            <th className="border-0 col-12 col-md-6 col-lg-2" scope="col">Denied Applications</th>
                            <th className="border-0 col-12 col-md-6 col-lg-2" scope="col">Applications In Progress</th>
                            <th className="border-0 col-12 col-md-6 col-lg-3" scope="col">Total Applications</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="d-flex flex-wrap border-1">
                                <td className="border-0 col-12 col-md-6 col-lg-3">March 2024</td>
                                <td className="border-0 col-12 col-md-6 col-lg-2">#</td>
                                <td className="border-0 col-12 col-md-6 col-lg-2">#</td>
                                <td className="border-0 col-12 col-md-6 col-lg-2">#</td>
                                <td className="border-0 col-12 col-md-6 col-lg-3">##</td>
                            </tr>
                            <tr className="d-flex flex-wrap border-1">
                                <td className="border-0 col-12 col-md-6 col-lg-3">April 2024</td>
                                <td className="border-0 col-12 col-md-6 col-lg-2">#</td>
                                <td className="border-0 col-12 col-md-6 col-lg-2">#</td>
                                <td className="border-0 col-12 col-md-6 col-lg-2">#</td>
                                <td className="border-0 col-12 col-md-6 col-lg-3">##</td>
                            </tr>         
                        </tbody>
                    </Table>
                    
                )}
            </Container> 
        </main>
    )
}