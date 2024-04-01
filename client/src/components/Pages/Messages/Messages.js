import React from 'react';
import Container from 'react-bootstrap/Container';
import Header from '../../GeoHeader/GeoHeader.js';
import { Link } from 'react-router-dom';
import Badge from '../../Badges/Badge.js';
import Table from 'react-bootstrap/Table';

export default function Messages() {
    return (
        <main>
            <Header title="Messages" />
            <Container as={'section'}>
            <Table className="mt-3">
                <thead>
                    <tr className="d-flex flex-wrap border-1">
                    <th className="border-0 col-12 col-md-6 col-lg-4" scope="col">Message</th>
                    <th className="border-0 col-12 col-md-6 col-lg-4" scope="col">Date Submitted</th>
                    <th className="border-0 col-12 col-md-6 col-lg-2" scope="col">Status</th>
                    <th className="border-0 col-12 col-md-6 col-lg-2" scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="d-flex flex-wrap border-1">
                        <td style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }} className="border-0 col-12 col-md-6 col-lg-4">My application got denied. Am I allowed to apply again?</td>
                        <td className="border-0 col-12 col-md-6 col-lg-4">##/##/####</td>
                        <td className="border-0 col-12 col-md-6 col-lg-2"><Badge status="resolved" /></td>
                        <td className="border-0 col-12 col-md-6 col-lg-2"><Link to="/messages/message">View Message</Link></td>
                    </tr>     
                    <tr className="d-flex flex-wrap border-1">
                        <td style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }} className="border-0 col-12 col-md-6 col-lg-4">My application got denied. Am I allowed to apply again?</td>
                        <td className="border-0 col-12 col-md-6 col-lg-4">##/##/####</td>
                        <td className="border-0 col-12 col-md-6 col-lg-2"><Badge status="unresolved" /></td>
                        <td className="border-0 col-12 col-md-6 col-lg-2"><Link to="/messages/message">View Message</Link></td>
                    </tr>               
                </tbody>
                </Table>
            </Container> 
        </main>
    )
}