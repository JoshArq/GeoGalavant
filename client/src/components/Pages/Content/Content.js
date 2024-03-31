import React from 'react';
import Container from 'react-bootstrap/Container';
import Header from '../../GeoHeader/GeoHeader.js';
import { Link } from 'react-router-dom';
import Badge from '../../Badges/Badge.js';
import Table from 'react-bootstrap/Table';

export default function Content() {
    return (
        <main>
            <Header title="Content" />
            <Container as={'section'}>
            <Table className="mt-3">
                <thead>
                    <tr className="d-flex flex-wrap border-1">
                    <th className="border-0 col-12 col-md-6 col-lg-4" scope="col">Employee Name</th>
                    <th className="border-0 col-12 col-md-6 col-lg-4" scope="col">Employee Type</th>
                    <th className="border-0 col-12 col-md-6 col-lg-2" scope="col">Status</th>
                    <th className="border-0 col-12 col-md-6 col-lg-2" scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="d-flex flex-wrap border-1">
                        <td className="border-0 col-12 col-md-6 col-lg-4">Jane Smith</td>
                        <td className="border-0 col-12 col-md-6 col-lg-4">Customer Service</td>
                        <td className="border-0 col-12 col-md-6 col-lg-2"><Badge status="active" /></td>
                        <td className="border-0 col-12 col-md-6 col-lg-2"><Link to="/messages/message">View Message</Link></td>
                    </tr>     
                    <tr className="d-flex flex-wrap border-1">
                        <td className="border-0 col-12 col-md-6 col-lg-4">Jane Jones</td>
                        <td className="border-0 col-12 col-md-6 col-lg-4">Mechanic</td>
                        <td className="border-0 col-12 col-md-6 col-lg-2"><Badge status="terminated" /></td>
                        <td className="border-0 col-12 col-md-6 col-lg-2"><Link to="/messages/message">View Message</Link></td>
                    </tr>               
                </tbody>
            </Table>
            </Container> 
        </main>
    )
}