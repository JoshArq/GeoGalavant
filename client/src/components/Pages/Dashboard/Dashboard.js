import React from 'react';
import Container from 'react-bootstrap/Container';
import Header from '../../GeoHeader/GeoHeader.js';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

function AddNewLocation(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            New Location
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form>
                <Form.Group className="mb-3" controlId="latitude">
                    <Form.Label>Latitude</Form.Label>
                    <Form.Control type="text" placeholder="Enter coordinate" required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="longitude">
                    <Form.Label>Longitude</Form.Label>
                    <Form.Control type="text" placeholder="Enter coordinate" required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="longitude">
                    <Form.Label>Street Address</Form.Label>
                    <Form.Control type="text" placeholder="Enter address" required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="state">
                    <Form.Label>State</Form.Label>
                    <Form.Select name="stateSelect" required>
                        <option value="">Select...</option>
                        <option value="AL">Alabama</option>
                        <option value="AK">Alaska</option>
                        <option value="AZ">Arizona</option>
                        <option value="AR">Arkansas</option>
                        <option value="CA">California</option>
                        <option value="CO">Colorado</option>
                        <option value="CT">Connecticut</option>
                        <option value="DE">Delaware</option>
                        <option value="DC">District Of Columbia</option>
                        <option value="FL">Florida</option>
                        <option value="GA">Georgia</option>
                        <option value="HI">Hawaii</option>
                        <option value="ID">Idaho</option>
                        <option value="IL">Illinois</option>
                        <option value="IN">Indiana</option>
                        <option value="IA">Iowa</option>
                        <option value="KS">Kansas</option>
                        <option value="KY">Kentucky</option>
                        <option value="LA">Louisiana</option>
                        <option value="ME">Maine</option>
                        <option value="MD">Maryland</option>
                        <option value="MA">Massachusetts</option>
                        <option value="MI">Michigan</option>
                        <option value="MN">Minnesota</option>
                        <option value="MS">Mississippi</option>
                        <option value="MO">Missouri</option>
                        <option value="MT">Montana</option>
                        <option value="NE">Nebraska</option>
                        <option value="NV">Nevada</option>
                        <option value="NH">New Hampshire</option>
                        <option value="NJ">New Jersey</option>
                        <option value="NM">New Mexico</option>
                        <option value="NY">New York</option>
                        <option value="NC">North Carolina</option>
                        <option value="ND">North Dakota</option>
                        <option value="OH">Ohio</option>
                        <option value="OK">Oklahoma</option>
                        <option value="OR">Oregon</option>
                        <option value="PA">Pennsylvania</option>
                        <option value="RI">Rhode Island</option>
                        <option value="SC">South Carolina</option>
                        <option value="SD">South Dakota</option>
                        <option value="TN">Tennessee</option>
                        <option value="TX">Texas</option>
                        <option value="UT">Utah</option>
                        <option value="VT">Vermont</option>
                        <option value="VA">Virginia</option>
                        <option value="WA">Washington</option>
                        <option value="WV">West Virginia</option>
                        <option value="WI">Wisconsin</option>
                        <option value="WY">Wyoming</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3" controlId="zipcode">
                    <Form.Label>Zip Code</Form.Label>
                    <Form.Control type="text" placeholder="Enter zip" required />
                </Form.Group>
            </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="" onClick={props.onHide}>Cancel</Button>
          <Button onClick={props.onHide}>Submit</Button>
        </Modal.Footer>
      </Modal>
    );
  }

export default function Dashboard() {
    const [modalShow, setModalShow] = React.useState(false);

    return (
        <main>
             <AddNewLocation
                show={modalShow}
                onHide={() => setModalShow(false)}
            />

            <Header title="Dashboard" />
            <Container as={'section'}>
                <Button onClick={() => setModalShow(true)} className="mt-3"><i class="bi bi-plus"></i> Add New Location</Button>

                <Row>
                    <Col md="4">
                        <Card className="mt-4 grey-section">
                            <Card.Body>
                                <Card.Title as={'h3'} className="fs-4 fw-bold mb-3">
                                    Gyrogogo Northwest
                                </Card.Title>
                                <Card.Text>
                                    <p>3 Available Cars</p>
                                    <p>2 Cars Offline</p>
                                    <p>7 Pick-ups in past month</p>
                                    <p>6 Drop-offs in past month</p>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md="4">
                        <Card className="mt-4 grey-section">
                            <Card.Body>
                                <Card.Title as={'h3'} className="fs-4 fw-bold mb-3">
                                    Gyrogogo Northeast
                                </Card.Title>
                                <Card.Text>
                                    <p>3 Available Cars</p>
                                    <p>2 Cars Offline</p>
                                    <p>7 Pick-ups in past month</p>
                                    <p>6 Drop-offs in past month</p>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md="4">
                        <Card className="mt-4 grey-section">
                            <Card.Body>
                                <Card.Title as={'h3'} className="fs-4 fw-bold mb-3">
                                    Gyrogogo Center City
                                </Card.Title>
                                <Card.Text>
                                    <p>3 Available Cars</p>
                                    <p>2 Cars Offline</p>
                                    <p>7 Pick-ups in past month</p>
                                    <p>6 Drop-offs in past month</p>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
                <Row>
                    <Col md="4">
                        <Card className="mt-4 grey-section">
                            <Card.Body>
                                <Card.Title as={'h3'} className="fs-4 fw-bold mb-3">
                                    Gyrogogo Southeast
                                </Card.Title>
                                <Card.Text>
                                    <p>3 Available Cars</p>
                                    <p>2 Cars Offline</p>
                                    <p>7 Pick-ups in past month</p>
                                    <p>6 Drop-offs in past month</p>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md="4">
                        <Card className="mt-4 grey-section">
                            <Card.Body>
                                <Card.Title as={'h3'} className="fs-4 fw-bold mb-3">
                                    Gyrogogo Airport
                                </Card.Title>
                                <Card.Text>
                                    <p>3 Available Cars</p>
                                    <p>2 Cars Offline</p>
                                    <p>7 Pick-ups in past month</p>
                                    <p>6 Drop-offs in past month</p>
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container> 
        </main>
    )
}