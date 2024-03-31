import React from 'react';
import Container from 'react-bootstrap/Container';
import Header from '../../GeoHeader/GeoHeader.js';
import { Link } from 'react-router-dom';
import Badge from '../../Badges/Badge.js';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export default function Gyrocars() {
    return (
        <main>
            <Header title="Gyrocars" />
            <Container as={'section'}>
                <Row>
                    <Col>
                        <Button className="mt-3"><i class="bi bi-plus"></i> Add New</Button>
                    </Col>
                    <Col className="d-flex justify-content-end">
                        <Button className="mt-3">Submit Work Report</Button>
                    </Col>
                </Row>
            

                <Table className="mt-3">
                    <thead>
                        <tr className="d-flex flex-wrap border-1">
                        <th className="border-0 col-12 col-md-6 col-lg-4" scope="col">Vehicles</th>
                        <th className="border-0 col-12 col-md-6 col-lg-4" scope="col">Location</th>
                        <th className="border-0 col-12 col-md-6 col-lg-2" scope="col">Status</th>
                        <th className="border-0 col-12 col-md-6 col-lg-2" scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="d-flex flex-wrap border-1">
                            <td className="border-0 col-12 col-md-6 col-lg-4">Gyrocar 12346</td>
                            <td className="border-0 col-12 col-md-6 col-lg-4">Gyrogogo Center City</td>
                            <td className="border-0 col-12 col-md-6 col-lg-2"><Badge status="available" /></td>
                            <td className="border-0 col-12 col-md-6 col-lg-2"><Link to="/gyrocars/gyrocar">View Car</Link></td>
                        </tr>
                        <tr className="d-flex flex-wrap border-1">
                            <td className="border-0 col-12 col-md-6 col-lg-4">Gyrocar 12346</td>
                            <td className="border-0 col-12 col-md-6 col-lg-4">Gyrogogo Center City</td>
                            <td className="border-0 col-12 col-md-6 col-lg-2"><Badge status="inuse" /></td>
                            <td className="border-0 col-12 col-md-6 col-lg-2"><Link to="/gyrocars/gyrocar">View Car</Link></td>
                        </tr>
                        <tr className="d-flex flex-wrap border-1">
                            <td className="border-0 col-12 col-md-6 col-lg-4">Gyrocar 12346</td>
                            <td className="border-0 col-12 col-md-6 col-lg-4">Gyrogogo Center City</td>
                            <td className="border-0 col-12 col-md-6 col-lg-2"><Badge status="offline" /></td>
                            <td className="border-0 col-12 col-md-6 col-lg-2"><Link to="/gyrocars/gyrocar">View Car</Link></td>
                        </tr>            
                    </tbody>
                </Table>
            </Container> 
        </main>
    )
}