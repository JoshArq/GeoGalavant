import React from 'react';
import Container from 'react-bootstrap/Container';
import Header from '../../GeoHeader/GeoHeader.js';
import { Link } from 'react-router-dom';
import Badge from '../../Badges/Badge.js';
import Table from 'react-bootstrap/Table';
import './Customers.scss';


export default function Customers() {
    return (
        <main>
            <Header title="Customers" />
            <Container as={'section'}>
                {/* <p>Employee stuff here :)</p>
                <p><Link to="/customers/customer">View a customer</Link></p> */}
                <Table responsive="md" style={{ tableLayout: 'fixed' }}>
                <thead>
                    <tr>
                    <th className="table-big-width" scope="col">Customer Name</th>
                    <th className="table-big-width" scope="col">Email</th>
                    <th className="table-sm-width" scope="col">Status</th>
                    <th className="table-sm-width" scope="col">Action</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="tr-width">
                        <td className="table-big-width">Arlene McCoy</td>
                        <td className="table-big-width">arlenemccoy@gmail.com </td>
                        <td className="table-sm-width"><Badge status="active" /></td>
                        <td className="table-sm-width"><Link to="/customers/customer">View Customer</Link></td>
                    </tr>
                    <tr className="tr-width">
                        <td className="table-big-width">Arlene McCoy</td>
                        <td className="table-big-width">arlenemccoy@gmail.com </td>
                        <td className="table-sm-width"><Badge status="needs" /></td>
                        <td className="table-sm-width"><Link to="/customers/customer">View Customer</Link></td>
                    </tr>
                    <tr className="tr-width">
                        <td className="table-big-width">Arlene McCoy</td>
                        <td className="table-big-width">arlenemccoy@gmail.com </td>
                        <td className="table-sm-width"><Badge status="denied" /></td>
                        <td className="table-sm-width"><Link to="/customers/customer">View Customer</Link></td>
                    </tr>
                    <tr className="tr-width">
                        <td className="table-big-width">Arlene McCoy</td>
                        <td className="table-big-width">arlenemccoy@gmail.com </td>
                        <td className="table-sm-width"><Badge status="suspended" /></td>
                        <td className="table-sm-width"><Link to="/customers/customer">View Customer</Link></td>
                    </tr>
                    <tr className="tr-width">
                        <td className="table-big-width">Arlene McCoy</td>
                        <td className="table-big-width">arlenemccoy@gmail.com </td>
                        <td className="table-sm-width"><Badge status="terminated" /></td>
                        <td className="table-sm-width"><Link to="/customers/customer">View Customer</Link></td>
                    </tr>
                   
                </tbody>
                </Table>
            </Container> 
        </main>
    )
}