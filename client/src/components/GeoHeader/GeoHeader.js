import React from 'react';
import Container from 'react-bootstrap/Container';

export default function GeoHeader(props) {
    const { title } = props;
    return (
        <header className="grey-section py-5">
            <Container>
                <h1 className="fw-bold pt-5">{title}</h1>
            </Container>
        </header>
    )
}