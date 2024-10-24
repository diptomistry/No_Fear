"use client";
import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface Restaurant {
  name: string;
  vicinity: string;
  rating: number;
  price_level?: number;
  place_id: string;
}

const RestaurantFinder = () => {
  const [location, setLocation] = useState('');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchNearbyRestaurants = async () => {
    try {
      setLoading(true);
      setError('');

      // First, get coordinates for the entered location
      const geocoder = new google.maps.Geocoder();
      const geocodeResult = await new Promise((resolve, reject) => {
        geocoder.geocode({ address: location }, (results, status) => {
          if (status === 'OK') {
            resolve(results?.[0].geometry.location);
          } else {
            reject(new Error('Location not found'));
          }
        });
      });

      const coords = geocodeResult as google.maps.LatLng;

      // Then search for nearby restaurants
      const service = new google.maps.places.PlacesService(
        document.createElement('div')
      );

      const request = {
        location: coords,
        radius: 1500, // 1.5km radius
        type: 'restaurant'
      };

      const results = await new Promise((resolve, reject) => {
        service.nearbySearch(request, (results, status) => {
          if (status === 'OK') {
            resolve(results);
          } else {
            reject(new Error('No restaurants found'));
          }
        });
      });

      setRestaurants(results as Restaurant[]);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Find Nearby Restaurants</h1>
        
        <div className="flex gap-4">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Enter location"
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={searchNearbyRestaurants}
            disabled={loading || !location}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Search size={20} />
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
      </div>

      {restaurants.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant.place_id}
              className="p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <h3 className="text-xl font-semibold mb-2">{restaurant.name}</h3>
              <p className="text-gray-600 mb-4">{restaurant.vicinity}</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1">{restaurant.rating || 'N/A'}</span>
                </div>
                {restaurant.price_level && (
                  <div className="text-green-600">
                    {'$'.repeat(restaurant.price_level)}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantFinder;