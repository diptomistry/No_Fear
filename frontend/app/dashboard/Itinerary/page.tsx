"use client";
import TravelMap from "@/components/dashboard/ItrineryCom";
import React, { useState, useEffect } from "react";
import AddressAutocomplete from "@/components/AddressAutocomplete";

// Define the Location type with an 'id' property
type Location = {
  id: string;
  name: string;
  type: "hotel" | "transport" | "restaurant";
  coordinates: {
    lat: number;
    lng: number;
  };
  address: string;
  description: string;
};

export default function MapPage() {
  const [geolocation, setGeolocation] = useState<{
    loaded: boolean;
    coordinates: { lat: number; lng: number };
    error: string | null;
  }>({
    loaded: false,
    coordinates: { lat: 0, lng: 0 },
    error: null,
  });

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setGeolocation((state) => ({
        ...state,
        loaded: true,
        error: "Geolocation not supported",
      }));
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGeolocation({
          loaded: true,
          coordinates: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          error: null,
        });
      },
      (error) => {
        setGeolocation((state) => ({
          ...state,
          loaded: true,
          error: error.message,
        }));
      }
    );
  }, []);
  const [destination, setDestination] = useState("");
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
  const [locations, setLocations] = useState<Location[]>([]); // State to store locations

  const handleAddressSelect = (
    address: string,
    latitude: number,
    longitude: number
  ) => {
    setDestination(address);
    setLat(latitude);
    setLng(longitude);
    postTripData(address, latitude, longitude);
  };

  const postTripData = async (
    address: string,
    latitude: number,
    longitude: number
  ) => {
    const token = localStorage.getItem("token"); // Assuming the token is stored in local storage
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const response = await fetch(`${baseUrl}/api/trip/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        destination: address,
        userLat: latitude.toString(),
        userLang: longitude.toString(),
        tripDuration: "4",
        budgetPreference: "Budget",
      }),
    });
    console.log(response);

    if (response.ok) {
      const data = await response.json();
      console.log("Response:", data);

      const extractedLocations: Location[] = [];

      // Process accommodation options
      data.accommodationOptions.forEach((option: any, index: number) => {
        extractedLocations.push({
          id: (index + 1).toString(),
          name: option.name,
          type: "hotel",
          coordinates: { lat: option.latitude, lng: option.longitude },
          address: option.name, // You can replace this with actual address if available
          description: `Accommodation option: ${option.type}`,
        });
      });

      // Process transport options
      data.transportOptions.forEach((option: any) => {
        extractedLocations.push({
          id: (extractedLocations.length + 1).toString(),
          name: option.type,
          type: "transport",
          coordinates: { lat: option.latitude, lng: option.longitude }, // Assuming latitude and longitude exist
          address: option.type, // Replace with actual address if available
          description: `Transport option: ${option.type}, Estimated time: ${option.timeEstimate}`,
        });
      });

      // Process meal plans
      data.mealPlans.forEach((option: any) => {
        extractedLocations.push({
          id: (extractedLocations.length + 1).toString(),
          name: option.location,
          type: "restaurant",
          coordinates: { lat: option.latitude, lng: option.longitude },
          address: option.location, // Replace with actual address if available
          description: `Meal option with cost: ${option.cost}`,
        });
      });

      console.log("Extracted Locations:", extractedLocations);
      setLocations(extractedLocations.slice(0, 10)); // Limit to first 10 locations
      alert("Location Selected");
    } else {
      console.error("Error:", response.statusText);
    }
  };
  //store current location to localstorage
  useEffect(() => {
    if (geolocation.loaded && !geolocation.error) {
      localStorage.setItem(
        "currentLocation",
        JSON.stringify(geolocation.coordinates)
      );
    }
  }, [geolocation]);

  return (
    <div className="min-h-screen w-full">
      <nav className="h-16 border-b px-4 flex items-center mb-10">
        <h1 className="text-xl font-semibold text-slate-800">
          Travel Itinerary Map
        </h1>
      </nav>
      <AddressAutocomplete onAddressSelect={handleAddressSelect} />

      <TravelMap locations={locations} />
    </div>
  );
}
