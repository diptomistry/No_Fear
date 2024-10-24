import React, { useState } from 'react';

const TripPlanner = () => {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
        Plan a new trip
      </h1>

      <div className="space-y-4">
        {/* Destination Input */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Where to?
          </label>
          <div className="relative">
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none transition-all"
              placeholder="eg. saint martin"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
              <span className="text-2xl text-gray-400">+</span>
            </button>
          </div>
        </div>

        {/* Date Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Dates (optional)
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none transition-all"
                placeholder="Start date"
              />
            </div>
            <div className="relative">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-200 focus:border-gray-400 outline-none transition-all"
                placeholder="End date"
              />
            </div>
          </div>
        </div>

        {/* Start Planning Button */}
        <div className="pt-4">
          <button className="w-full sm:w-auto px-8 py-3 bg-[#E76F51] hover:bg-[#E76F51]/90 text-white font-semibold rounded-full transition-colors flex items-center justify-center mx-auto">
            Start planning
          </button>
        </div>
      </div>
    </div>
  );
};

export default TripPlanner;