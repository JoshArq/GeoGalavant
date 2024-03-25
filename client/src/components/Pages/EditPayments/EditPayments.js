import * as React from 'react';
import { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import './EditPayments.scss';

let dataTemplate = {
    number: "",
    fullName: "",
    expirationDate: "",
    ccv: "",
}

export default function EditPayments() {
    const [data, setData] = useState({cards: [
        {
            number: 12567890,
            fullName: "John Doe",
            expirationDate: "01/25",
            ccv: "123",
        },
        {
            number: 12567890,
            fullName: "John Doe",
            expirationDate: "01/25",
            ccv: "123",
        },
    ]});
    const [step, setStep] = useState(0);
    const [isValid, setIsValid] = useState(true);
    const [isSent, setIsSent] = useState(false);
    const [numCards, setNumCards] = useState(1);

    useEffect(() => {
        // let profile = document.getElementById("profile");
        // profile.username.value = "jdoe1234";
    }, [])

    // Add new card form 
    const addNew = () => {
        let cardsArr = data.cards;
        cardsArr.push({
            new: true, // indicates this is a new card, so we can differentiate between adding and updating in the save
            number: "",
            fullName: "",
            expirationDate: "",
            ccv: "",
        })
        setData({cards: cardsArr})
    }

    // Delete a card
    const deleteCard = (index) => {
        let cardsArr = data.cards;
        // Save data currently
        cardsArr.forEach((card, index) => {
            let form = document.getElementById("card-" + index);
            card.number = form.cardNum.value;
            card.fullName = form.cardName.value;
            card.expirationDate = form.cardExp.value;
            card.ccv = form.ccvNum.value;
        })
        // Delete card
        cardsArr.splice(index, 1)
        // Reset data view
        setData({cards: cardsArr})
        cardsArr.forEach((card, index) => {
            let form = document.getElementById("card-" + index);
            form.cardNum.value = card.number;
            form.cardName.value = card.fullName;
            form.cardExp.value = card.expirationDate;
            form.ccvNum.value = card.ccv;
        })
    }
    
    return (
        <Container as={'main'} className="py-5">
            <h1 className="mb-4 fw-bold">Edit Payment Methods</h1>
            <p className="mb-4">Click "save" to save new cards and updates to existing cards.</p>
            <Card className="border-0 grey-section p-4">
                <Card.Body>
                    <div id="cards">
                        {data.cards.map((card, index) => { return (
                        <Form id={"card-" + index} className="mb-4">
                            <Row>
                                <Col md={10} lg={11}>
                                    <h2 className="fw-bold mb-3">Credit Card</h2>
                                    <Form.Group className="mb-3" controlId="cardNum">
                                        <Form.Label>Credit Card Number</Form.Label>
                                        <Form.Control type="text" placeholder="1234567890" required defaultValue={card.number} />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="cardName">
                                        <Form.Label>Name on Card</Form.Label>
                                        <Form.Control type="text" placeholder="John Doe" required defaultValue={card.fullName} />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="cardExp">
                                        <Form.Label>Credit Card Expiration Date (MM/YY)</Form.Label>
                                        <Form.Control type="text" placeholder="01/25"  pattern="\d{1,2}/\d{2}" required defaultValue={card.expirationDate} />
                                    </Form.Group>
                                    <Form.Group className="mb-3" controlId="ccvNum">
                                        <Form.Label>CCV</Form.Label>
                                        <Form.Control type="password" placeholder="123" required defaultValue={card.ccv} />
                                    </Form.Group>
                                </Col>
                                <Col md={2} lg={1}>
                                    <Button className="float-end" variant="danger" onClick={() => {deleteCard(index)}}>Delete</Button>
                                </Col>
                            </Row>
                            <hr className="border-2 opacity-100" />
                        </Form>
                        )})}
                    </div>
                    <Button onClick={() => {addNew()}}>Add New<i className="bi bi-plus mx-2"></i></Button>
                </Card.Body>
            </Card>
            <Button className="float-end my-4">Save</Button>
        </Container>
    )
}