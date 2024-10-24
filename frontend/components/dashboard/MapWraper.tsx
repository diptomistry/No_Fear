import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

interface MapWrapperProps {
  locations: Array<{
    id: string;
    coordinates: {
      lat: number;
      lng: number;
    };
    type: string;
  }>;
  onMarkerClick: (locationId: string) => void;
}

const MapWrapper: React.FC<MapWrapperProps> = ({ locations, onMarkerClick }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const markersRef = useRef<{ [key: string]: google.maps.Marker }>({});

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      version: 'weekly',
      libraries: ['places']
    });

    loader.load().then(() => {
      if (mapRef.current) {
        const mapInstance = new google.maps.Map(mapRef.current, {
          center: locations[0]?.coordinates || { lat: 0, lng: 0 },
          zoom: 13,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        });

        setMap(mapInstance);
      }
    });
  }, []);

  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.setMap(null));
    markersRef.current = {};

    // Add new markers
    locations.forEach(location => {
      const marker = new google.maps.Marker({
        position: location.coordinates,
        map: map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: getMarkerColor(location.type),
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: '#ffffff'
        }
      });

      marker.addListener('click', () => onMarkerClick(location.id));
      markersRef.current[location.id] = marker;
    });

    // Fit bounds to show all markers
    const bounds = new google.maps.LatLngBounds();
    locations.forEach(location => {
      bounds.extend(location.coordinates);
    });
    map.fitBounds(bounds);
  }, [map, locations, onMarkerClick]);

  return <div ref={mapRef} className="w-full h-full" />;
};

const getMarkerColor = (type: string): string => {
  switch (type) {
    case 'transport':
      return '#3B82F6'; // blue-500
    case 'restaurant':
      return '#F97316'; // orange-500
    case 'hotel':
      return '#A855F7'; // purple-500
    default:
      return '#EF4444'; // red-500
  }
};

export default MapWrapper;