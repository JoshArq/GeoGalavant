import React from 'react';
import { useState, useEffect } from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '100%',
    minHeight: '400px'
};

const center = {
    lat: 43.1525309,
    lng: -77.6128899
};

const markers = [
    {
        id: 1,
        lat: 43.1347097,
        lng: -77.635994
    },
    {
        id: 2,
        lat: 43.0881822,
        lng: -77.7050607
    },
    {
        id: 3,
        lat: 43.1268778,
        lng: -77.7219486
    },
];

export default function LocMap(props) {

    // Google maps setup stuff
    const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GMAPS
    });  
    const [map, setMap] = React.useState(null)
    const onLoad = React.useCallback(function callback(map) {
        const bounds = new window.google.maps.LatLngBounds(center);
        setMap(map)
    }, [])
    const onUnmount = React.useCallback(function callback(map) {
        setMap(null)
    }, [])

    return (
        <>
            {isLoaded ?
            <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
            onLoad={onLoad}
            onUnmount={onUnmount}
            >
            {markers.map(marker => (
                    <MarkerF
                    position={{ lat: marker.lat, lng: marker.lng }}
                    key={marker.id}
                    />
                ))}
            </GoogleMap>
            : 
            <Spinner animation="border" variant="primary" />   
            }
        </>
    )
}