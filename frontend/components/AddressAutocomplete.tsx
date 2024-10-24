import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    google: any;
  }
}

interface AddressAutocompleteProps {
  onAddressSelect: (address: string, lat: number, lng: number) => void; // Updated to send lat/lon
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({ onAddressSelect }) => {
  const inputRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const checkGoogleMapsLoaded = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        setIsLoaded(true);
      } else {
        setTimeout(checkGoogleMapsLoaded, 100);
      }
    };

    checkGoogleMapsLoaded();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      types: ['address'],
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.formatted_address && place.geometry) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        onAddressSelect(place.formatted_address, lat, lng);
      }
    });

    return () => {
      if (window.google && window.google.maps && window.google.maps.event) {
        window.google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, [isLoaded, onAddressSelect]);

  return (
    <input
      className="w-full py-3 px-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
      ref={inputRef}
      type="text"
      placeholder="Search and Set your Destination"
    />
  );
};

export default AddressAutocomplete;
