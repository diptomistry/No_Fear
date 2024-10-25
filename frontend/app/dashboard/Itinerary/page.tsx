"use client";
import TravelMap from "@/components/dashboard/ItrineryCom";
import React, { useState, useEffect } from "react";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import AuthButton from "@/components/auth/AuthButton";
import CustomModal from "@/components/CustomModal";
import TravelBudgetCalculator from "@/components/dashboard/calculator";
import { Router } from "next/router";
import { useRouter } from "next/navigation";

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
  const handlePlanning = () => {
    setIsOpen(true);
    const seletedaddress = {
      address: destination,
      lat: lat,
      lng: lng,
    };
  };
  const [isOpen2, setIsOpen2] = useState(false);
  const closeModal2 = () => setIsOpen2(false);
  const hadleCalculator = () => {
    setIsOpen2(true);
  }
  const router = useRouter();

    
  const [startDate, setStartDate] = useState("");
  const [tripDuration, setTripDuration] = useState(4); // Default to 4 days
  const [budgetPreference, setBudgetPreference] = useState("Budget"); // Default to Budget
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = () => setIsOpen(false);

  const handleSubmit = async () => {
    try {
        console.log('Destination:', destination);
        console.log('Start Date:', startDate);
        console.log('Trip Duration:', tripDuration);
        console.log('Budget Preference:', budgetPreference);
        
        const res = await fetch('http://localhost:3000/api/trip/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                destination,
                startDate,
                tripDuration,
                budgetPreference,
                userLat: lat.toString(),
                userLang: lng.toString()
            }),
            
        })

        // console.log(res);
        
        const data = await res.json();
        console.log(data);
        
        router.push(`/dashboard/home/${data.trip.id}`);
        
    } catch(error) {
        console.error('Error:', error);
    }
    // Send the trip details back when the form is submitted
  };
  return (
    <div className="min-h-screen w-full">
      <nav className="h-16 border-b px-4 flex items-center mb-10">
        <h1 className="text-xl font-semibold text-slate-800">
          Travel Itinerary Map
        </h1>
      </nav>
      <div className="flex gap-10">
        <AddressAutocomplete onAddressSelect={handleAddressSelect} />
        <button onClick={handlePlanning}>
          <AuthButton buttonText="Start Planning" />
        </button>
      </div>

      <TravelMap locations={locations} />
      <CustomModal isOpen={isOpen} onRequestClose={closeModal}>
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Selected Address
          </h2>
          <p className="mb-2">
            <span className="font-semibold">Address:</span>{" "}
            <span className="text-teal-600">{destination}</span>
          </p>
        </div>
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4">Enter Trip Details</h2>

          {/* Start Date */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">Start Date:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border rounded text-white"
            />
          </div>

          {/* Trip Duration (Slider) */}
          <div className="mb-4">
            <label className="block font-semibold mb-2">
              Trip Duration: {tripDuration} day(s)
            </label>
            <input
              type="range"
              min="1"
              max="30"
              value={tripDuration}
              onChange={(e) => setTripDuration(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Budget Preference */}
          <div className="flex w-full gap-4 ">
            <div className="mb-4 w-2/3">
              <label className="block font-semibold mb-2">
                Budget Preference:
              </label>
              <select
                value={budgetPreference}
                onChange={(e) => setBudgetPreference(e.target.value)}
                className="w-full p-2 border rounded text-white"
              >
                <option value="Budget">Budget</option>
                <option value="Standard">Standard</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>
            <div className="mt-6" onClick={hadleCalculator}>
              <AuthButton buttonText="Estimate Budget" />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-700 transition"
            >
              Submit
            </button>
          </div>
        </div>
      </CustomModal>
      <CustomModal isOpen={isOpen2} onRequestClose={closeModal2}>
        <TravelBudgetCalculator />
      </CustomModal>

    </div>
  );
}
