import React from 'react';
import { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Header from '../../GeoHeader/GeoHeader.js';
import { Link } from 'react-router-dom';
import Badge from '../../Badges/Badge.js';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';

export default function Messages({token}) {
    const [messages, setMessages] = useState([]);
    const [isValid, setIsValid] = useState(true);

    // Get data
    useEffect(() => {
        // Get customers
        fetch("/api/getMessages", {
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
                    setMessages(data)
                    console.log(data)
                }
          }).catch(error => {
            setIsValid(false);
            console.log(error);
          });
    }, [])

    function makeTimestamp(date) {
        return date.getMonth() 
                + "/" + date.getDate() + "/" 
                + date.getFullYear() + " at " 
                + date.getHours() 
                + ":" + date.getMinutes()
    }

    return (
        <main>
            <Header title="Messages" />
            <Container as={'section'}>
                <Alert variant="danger" className={'text-danger my-3 bg-danger-subtle' + (isValid ? ' d-none' : '')} id="err">
                    There was an issue retrieving your data. Please refresh to try again.
                </Alert> 
                {messages.length == 0 ? <p>There are no messages.</p> : 
                    <Table className="my-5">
                        <thead>
                            <tr className="d-flex flex-wrap border-1">
                            <th className="border-0 col-12 col-md-6 col-lg-4" scope="col">Message</th>
                            <th className="border-0 col-12 col-md-6 col-lg-4" scope="col">Date Submitted</th>
                            <th className="border-0 col-12 col-md-6 col-lg-2" scope="col">Status</th>
                            <th className="border-0 col-12 col-md-6 col-lg-2" scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {messages.map((msg) => {return( 
                                <tr className="d-flex flex-wrap border-1">
                                    <td style={{ overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }} className="border-0 col-12 col-md-6 col-lg-4">{msg.comment}</td>
                                    <td className="border-0 col-12 col-md-6 col-lg-4">{makeTimestamp(new Date(msg.submitted))}</td>
                                    <td className="border-0 col-12 col-md-6 col-lg-2"><Badge status={msg.isopen ? "unresolved" : "resolved"} /></td>
                                    <td className="border-0 col-12 col-md-6 col-lg-2"><Link to="/messages/message" state={{ ticketID: msg.ticketid }}>View Message</Link></td>
                                </tr>    
                            )})} 
                        </tbody>
                    </Table>
                }
            </Container> 
        </main>
    )
}