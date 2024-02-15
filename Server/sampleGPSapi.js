const express = require('express');
const app = express();

// Define a function to generate random GPS coordinates
function generateRandomGPS() {
    // Rochester Metropolitan Area coordinates
    const rochesterLat = 43.1566;
    const rochesterLong = -77.6088;
    // Generate random offset values for latitude and longitude
    const latOffset = Math.random() * 0.1;
    const longOffset = Math.random() * 0.1;
    // Calculate random latitude and longitude
    const latitude = rochesterLat + latOffset;
    const longitude = rochesterLong + longOffset;
    return { latitude, longitude };
}

// Define a function to generate random speed, altitude, and status
function generateRandomData() {
    const speed = (Math.random() * 100).toFixed(2);
    const altitude = Math.floor(Math.random() * 1000);
    const statusOptions = ['Ignition On', 'Ignition Off'];
    const randomStatus = statusOptions[Math.floor(Math.random() * statusOptions.length)];
    return { speed, altitude, status: randomStatus };
}

// Define a route to handle API requests
app.get('/api', (req, res) => {
    // Extract the vehicle ID from the query parameters
    const { id } = req.query;
    if (!id) {
        return res.status(400).json({ error: 'Vehicle ID is required' });
    }

    // Generate random GPS coordinates
    const { latitude, longitude } = generateRandomGPS();
    // Generate random data
    const { speed, altitude, status } = generateRandomData();

    // Prepare the response
    const response = {
        request: "devicelist",
        status: "success",
        data: {
            id,
            sim_number: "234812345678",
            imei: "123456789012345",
            last_longitude: longitude.toFixed(5),
            last_latitude: latitude.toFixed(5),
            last_speed: speed,
            last_altitude: altitude,
            last_status: status,
            last_track_time: new Date().toISOString(),
            last_heartbeat: new Date().toISOString()
        }
    };

    // Send the response
    res.json(response);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

