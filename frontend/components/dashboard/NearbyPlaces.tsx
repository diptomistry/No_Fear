// components/NearbyPlaces.tsx
"use client";
import React, { useState, useEffect } from "react";

interface Place {
  place_id: string;
  name: string;
  vicinity: string;
  rating: number;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
}

interface NearbyPlacesProps {
  lat: number;
  lng: number;
  radius?: number;
  type: string;
}

const NearbyPlaces: React.FC<NearbyPlacesProps> = ({ lat, lng, radius = 1000, type }) => {
  const [places, setPlaces] = useState<Place[]>([]);

  useEffect(() => {
    const fetchNearbyPlaces = async () => {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=AIzaSyAmc3x1kHjDy8UvtI7_80Vr0bphAxm8Bl4`
      );
      const data = await res.json();
      setPlaces(data.results);
    };

    fetchNearbyPlaces();
  }, [lat, lng, radius, type]);

  return (
    <div>
      <h2>Nearby {type.charAt(0).toUpperCase() + type.slice(1)}s</h2>
      <ul>
        {places.map((place) => (
          <li key={place.place_id}>
            <strong>{place.name}</strong> - {place.vicinity}
            <br />
            Rating: {place.rating} ⭐
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NearbyPlaces;
