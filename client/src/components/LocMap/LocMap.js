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

export default function LocMap({locations}) {
    // Google maps setup stuff
    const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GMAPS
    });  
    const [map, setMap] = useState(null)
    const onLoad = React.useCallback(function callback(map) {
        const bounds = new window.google.maps.LatLngBounds(center);
        setMap(map)
    }, [])
    const onUnmount = React.useCallback(function callback(map) {
        setMap(null)
    }, [])
    const [markers, setMarkers] = useState(locations);

    useEffect(() => {
        setMarkers(locations)
    })

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
                    position={{ lat: marker.latitude, lng: marker.longitude }}
                    key={marker.id}
                    title={marker.name}
                    />
                ))}
            </GoogleMap>
            : 
            <Spinner animation="border" variant="primary" />   
            }
        </>
    )
}