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
                    <th className="border-0 col-12 col-md-6 col-lg-4" scope="col">Page</th>
                    <th className="border-0 col-12 col-md-6 col-lg-4" scope="col">Section</th>
                    <th className="border-0 col-12 col-md-6 col-lg-2" scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="d-flex flex-wrap border-1">
                        <td className="border-0 col-12 col-md-6 col-lg-4">Marketing</td>
                        <td className="border-0 col-12 col-md-6 col-lg-4">Need a Ride?</td>
                        <td className="border-0 col-12 col-md-6 col-lg-2"><Link to="/content/contentdetail">View Section</Link></td>
                    </tr>     
                    <tr className="d-flex flex-wrap border-1">
                        <td className="border-0 col-12 col-md-6 col-lg-4">About Us</td>
                        <td className="border-0 col-12 col-md-6 col-lg-4">How does it work?</td>
                        <td className="border-0 col-12 col-md-6 col-lg-2"><Link to="/content/contentDetail">View Section</Link></td>
                    </tr>               
                </tbody>
            </Table>
            </Container> 
        </main>
    )
}