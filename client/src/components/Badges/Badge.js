import React from 'react';
import Container from 'react-bootstrap/Container';

export default function Badge({ status }) {
    let text, colorClass;

    // Set text and color based on status
    switch (status) {
        // Accounts
        case 'active':
            text = 'Active';
            colorClass = 'text-bg-success';
            break;
        case 'needs approval':
            text = 'Needs Approval';
            colorClass = 'text-bg-primary';
            break;
        case 'denied':
            text = 'Denied';
            colorClass = 'text-bg-danger';
            break;
        case 'suspended':
            text = 'Suspended';
            colorClass = 'text-bg-warning';
            break;
        case 'terminated':
            text = 'Terminated';
            colorClass = 'text-bg-info';
            break;
        // Cars
        case 'available':
            text = 'Available';
            colorClass = 'text-bg-success';
            break;
        case 'rented':
            text = 'Rented';
            colorClass = 'text-bg-info';
            break;
        case 'unavailable':
            text = 'Unavailable';
            colorClass = 'text-bg-warning';
            break;
        case 'non-operational':
            text = 'Non-Operational';
            colorClass = 'text-bg-danger';
            break;
        // messages
        case 'resolved':
            text = 'Resolved';
            colorClass = 'text-bg-success';
            break;
        case 'unresolved':
            text = 'Unresolved';
            colorClass = 'text-bg-info';
            break;
        default:
            text = 'Unknown';
            colorClass = 'text-bg-secondary';
    }

    return (
        // <Container>
            <span className={`badge ${colorClass} text-white`}>{text}</span>
        // </Container>
    );
}
