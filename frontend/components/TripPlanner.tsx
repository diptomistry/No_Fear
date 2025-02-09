import React, { useState } from "react";
import AddressAutocomplete from "./AddressAutocomplete";

const TripPlanner = () => {
  const [destination, setDestination] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleAddressSelect = (address: string, latitude: number, longitude: number) => {
    setDestination(address);
    setLat(latitude);
    setLng(longitude);
  };

  const handleStartPlanning = () => {
    const tripData = {
      destination,
      lat,
      lng,
      startDate,
      endDate,
    };

    localStorage.setItem('tripData', JSON.stringify(tripData));

  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
        Plan a new trip
      </h1>

      <div className="space-y-4">
        {/* Destination Input */}
        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Where to?
          </label>
          <div className="w-full">
            <AddressAutocomplete onAddressSelect={handleAddressSelect} />
          </div>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dates (optional)
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-500 mb-1">
                Start date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full py-3 px-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                placeholder="Start date"
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-500 mb-1">
                End date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full py-3 px-4 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                placeholder="End date"
              />
            </div>
          </div>
        </div>

        {/* Start Planning Button */}
        <div className="pt-4">
         <a href="/auth">
          <button
          className="w-full sm:w-auto px-8 py-3 bg-[#E76F51] hover:bg-[#E76F51]/90 text-white font-semibold rounded-full transition-colors flex items-center justify-center mx-auto"
          onClick={handleStartPlanning}
        >
          Start planning
        </button>
        </a>
        </div>
      </div>
    </div>
  );
};

export default TripPlanner;
