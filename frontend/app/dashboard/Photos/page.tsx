'use client';
import { useState, useEffect } from 'react';

// Custom hook to get user's location
const useGeolocation = () => {
  const [location, setLocation] = useState({
    loaded: false,
    coordinates: { lat: null, lng: null },
    error: null as string | null
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation({
        loaded: true,
        coordinates: { lat: null, lng: null },
        error: "Geolocation is not supported by your browser"
      });
      return;
    }

    const onSuccess = (position: { coords: { latitude: any; longitude: any; }; }) => {
      setLocation({
        loaded: true,
        coordinates: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        },
        error: null
      });
    };

    const onError = (error: { message: any; }) => {
      setLocation({
        loaded: true,
        coordinates: { lat: null, lng: null },
        error: error.message
      });
    };

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  }, []);

  return location;
};

// Component to display location
const LocationComponent = () => {
  const location = useGeolocation();

  return (
    <div className="p-4">
      {!location.loaded ? (
        <div>Loading...</div>
      ) : location.error ? (
        <div>Error: {location.error}</div>
      ) : (
        <div>
          <h2 className="text-xl font-bold mb-2">Your Current Location:</h2>
          <p>Latitude: {location.coordinates.lat}</p>
          <p>Longitude: {location.coordinates.lng}</p>
        </div>
      )}
    </div>
  );
};

export default LocationComponent;