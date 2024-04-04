import React from 'react';
import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Header from '../../GeoHeader/GeoHeader.js';
import { Link } from 'react-router-dom';
import Badge from '../../Badges/Badge.js';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import './Customers.scss';


export default function Customers({token}) {
    const [customers, setCustomers] = useState([]);
    const [isValid, setIsValid] = useState(true);

    // Get data
    useEffect(() => {
        // Get customers
        fetch("/api/getAllCustomers", {
            headers: {
              "auth-token": token
            }
          })
          .then((res) => res.json())
          .then((data) => {
                if(data.error) {
                    setIsValid(false);
                    console.log(data.error);
                }
                else {
                    setCustomers(data)
                    console.log(data)
                }
          }).catch(error => {
            setIsValid(false);
            console.log(error);
          });
    }, [])

    return (
        <main>
            <Header title="Customers" />
            <Container as={'section'}>
                <Alert variant="danger" className={'text-danger my-3 bg-danger-subtle' + (isValid ? ' d-none' : '')} id="err">
                    There was an issue retrieving your data. Please refresh to try again.
                </Alert> 
                {customers.length == 0 ? <p>There are no users.</p> : 
                    <Table className="my-5">
                        <thead>
                            <tr className="d-flex flex-wrap border-1">
                            <th className="border-0 col-12 col-md-6 col-lg-4" scope="col">Customer Name</th>
                            <th className="border-0 col-12 col-md-6 col-lg-4" scope="col">Email</th>
                            <th className="border-0 col-12 col-md-6 col-lg-2" scope="col">Status</th>
                            <th className="border-0 col-12 col-md-6 col-lg-2" scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((cust) => { return (
                                <tr className="d-flex flex-wrap border-1">
                                    <td className="border-0 col-12 col-md-6 col-lg-4">{cust.firstname + " " + cust.lastname}</td>
                                    <td className="border-0 col-12 col-md-6 col-lg-4">{cust.email}</td>
                                    <td className="border-0 col-12 col-md-6 col-lg-2"><Badge status={cust.statusname.toLowerCase()} /></td>
                                    <td className="border-0 col-12 col-md-6 col-lg-2"><Link to="/customers/customer" state={{ custID: cust.customerid }}>View Customer</Link></td>
                                </tr>
                            )})}
                        </tbody>
                    </Table>
                }
            </Container> 
        </main>
    )
}